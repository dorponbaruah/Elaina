import { ElainaSlashCommand, constants } from "../index";
import { MessageEmbed } from "discord.js";

export default new ElainaSlashCommand({
  name: "avatar",
  description: "Gets a user's avatar.",
  options: [{
    type: "USER",
    name: "user",
    description: "User that you want to get the avatar of",
  }],
  category: "Info",
  onlyChannels: ["commands"],
  run: async (client, interaction) => {
    let user = interaction.user;
    
    if (interaction.options.getUser("user")) {
      user = interaction.options.getUser("user");
    }
    
    user = await user.fetch(true);
    
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor({ name: user.username + "'s avatar", iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
          .setColor(user.accentColor ? user.accentColor : constants.Colors.MAIN_EMBED_COLOR)
      ]
    });
  }
});
