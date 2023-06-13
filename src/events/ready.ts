import bot, { Event, constants, ElainaPrefixCommand, typings, RedditFetch } from "../index";
import { Guild, MessageEmbed } from "discord.js";
import akaneko from "akaneko";

export default new Event("ready", async () => {
  console.log(
    `${bot.user?.tag} is up and ready to go!\n\nGuilds: ${bot.guilds.cache.map((guild: Guild) => guild.name).join(", ")}.`
  );

  await bot.user?.setPresence(constants.ElainaPresenceData);

  // hentai commands
  const hentaiCommands: { name: string;description: string;aliases: string[] } [] = [
    { name: "hentai", description: "Random vanilla hentai images.", aliases: ["h"] },
    { name: "ass", description: "I know you like anime ass.", aliases: [] },
    { name: "blowjob", description: "Basically an image of a girl sucking on a sharp blade!.", aliases: ["blow"] },
    { name: "cum", description: "Basically sticky white stuff that is usually milked from sharpies.", aliases: [] },
    { name: "panties", description: "I mean... just why? You like underwear?", aliases: ["pan"] },
    { name: "pussy", description: "The genitals of a female, or a cat, you give the meaning.", aliases: ["pus"] },
    { name: "school", description: "School Uniforms!~ Yatta~!", aliases: ["sch"] },
    { name: "tentacles", description: "I'm sorry but, why do they look like intestines?", aliases: ["ten"] },
    { name: "thighs", description: "The top part of your legs, very hot, isn't it?", aliases: ["thi"] },
    { name: "uniform", description: "Military, Konbini, Work, Nurse Uniforms, etc!~ Sexy~", aliases: ["uni"] },
    { name: "gifs", description: "Basically an animated image, so yes :3", aliases: ["gif"] }
  ];

  for (const hentaiCommand of hentaiCommands) {
    const command = new ElainaPrefixCommand({
      name: hentaiCommand.name,
      description: hentaiCommand.description,
      aliases: hentaiCommand.aliases,
      category: "Hentai",
      onlyChannels: ["hentai"],
      run: async (client, message, args) => {
        const reply = await message.reply(`${constants.Emojis.LOADING} **Finding a good post...**`);

        akaneko.nsfw[hentaiCommand.name]().then((imageUrl: string) => {
          reply.edit({
            content: null,
            embeds: [
              new MessageEmbed()
                .setImage(imageUrl)
                .setColor(constants.Colors.MAIN_EMBED_COLOR)
            ]
          });
        }).catch(error => {
          reply.edit(`Failed to fetch an image of \`${hentaiCommand.name}\``);
          console.log(error.name + " " + error.message + " | CommandName: " + hentaiCommand.name);
        });
      }
    });

    bot.prefixCommands.set(hentaiCommand.name, command as typings.ElainaPrefixCommand);
  }

  // anime commands
  const subreddits = [
    {
      wallpaper: ["animewallpaperssfw"]
    },
    {
      meme: ["animemes", "animememe", "goodanimememes", "wholesomeanimemes"]
    },
    {
      art: ["animesketch"]
    },
    {
      waifu: ["waifudiffusion"]
    }
  ];

  const animeCommands: { name: string;description: string;aliases: string[] } [] = [
    { name: "wallpaper", description: "Cool anime wallpapers.", aliases: ["wallpapers", "wal"] },
    { name: "meme", description: "Funny and wholesome Anime memes.", aliases: ["memes"] },
    { name: "art", description: "Amazing anime arts.", aliases: ["arts"] },
    { name: "waifu", description: "Anime waifus~ UWU~", aliases: ["waifu"] }
  ];

  for (const animeCommand of animeCommands) {
    const command = new ElainaPrefixCommand({
      name: animeCommand.name,
      description: animeCommand.description,
      aliases: animeCommand.aliases,
      category: "Anime",
      onlyChannels: ["anime"],
      run: async (client, message, args) => {
        const reply = await message.reply(`${constants.Emojis.LOADING} **Finding a good post...**`);

        const post = new RedditFetch(subreddits[animeCommand.name])
        
        try {
          await post.makeRequest();
          
          reply.edit({
            content: null,
            embeds: [
              new MessageEmbed()
                .setDescription(found.getPostTitle)
                .setImage(found.getPostImage)
                .setColor(constants.Colors.MAIN_EMBED_COLOR)
            ]
          });
        } catch(error) {
          reply.edit(`Failed to fetch an image of \`${animeCommand.name}\``);
          console.log(error.name + " " + error.message + " | CommandName: " + animeCommand.name);
        }
      }
    });

    bot.prefixCommands.set(animeCommand.name, command as typings.ElainaPrefixCommand);
  }
});