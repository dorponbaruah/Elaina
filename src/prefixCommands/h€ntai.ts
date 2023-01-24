import { ElainaPrefixCommand, ElainaWebhook, RedditFetch, constants } from "../index";
import { MessageEmbed } from "discord.js";

export default new ElainaPrefixCommand({
  name: "hentai",
  description: "Lewd anime/manga images UwU.",
  aliases: ["h"],
  category: "Forest of witches",
  onlyChannels: ["hentai-region"],
  run: async (client, message, args) => {
    const reply = await message.reply(`${constants.Emojis.LOADING} **Finding a good post...**`);
    
    const subreddits = [
        "hentai",
        "dekaihentai",
        "ecchi",
        "hentaimemes",
        "hentaiBreeding",
        "hentai_gif",
        "westernHentai",
        "yiff",
        "waifusgonewild",
        "hentaibondage",
        "deliciousTraps",
        "thick_hentai"
    ];
    
    const post = new RedditFetch(subreddits, true);
    
    await post.makeRequest().then(() => reply.delete());;
    
    new ElainaWebhook({ channelId: message.channel.id })
      .send({
        username: post.getSubredditName,
        avatarURL: post.getSubredditIcon,
        embeds: [
          new MessageEmbed()
            .setDescription(post.getPostTitle)
            .setImage(post.getPostImage)
            .setColor(constants.Colors.MAIN_EMBED_COLOR)
            .setFooter({ text: `Sent by ${client.user?.tag}`, iconURL: client.user?.displayAvatarURL() })
        ]
      });
  }
});
