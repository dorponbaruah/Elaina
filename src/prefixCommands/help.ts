import { ElainaPrefixCommand, constants } from "../index";
import { MessageEmbed } from "discord.js";

export default new ElainaPrefixCommand({
  name: "help",
  description: "List of my commands.",
  aliases: ["commands", "cmds"],
  category: "Info",
  onlyChannels: ["commands"],
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
          if (command.subcommands) {
            commands.info.push(...command.subcommands.map(cmdName => `[/]${cmdName}`));
          }
          else {
            commands.info.push(`[/]${command.name}`);
          }
          break;
    
        case 'Server Settings':
          if (command.subcommands) {
            commands.serverSettings.push(...command.subcommands.map(cmdName => `[/]${cmdName}`));
          }
          else {
            commands.serverSettings.push(`[/]${command.name}`);
          }
          break;
    
        case 'Fun':
          if (command.subcommands) {
            commands.fun.push(...command.subcommands.map(cmdName => `[/]${cmdName}`));
          }
          else {
            commands.fun.push(`[/]${command.name}`);
          }
          break;
    
        case 'Anime':
          if (command.subcommands) {
            commands.anime.push(...command.subcommands.map(cmdName => `[/]${cmdName}`));
          }
          else {
            commands.anime.push(`[/]${command.name}`);
          }
          break;
    
        case 'Hentai':
          if (command.subcommands) {
            commands.hentai.push(...command.subcommands.map(cmdName => `[/]${cmdName}`));
          }
          else {
            commands.hentai.push(`[/]${command.name}`);
          }
      }
    });
    
    const helpEmbed = new MessageEmbed()
      .setColor(constants.Colors.MAIN_EMBED_COLOR)
      .setAuthor({ name: "Help Command", iconURL: message.member.displayAvatarURL({ dynamic: true }) })
      .setDescription(`Hello I'm **${client.user?.username}**, a discord bot designed to serve the <@&891974559610318878> of ${message.guild.name}.\n\nMy prefixes are \`e!\` and \`e\`, but pinging me always works.`)
      .setImage("https://media.discordapp.net/attachments/926846660322160700/1118218083681697812/chrome_screenshot_1686674319357.png")
    
    const commandListEmbed = new MessageEmbed()
      .setDescription("Here is the list of my commands!")
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
          value: `||\`${commands.hentai.join("`, `")}\`||`
        }
      ]);
      
    message.channel.send({ embeds: [helpEmbed, commandListEmbed] });
  }
});
