import client, { constants, typings } from "../index";
import { MessageEmbed, MessageActionRow, MessageSelectMenu, EmbedField, Message, SelectMenuInteraction, GuildMember } from "discord.js";

export default (embedOrRowToGet: string, message?: Message | typings.ExtendedCommandInteraction | SelectMenuInteraction ): any => {
  const commands: Record<string, string[]> = { info: [], serversettings: [], fun: [], animal: [], hentai: [], waifu: [], anime: [] }
  
  const commandCategories = ["Info", "Server Settings", "Fun", "Anime", "Waifu", "Hentai", "Animal"];
  
  client.prefixCommands.forEach(command => {
    commandCategories.forEach(category => {
      if (command.category === category) {
        commands[category.replaceAll(" ", '').toLowerCase()].push(command.name);
      }
    });
  });
  
  client.slashCommands.forEach(command => {
    commandCategories.forEach(category => {
      if (command.category === category) {
        if (command.subcommands) commands[category.replaceAll(" ", '').toLowerCase()].push(...command.subcommands.map(cmd => `[/]${cmd.name}`));
        else commands[category.replaceAll(" ", '').toLowerCase()].push(`[/]${command.name}`);
      }
    });
  });
  
  if (embedOrRowToGet === "getStartedEmbed") {
    const getStartedEmbed = new MessageEmbed()
      .setColor(constants.Colors.MAIN_EMBED_COLOR)
      .setAuthor({ name: "Help Command", iconURL: (message.member as GuildMember).displayAvatarURL({ dynamic: true }) })
      .setDescription(`Hello I'm **${client.user?.username}**, a discord bot designed to serve the <@&891974559610318878> of ${message.guild.name}.\n\nMy prefixes are '\`e!\`' and '\`e\`', however mentioning (@) me always works.`)
      .setImage("https://media.discordapp.net/attachments/926846660322160700/1143037522717454366/Picsart_23-08-21_09-41-08-668.jpg")
      .setFooter({ text: "Use the dropdown below to learn more about my commands.", iconURL: "https://media.discordapp.net/attachments/1015679157134426162/1144255523034767380/913059914912501800.png" })
    
    return getStartedEmbed;
  }
  
  function emojiFyCategoryName(category) {
    return category
      .replace("Info", `${constants.Emojis.INFO} Info`)
      .replace("Server Settings", `${constants.Emojis.SETTINGS} Server Settings`)
      .replace("Fun", `${constants.Emojis.GAMEDEV} Fun`)
      .replace("Animal", `${constants.Emojis.PANDADUCK} Animal`)
      .replace("Waifu", `${constants.Emojis.WAIFU} Waifu`)
      .replace("Anime", `${constants.Emojis.ANIMELOVE} Anime`)
      .replace("Hentai", `${constants.Emojis.WARNING} Hentai`);
  }
  
  if (embedOrRowToGet === "allCommandsEmbed") {
    const allCommandsEmbed = new MessageEmbed()
      .setDescription(`Here is the list of my commands!\n\n**Use ${constants.Prefixes[1]}help \`<command name>\` to get info on a specific command. (Doesn't work for \`[/]\`slash commands)**`)
      .setColor(constants.Colors.MAIN_EMBED_COLOR)
      .addFields([
        {
          name: `${emojiFyCategoryName("Info")} (${commands.info.length})`,
          value: `\`${commands.info.join("`, `")}\``
        },
        {
          name: `${emojiFyCategoryName("Server Settings")} (${commands.serversettings.length})`,
          value: `\`${commands.serversettings.join("`, `")}\``
        },
        {
          name: `${emojiFyCategoryName("Fun")} (${commands.fun.length})`,
          value: `\`${commands.fun.join("`, `")}\``
        },
        {
          name: `${emojiFyCategoryName("Animal")} (${commands.animal.length})`,
          value: `\`${commands.animal.join("`, `")}\``
        },
        {
          name: `${emojiFyCategoryName("Waifu")} (${commands.waifu.length})`,
          value: `\`${commands.waifu.join("`, `")}\``
        },
        {
          name: `${emojiFyCategoryName("Anime")} (${commands.anime.length})`,
          value: `\`${commands.anime.join("`, `")}\``
        },
        {
          name: `${emojiFyCategoryName("Hentai")} (${commands.hentai.length})`,
          value: `||\`${commands.hentai.join("`, `")}\`||`
        }
      ]);
    
    return allCommandsEmbed;
  }
  
  if (embedOrRowToGet === "commandsListEmbeds") {
    const commandsListEmbeds: Record<string, MessageEmbed> = {};
    
    commandCategories.forEach(category => {
      const embed = new MessageEmbed()
        .setColor(constants.Colors.MAIN_EMBED_COLOR)
        .setTitle(emojiFyCategoryName(category) + " Commands (" + commands[category.replaceAll(" ", '').toLowerCase()].length + ")")
        .setDescription(`Use ${constants.Prefixes[1]}help \`<command name>\` to get info on a specific command. (Doesn't work for \`[/]\`slash commands)`)
        .addFields([]);
     
      commands[category.replaceAll(" ", '').toLowerCase()].forEach(cmd => {
        if (!cmd.startsWith("[/]")) {
          const command = client.prefixCommands.get(cmd);
          
          embed.fields.push({ name: constants.Prefixes[1] + command.name, value: command.description } as EmbedField)
        }
        else {
          const command = client.slashCommands.get(cmd.split(" ")[0].replace("[/]", ''));
          
          if (command.subcommands) {
            const subcommand = command.subcommands.find(subcmd => subcmd.name === cmd.replace("[/]", ''));
            
            embed.fields.push({ name: '/'+subcommand.name, value: subcommand.description } as EmbedField);
          }
          else {
            embed.fields.push({ name: '/'+command.name, value: command.description } as EmbedField);
          }
        }
      });
      
      commandsListEmbeds[category.replaceAll(" ", '').toLowerCase()] = embed;
    });
  
    return commandsListEmbeds;
  }
  
  if (embedOrRowToGet === "categorySelectionMenu") {
    const categorySelectionMenu = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId("COMMAND_CATEGORY_SELECTOR_IN_HELP_COMMAND")
          .setPlaceholder("Select a Category...")
          .addOptions(
            {
              label: "Get Started",
              emoji: constants.Emojis.TADA.replace(/\D/g, ''),
              value: "COMMAND_CATEGORY_SELECTOR_IN_HELP_COMMAND||GETSTARTED"
            },
            {
              label: "Info Commands",
              emoji: constants.Emojis.INFO.replace(/\D/g, ''),
              value: "COMMAND_CATEGORY_SELECTOR_IN_HELP_COMMAND||INFO"
            },
            {
              label: "Server Settings Commands",
              emoji: constants.Emojis.SETTINGS.replace(/\D/g, ''),
              value: "COMMAND_CATEGORY_SELECTOR_IN_HELP_COMMAND||SERVERSETTINGS"
            },
            {
              label: "Fun Commands",
              emoji: constants.Emojis.GAMEDEV.replace(/\D/g, ''),
              value: "COMMAND_CATEGORY_SELECTOR_IN_HELP_COMMAND||FUN", 
            },
            {
              label: "Animal Commands",
              emoji: constants.Emojis.PANDADUCK.replace(/\D/g, ''),
              value: "COMMAND_CATEGORY_SELECTOR_IN_HELP_COMMAND||ANIMAL"
            },
            {
              label: "Waifu Commands",
              emoji: constants.Emojis.WAIFU.replace(/\D/g, ''),
              value: "COMMAND_CATEGORY_SELECTOR_IN_HELP_COMMAND||WAIFU"
            },
            {
              label: "Anime Commands",
              emoji: constants.Emojis.ANIMELOVE.replace(/\D/g, ''),
              value: "COMMAND_CATEGORY_SELECTOR_IN_HELP_COMMAND||ANIME"
            },
            {
              label: "Hentai Commands",
              emoji: constants.Emojis.WARNING.replace(/\D/g, ''),
              value: "COMMAND_CATEGORY_SELECTOR_IN_HELP_COMMAND||HENTAI"
            },
            {
              label: "All Commands",
              emoji: constants.Emojis.COMMANDSLIST.replace(/\D/g, ''),
              value: "COMMAND_CATEGORY_SELECTOR_IN_HELP_COMMAND||ALLCOMMANDS"
            }
          )
      );
  
    return categorySelectionMenu;
  }
}