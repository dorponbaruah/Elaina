import { ElainaPrefixCommand, ElainaWebhook, RedditFetch, constants } from "../index";
import { MessageEmbed } from "discord.js";

export default new ElainaPrefixCommand({
  name: "hentai",
  description: "Lewd anime/manga images UwU.",
  aliases: ["h"],
  category: "Weeb",
  onlyChannels: ["hentai"],
  run: async (client, message, args) => {
    const reply = await message.reply(`${constants.Emojis.LOADING} **Finding a good post...**`);
    
    const subreddits = [
        "hentai",
        "ecchi"
    ];
    
    const post = new RedditFetch(subreddits, true);
    
    await post.makeRequest().then(() => {
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
    })
    .catch(() => message.channel.send(constants.Emojis.ERROR + " No response from the subreddit."));
    
    reply.delete();
  }
});
