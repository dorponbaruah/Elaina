import { ElainaPrefixCommand, constants } from "../index";
import { MessageEmbed } from "discord.js";

export default new ElainaPrefixCommand({
  name: "help",
  description: "List of my commands.",
  aliases: ["commands", "cmds"],
  category: "Info",
  run: (client, message, args) => {
    const commands: { [key: string]: string[] } = {
      info: [],
      serverSettings: [],
      fun: [],
      anime: [],
      hentai: []
    }
    
    client.prefixCommands.forEach(command => {
      switch (command.category) {
        case 'Info':
          commands.info.push(command.name);
          break;
        
        case 'Server Settings':
          commands.serverSettings.push(command.name);
          break;
        
        case 'Fun':
          commands.fun.push(command.name);
          break;
        
        case 'Anime':
          commands.anime.push(command.name);
          break;
        
        case 'Hentai':
          commands.hentai.push(command.name);
      }
    });
    
    client.slashCommands.forEach(command => {
      switch (command.category) {
        case 'Info':
          commands.info.push(...command.subcommands.map(cmdName => `[/]${cmdName}`) || `[/]${command.name}`);
          break;
    
        case 'Server Settings':
          commands.serverSettings.push(...command.subcommands.map(cmdName => `[/]${cmdName}`) || `[/]${command.name}`);
          break;
    
        case 'Fun':
          commands.fun.push(...command.subcommands.map(cmdName => `[/]${cmdName}`) || `[/]${command.name}`);
          break;
    
        case 'Anime':
          commands.anime.push(...command.subcommands.map(cmdName => `[/]${cmdName}`) || `[/]${command.name}`);
          break;
    
        case 'Hentai':
          commands.hentai.push(...command.subcommands.map(cmdName => `[/]${cmdName}`) || `[/]${command.name}`);
      }
    });
    
    const embed = new MessageEmbed()
      .setColor(constants.Colors.MAIN_EMBED_COLOR)
      .addFields([
        {
          name: `${constants.Emojis.INFO} Info`,
          value: `\`${commands.info.join("`, `")}\``
        },
        {
          name: `⚙️ Server Settings`,
          value: `\`${commands.serverSettings.join("`, `")}\``
        },
        {
          name: `🧩 Fun`,
          value: `\`${commands.fun.join("`, `")}\``
        },
        {
          name: `🌸 Anime`,
          value: `\`${commands.anime.join("`, `")}\``
        },
        {
          name: `💀 Hentai`,
          value: `\`${commands.hentai.join("`, `")}\``
        }
      ]);
      
    message.channel.send({ embeds: [embed] });
  }
});
