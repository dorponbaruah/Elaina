import { ElainaPrefixCommand, ElainaErrorMessage, RedditFetch, ElainaWebhook, constants } from "../index";
import { MessageEmbed } from "discord.js";

export default new ElainaPrefixCommand({
  name: "anime",
  description: "Are you a weeb or otaku?",
  aliases: ["a"],
  category: "Forest of witches",
  onlyChannels: ["anime-region"],
  run: async (client, message, args) => {
    if (!args[0])
      return message.reply(
        new ElainaErrorMessage(`**Not enough arguments provided.** (Tip: You can view the list of all valid arguments using the **\`${constants.Prefixes[1]}anime list\`** command.`, {
          mention: true
        })
      )
      
    const expectedArgs = ["series", "funny", "wallpaper", "art", "gif", "ugh"];
    
    const givenArgs: string[] = args.slice(0, 6).map(val => val.toLowerCase());
    
    const validArgs: string[] = givenArgs.filter(val => expectedArgs.includes(val));
      
    const helpEmbed = new MessageEmbed()
      .setColor(constants.Colors.MAIN_EMBED_COLOR)
      .setAuthor({ name: `Command: ${constants.Prefixes[1]}anime`, iconURL: "https://cdn.discordapp.com/emojis/1018471731482087435.png" })
      .setDescription("Are you a weeb or otaku?")
      .addFields(
        {
          name: "Usage:",
          value: `\`${constants.Prefixes[1]}anime <argument(s)>\n${constants.Prefixes[1]}a <argument(s)>\``
        },
        {
          name: "Valid Arguments:",
          value: `\`\`\`\n${expectedArgs.join(", ")}\`\`\`\n**series:** Series specific.\n\n**funny:** Anime related memes and funny images.\n\n**wallpaper:** Anime-style wallpapers.\n\n**art:** Anime artwork, sketches and manga/comic strips.\n\n**gif:** Animated GIFs.\n\n**irl:** Just anime boys and girls speaking sad things about you (or the truth on you where it hurts).\n\n(When you provide multiple arguments you expect the bot to randomly take one of them)`
        },
        {
          name: "Examples:",
          value: `\`${constants.Prefixes[1]}anime wallpaper\n${constants.Prefixes[1]}anime art wallpaper gif\n\n${constants.Prefixes[1]}a wallpaper\n${constants.Prefixes[1]}a art wallpaper gif\``
        }
      );

    if (args[0] === "list") 
      return message.channel.send({ embeds: [helpEmbed] });
    
    if (givenArgs.length !== validArgs.length) 
      return message.reply(
        new ElainaErrorMessage(
          `**The following argument(s) you have provided are invalid.** (Tip: You can view the list of valid arguments using the **\`${constants.Prefixes[1]}anime list\`** command)\n\n> ❌ \`${givenArgs.filter(val => !validArgs.includes(val.toLowerCase())).join("`, `")}\``
        )
     );
     
    const reply = await message.reply(`${constants.Emojis.LOADING} **Finding a good post...**`);
   
    const subreddits = {
      series: [
        "onepiece",
        "bokunoheroacademia",
        "naruto",
        "dbz",
        "onepunchman",
        "shingekinokyojin",
        "berserk",
        "hunterxhunter",
        "blackclover",
        "swordartonline",
        "darlinginthefranxx",
        "spyxfamily",
        "fatestaynight",
        "tokyoghoul",
        "demonslayeranime",
        "bleach",
        "jujutsukaisen",
        "tokyorevengers",
        "vinlandsaga"
      ],
      // Funny
      funny: [
        "animemes",
        "animememes",
        "animefunny",
        "wholesomeanimemes"
      ],
      // Cool wallpapers
      wallpaper: [
        "animewallpaper",
        "animewallpaperssfw"
      ],
      // Amazing arts
      art: [
        "awwnime",
        "animeart",
        "animesketch"
      ],
      // Gifs
      gif: [
        "animegifs",
        "animegif"
      ],
      // Ugh
      ugh: [
        "whataweeb"
      ]
    }
    
    const selectedSubreddits: string[] = [];

    expectedArgs.forEach(element => {
      if (givenArgs.includes(element)) selectedSubreddits.push(...subreddits[element]);
    });
    
    const post = new RedditFetch(selectedSubreddits);
    
    await post.makeRequest().then(() => reply.delete());
    
    new ElainaWebhook({ channelId: message.channel.id }, {
      username: post.getSubredditName,
      avatarURL: post.getSubredditIcon,
      embeds: [
        new MessageEmbed()
          .setDescription(post.getPostTitle)
          .setImage(post.getPostImage)
          .setColor(constants.Colors.MAIN_EMBED_COLOR)
          .setFooter({ text: `Sent by ${client.user?.tag}`, iconURL: client.user?.displayAvatarURL() })
      ]
    }).send();
  }
});
