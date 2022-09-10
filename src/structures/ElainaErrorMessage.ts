import { constants, typings } from "../index";
import { MessageOptions, InteractionReplyOptions } from "discord.js";

export class ElainaErrorMessage {
  public content: MessageOptions["content"];
  public allowedMentions: MessageOptions["allowedMentions"];
  public ephemeral: InteractionReplyOptions["ephemeral"];
  
  constructor (
    message: string,
    options?: typings.IElainaErrorMessageOptions
  ) {
    this.content = constants.Emojis.ERROR+" "+ message;
    this.allowedMentions = { repliedUser: options?.mention ?? false }
    this.ephemeral = options?.ephemeral ?? false;
  }
}
