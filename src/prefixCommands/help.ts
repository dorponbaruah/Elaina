import { ElainaPrefixCommand, ElainaErrorMessage, constants } from "../index";
import { MessageEmbed } from "discord.js";

export default new ElainaPrefixCommand({
  name: "help",
  description: "Get the list of my commands or more info on a specific prefix command.",
  aliases: ["commands", "cmds"],
  category: "Info",
  onlyChannels: ["commands", "fun-bots", "hentai", "anime", "waifu", "waifus", "animal", "animals"],
  usage: "{prefix}help `[command name]`",
  examples: ["{prefix}help", "{prefix}help tictactoe"],
  run: (client, message, args) => {
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

    const commands: {
      [key: string]: string[] } = {
      info: [],
      serverSettings: [],
      fun: [],
      animal: [],
      hentai: [],
      waifu: [],
      anime: []
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

        case 'Waifu':
          commands.waifu.push(command.name);
          break;

        case 'Hentai':
          commands.hentai.push(command.name);
          break;
        
        case 'Animal':
          commands.animal.push(command.name);
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

        case 'Waifu':
          if (command.subcommands) {
            commands.waifu.push(...command.subcommands.map(cmdName => `[/]${cmdName}`));
          }
          else {
            commands.waifu.push(`[/]${command.name}`);
          }
          break;

        case 'Hentai':
          if (command.subcommands) {
            commands.hentai.push(...command.subcommands.map(cmdName => `[/]${cmdName}`));
          }
          else {
            commands.hentai.push(`[/]${command.name}`);
          }
          break;
        
        case 'Animal':
          if (command.subcommands) {
            commands.animal.push(...command.subcommands.map(cmdName => `[/]${cmdName}`));
          }
          else {
            commands.animal.push(`[/]${command.name}`);
          }
      }
    });

    const helpEmbed = new MessageEmbed()
      .setColor(constants.Colors.MAIN_EMBED_COLOR)
      .setAuthor({ name: "Help Command", iconURL: message.member.displayAvatarURL({ dynamic: true }) })
      .setDescription(`Hello I'm **${client.user?.username}**, a discord bot designed to serve the <@&891974559610318878> of ${message.guild.name}.\n\nMy prefixes are '\`e!\`' and '\`e\`', however mentioning (@) me always works.`)
      .setImage("https://media.discordapp.net/attachments/926846660322160700/1143037522717454366/Picsart_23-08-21_09-41-08-668.jpg")

    const commandListEmbed = new MessageEmbed()
      .setDescription(`Here is the list of my commands!\n\n**Use ${constants.Prefixes[1]}help \`[command name]\` to get info on a specific command. (Doesn't work for \`[/]\`slash commands)**`)
      .setColor(constants.Colors.MAIN_EMBED_COLOR)
      .addFields([
        {
          name: `${constants.Emojis.INFO} Info (${commands.info.length})`,
          value: `\`${commands.info.join("`, `")}\``
        },
        {
          name: `⚙️ Server Settings (${commands.serverSettings.length})`,
          value: `\`${commands.serverSettings.join("`, `")}\``
        },
        {
          name: `🧩 Fun (${commands.fun.length})`,
          value: `\`${commands.fun.join("`, `")}\``
        },
        {
          name: `🐼 Animal (${commands.animal.length})`,
          value: `\`${commands.animal.join("`, `")}\``
        },
        {
          name: `🌸 Waifu (${commands.waifu.length})`,
          value: `\`${commands.waifu.join("`, `")}\``
        },
        {
          name: `💖 Anime (${commands.anime.length})`,
          value: `\`${commands.anime.join("`, `")}\``
        },
        {
          name: `🔞 ||Hentai (${commands.hentai.length})||`,
          value: `||\`${commands.hentai.join("`, `")}\`||`
        }
      ]);

    message.reply({ embeds: [helpEmbed, commandListEmbed] });
  }
});