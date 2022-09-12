import client, { typings } from "../index";
import { WebhookMessageOptions, WebhookEditMessageOptions, WebhookClient, WebhookClientDataURL, WebhookClientDataIdWithToken, GuildTextBasedChannel, ThreadChannel, Snowflake, Message } from "discord.js";

export class ElainaWebhook {
  private _data: typings.IElainaWebhookData;
  private _send: WebhookMessageOptions;
  private _createdWebhook: string;
 
  constructor(data: typings.IElainaWebhookData, sendOptions: WebhookMessageOptions | WebhookEditMessageOptions) {
    this._data = data;
    this._send = sendOptions;
  }
  
  private async createWebhook(channelId: Snowflake) {
    let webhookUrl: string;
  
    const channel = client.channels.cache.get(channelId) as GuildTextBasedChannel;
  
    if (!channel || channel instanceof ThreadChannel) return;
  
    const myWebhooks = (await channel.fetchWebhooks()).filter(
      webhook => webhook.owner.id === client.user!.id
    );
  
    webhookUrl = (
      myWebhooks.size !== 0 ?
      myWebhooks.first().url :
      (await channel.createWebhook(client.user.username, {
        avatar: client.user.displayAvatarURL({ size: 4096 })
      })).url
    );
  
    this._createdWebhook = webhookUrl;
  }

  public async send() {
    let webhookClientData: WebhookClientDataURL | WebhookClientDataIdWithToken | null;
  
    switch (true) {
      case "url" in this._data:
        webhookClientData = { url: this._data.url }
        break;
  
      case "id" in this._data && "token" in this._data:
        webhookClientData = { id: this._data.id, token: this._data.token }
        break;
  
      case "channelId" in this._data:
        await this.createWebhook(this._data.channelId);
        
        webhookClientData = (
          this._createdWebhook ?
          { url: this._createdWebhook } :
          null
        );
        break;
  
      default:
        webhookClientData = null;
    }
  
    if (webhookClientData === null) throw new Error("No valid webhook or channel specified.");

    const webhookClient = new WebhookClient(webhookClientData!);
    
    return webhookClient.send(this._send);
  }
  
  public async edit() {
    let message: Message;
    let channel: GuildTextBasedChannel;
    
    switch (true) {
      case "messageUrl" in this._data:
        let url = this._data.messageUrl.split("/");

        url = url.slice(url.length - 3);
        
        channel = client.channels.cache.get(url[1]) as GuildTextBasedChannel;
        message = await channel.messages.fetch(url[2]);
        break;
      
      case "channelId" in this._data && "messageId" in this._data:
        channel = client.channels.cache.get(this._data.channelId) as GuildTextBasedChannel;
        message = await channel.messages.fetch(this._data.messageId);
        break;
      
      default:
        channel = null;
        message = null;
    }
    
    if (channel === null || message === null)
      throw new Error("No valid APIMessage or channel and message ID specified.")
   
    if (!channel || channel instanceof ThreadChannel) return;
   
    const foundWebhook = (await channel.fetchWebhooks()).filter(webhook => {
      return webhook.id === message.webhookId && webhook.owner.id === client.user!.id;
    });
    
    if (!foundWebhook.size)
      throw new Error("Couldn't find webhook.");
    
    const webhookClient = new WebhookClient({ url: foundWebhook.first().url });
    
    ["username", "avatarURL"]
      .forEach(key => delete this._send[key]);
    
    webhookClient.editMessage(message.id, this._send);
  }
}
