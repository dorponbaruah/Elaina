import bot, { ElainaPrefixCommand, ElainaErrorMessage, constants } from "../index";
import { MessageEmbed, Interaction, SelectMenuInteraction } from "discord.js";
import getHelpTemplates from "../templates/help";

export default new ElainaPrefixCommand({
  name: "help",
  description: "Get instant guidance on my commands.",
  aliases: ["commands", "cmds"],
  category: "Info",
  onlyChannels: ["commands", "fun-bots", "hentai", "anime", "waifu", "waifus", "animal", "animals"],
  usage: "{prefix}help `[command name]`",
  examples: ["{prefix}help", "{prefix}help tictactoe"],
  run: async (client, message, args) => {
    if (args[0]) {
      const command = client.prefixCommands.get(args[0]);

      if (!command) {
        return message.reply(
          new ElainaErrorMessage("The command you specified is either a **`slash command`** or is invalid.", {
            mention: true
          })
        );
      }

      const embedFields = [{
        name: "Usage:",
        value: command.usage.replace("{prefix}", constants.Prefixes[1])
      }];

      if (command.usage.includes("[") || command.usage.includes("<")) {
        embedFields.push({
          name: "Remove brackets when typing commands",
          value: "```[] = optional arguments\n<> = required arguments```"
        });
      }

      if (command.examples?.length) {
        embedFields.push({
          name: "Example(s):",
          value: command.examples.join("\n").replace("{prefix}", constants.Prefixes[1])
        });
      }

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setAuthor({ name: `Info | ${command.name} command`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
            .setColor(constants.Colors.MAIN_EMBED_COLOR)
            .setDescription(command.description)
            .addFields(embedFields)
        ]
      });
    }
    
    const row = getHelpTemplates("categorySelectionMenu");

    const msg = await message.reply({ 
      embeds: [getHelpTemplates("getStartedEmbed", message)],
      components: [row]
    });
    
    const timeoutId = setTimeout(() => {
      row.components[0].disabled = true;
      
      if (msg) msg.edit({ components: [row] });
      
      client.timeoutIds.delete(msg.id);
    }, 24000);
    
    client.timeoutIds.set(msg.id, timeoutId);
  },
  
  eventListener: {
    event: "interactionCreate",
    run: async (interaction: Interaction) => {
      if (!interaction.inCachedGuild()) return;
      if (interaction.isSelectMenu() && (interaction as SelectMenuInteraction).customId === "COMMAND_CATEGORY_SELECTOR_IN_HELP_COMMAND") {
        await clearTimeout(bot.timeoutIds.get(interaction.message.id));
      
        bot.timeoutIds.delete(interaction.message.id);
      
        const selectedCategory = interaction.values[0].split("||")[1].toLowerCase();
        
        let embeds: MessageEmbed[];
        
        if (selectedCategory === "getstarted") {
          embeds = [getHelpTemplates("getStartedEmbed", interaction)]
        }
        else if (selectedCategory === "allcommands") {
          embeds = [getHelpTemplates("allCommandsEmbed")]
        }
        else {
          embeds = [getHelpTemplates("commandsListEmbeds")[selectedCategory]];
        }
        
        const row = getHelpTemplates("categorySelectionMenu");
        
        const msg = await interaction.update({
          embeds,
          components: [row],
          fetchReply: true
        });
        
        const timeoutId = setTimeout(async () => {
          row.components[0].disabled = true;
        
          if (msg) msg.edit({ components: [row] });
            
          bot.timeoutIds.delete(msg.id);
          
          console.log(bot.timeoutIds.keys());
        }, 24000);
        
        bot.timeoutIds.set(msg.id, timeoutId);
      }
    }
  }
});