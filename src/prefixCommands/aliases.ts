import { ElainaPrefixCommand, ElainaErrorMessage, constants } from "../index";
import { MessageEmbed } from "discord.js";

export default new ElainaPrefixCommand({
  name: "aliases",
  description: "Get the aliases for a specific prefix command.",
  aliases: [],
  category: "Info",
  usage: "{prefix}aliases `<command name>`",
  examples: ["{prefix}aliases tictactoe"],
  onlyChannels: ["commands", "fun-bots", "hentai", "anime"],
  run: (client, message, args) => {
    if (!args[0]) {
      return message.reply(
        new ElainaErrorMessage("Please specify a command!\nExample: `e!aliases tictactoe`", {
          mention: true
        })
      );
    }
    
    const command = client.prefixCommands.get(args[0]);
    
    if (!command) {
      return message.reply(
        new ElainaErrorMessage("The command you specified is either a **`slash command`** or is invalid.", {
          mention: true
        })
      );
    }
    
    const aliases = command.aliases.length ? "`"+command.aliases.join("`, `")+"`" : "*No aliases found for this command.*";
    
    message.reply({
      embeds: [
        new MessageEmbed()
          .setColor(constants.Colors.MAIN_EMBED_COLOR)
          .setAuthor({ name: `Aliases for the ${args[0]} command`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
          .setDescription(aliases)
      ]
    })
  }
});
