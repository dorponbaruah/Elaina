import { ElainaPrefixCommand, ElainaErrorMessage, constants } from "../index";
import { MessageEmbed } from "discord.js";

export default new ElainaPrefixCommand({
  name: "avatar",
  description: "Gets a user's avatar.",
  aliases: ["av", "profilepic", "pfp", "dp"],
  usage: "{prefix}avatar [user mention/ID]",
  category: "Info",
  onlyChannels: ["commands"],
  run: async (client, message, args) => {
    let member = message.member;
   
    if (args[0]) {
      member = await message.guild.members.fetch(args[0].replace(/\D/g, ''));
      
      if (!member) return message.reply(
        new ElainaErrorMessage("Please provide a valid user ID or mention the user.", {
          mention: true
        })
      );
    }
    
    const user = await member.user.fetch(true);
    
    message.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor({ name: user.username+"'s avatar", iconURL: member.displayAvatarURL({ dynamic: true }) })
          .setImage(member.displayAvatarURL({ dynamic: true, size: 4096 }))
          .setColor(user.accentColor ? user.accentColor : constants.Colors.MAIN_EMBED_COLOR)
      ]
    });
  }
});
