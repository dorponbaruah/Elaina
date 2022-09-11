import client, { Event, ElainaErrorMessage, typings, constants } from "../index";
import { Snowflake } from "discord.js";

export default new Event("interactionCreate", async (interaction) => {
  // Slash command handler 
  if (interaction.isCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return interaction.reply(
      new ElainaErrorMessage("Something went wrong!", {
        ephemeral: true
      })
    );

    if (command.category.toLowerCase() === "developer" && interaction.user.id !== process.env.developerId)
      return interaction.reply(
        new ElainaErrorMessage("This command can only be used by the bot owner.", {
          ephemeral: true
        })
      );
    
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
    
        return interaction.reply(
          new ElainaErrorMessage(`Use this command in this/these channel(s)\n\n> <#${channels.join(">, <#")}>`, {
            ephemeral: true
          })
        );
      }
    }
    
    command.run(client, interaction as typings.ExtendedCommandInteraction);
  }
});
