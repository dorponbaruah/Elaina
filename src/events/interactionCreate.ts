import client, { Event, ElainaErrorMessage, typings, constants } from "../index";
import { Snowflake, GuildMember, MessageButton, MessageActionRow, Message, User } from "discord.js";

export default new Event("interactionCreate", async (interaction) => {
  // Slash command handler 
  if (interaction.isCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    
    const throwError = function(errorMessage: string): void {
      interaction.reply(
        new ElainaErrorMessage(errorMessage, {
          ephemeral: true
        })
      );
    };
    
    if (!command) return throwError("This command doesn't exist!");
    
    switch (command.category?.toUpperCase().split(" ").join("_")) {
      case "DEVELOPER":
        if (interaction.user.id !== process.env.developerId) {
          return throwError("This command can only be used by the bot owner.");
        }
      break;
      
      case "SERVER_SETTINGS":
        if (!(interaction.member as GuildMember).permissions.has("MANAGE_GUILD")) {
          return throwError("This command can only be used by the server managers.");
        }
    }
    
    if (command.onlyChannels) {
      if (
        !command.onlyChannels.includes(interaction.channel.name) &&
        interaction.channel.name !== "chaos"
      ) {
        const channels: Snowflake[] = [];
    
        for await (const channelName of command.onlyChannels) {
          const channel = client.guilds.cache
            .get(JSON.parse((process.env.guildIds) as string)[1])!
            .channels.cache.find(c => c.name === channelName);
            
          if (channel) channels.push(channel.id);
        }
    
        return throwError(`Use this command in this/these channel(s)\n> <#${channels.join(">, <#")}>`);
      }
    }
    
    command.run(client, interaction as typings.ExtendedCommandInteraction);
  }
  ////// Custom function buttons //////
  if (interaction.isButton()) {
    // Hentai role confirmation button
    if (interaction.customId === "HENTAI_ROLE_CONFIRMATION_BUTTON") {
      interaction.reply({
        content: "The `hentai` channel is NSFW! Are you sure you want to access that channel?",
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setStyle("PRIMARY")
              .setLabel("Yes, I know what I'm doing.")
              .setCustomId("e/br:2:962346685592403998")
          )
        ],
        ephemeral: true
      });
    }
    
    const { message, customId, member, channel } = interaction;
    
    if (customId === "PIN_THE_MESSAGE_MAN") {
      try {
        await (message as Message).pin(`${member.user.username} pinned in ${channel.name}`);
    
        (message.components[0].components[0] as MessageButton)
          .setLabel("Pinned")
          .setDisabled(true);
    
        interaction.update({
          components: message.components as MessageActionRow[]
        });
      }
      catch (error) {
        console.error(error);
    
        interaction.reply({ content: `Failed to pin the message.\n\n**Error message**:\n\`\`\`${error.message}\n\`\`\``, ephemeral: true });
      }
    }
    
    if (customId === "SEND_IN_MY_DMS") {
      try {
        await (member.user as User).send({ embeds: message.embeds });
    
        interaction.reply({ content: "Check your DMs!", ephemeral: true });
      }
      catch (error) {
        console.error(error);
    
        interaction.reply({ content: `Failed to send DM!\n\n**Error message**:\n\`\`\`${error.message}\n\`\`\``, ephemeral: true });
      }
    }
  }
});
