import { ElainaPrefixCommand, ElainaWebhook, RedditFetch, constants } from "../index";
import { MessageEmbed } from "discord.js";

export default new ElainaPrefixCommand({
  name: "meme",
  description: "Anime memes.",
  aliases: ["m"],
  category: "Weeb",
  onlyChannels: ["memes"],
  run: async (client, message, args) => {
    const reply = await message.reply(`${constants.Emojis.LOADING} **Finding a good post...**`);
    
    const subreddits = ["animememe", "goodanimememes", "wholesomeanimemes"];
    
    const post = new RedditFetch(subreddits);
    
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
