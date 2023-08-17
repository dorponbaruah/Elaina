import bot, { Event, constants, ElainaPrefixCommand, typings } from "../index";
import { Guild, MessageEmbed } from "discord.js";
import akaneko from "akaneko";
import { randomImageFromSub } from "justreddit";

export default new Event("ready", async () => {
  console.log(
    `${bot.user?.tag} is up and ready to go!\n\nGuilds: ${bot.guilds.cache.map((guild: Guild) => guild.name).join(", ")}.`
  );

  await bot.user?.setPresence(constants.ElainaPresenceData);

  // hentai commands
  const hentaiCommands: { name: string;description: string;aliases: string[];usage: string } [] = [
    { name: "hentai", description: "Random vanilla hentai images.", aliases: ["h"], usage: "hentai" },
    { name: "ass", description: "I know you like anime ass.", aliases: [], usage: "ass" },
    { name: "blowjob", description: "Basically an image of a girl sucking on a sharp blade!.", aliases: ["blow"], usage: "blowjob" },
    { name: "cum", description: "Basically sticky white stuff that is usually milked from sharpies.", aliases: [], usage: "cum" },
    { name: "panties", description: "I mean... just why? You like underwear?", aliases: ["pan"], usage: "panties" },
    { name: "pussy", description: "The genitals of a female, or a cat, you give the meaning.", aliases: ["pus"], usage: "pussy" },
    { name: "school", description: "School Uniforms!~ Yatta~!", aliases: ["sch"], usage: "school" },
    { name: "tentacles", description: "I'm sorry but, why do they look like intestines?", aliases: ["ten"], usage: "tentacles" },
    { name: "thighs", description: "The top part of your legs, very hot, isn't it?", aliases: ["thi"], usage: "thighs" },
    { name: "uniform", description: "Military, Konbini, Work, Nurse Uniforms, etc!~ Sexy~", aliases: ["uni"], usage: "uniform" },
    { name: "hentaigif", description: "Basically an animated image, so yes :3", aliases: ["hentaigifs"], usage: "hentaigif" }
  ];

  for (const hentaiCommand of hentaiCommands) {
    const command = new ElainaPrefixCommand({
      name: hentaiCommand.name,
      description: hentaiCommand.description,
      aliases: hentaiCommand.aliases,
      category: "Hentai",
      usage: hentaiCommand.name,
      onlyChannels: ["hentai"],
      run: async (client, message, args) => {
        const reply = await message.reply(`${constants.Emojis.LOADING} **Finding a good post...**`);

        akaneko.nsfw[hentaiCommand.name.replace("hentaigif", "gif")]().then((imageUrl: string) => {
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
  const subreddits = {
    wallpaper: ["animewallpaper", "animewallpaper", "animewallpaperssfw"],
    meme: ["animemes", "animememe", "goodanimememes", "wholesomeanimemes"],
    art: ["awwnime", "animeart", "animesketch"],
    waifu: ["waifudiffusion"]
  }

  const animeCommands: { name: string;description: string;aliases: string[];usage: string } [] = [
    { name: "wallpaper", description: "Cool anime wallpapers.", aliases: ["wallpapers", "wal"], usage: "wallpaper" },
    { name: "meme", description: "Funny and wholesome Anime memes.", aliases: ["memes"], usage: "meme" },
    { name: "art", description: "Amazing anime arts.", aliases: ["arts"], usage: "art" },
    { name: "waifu", description: "Anime waifus~ UWU~", aliases: ["waifu"], usage: "waifu" }
  ];

  for (const animeCommand of animeCommands) {
    const command = new ElainaPrefixCommand({
      name: animeCommand.name,
      description: animeCommand.description,
      aliases: animeCommand.aliases,
      category: "Anime",
      usage: animeCommand.name,
      onlyChannels: ["anime"],
      run: async (client, message, args) => {
        const reply = await message.reply(`${constants.Emojis.LOADING} **Finding a good post...**`);

        try {
          const image = await randomImageFromSub({ subReddit: subreddits[animeCommand.name][Math.floor(Math.random() * subreddits[animeCommand.name].length)], sortType: "random", postGetLimit: 400 });

          reply.edit({
            content: null,
            embeds: [
                new MessageEmbed()
                  .setImage(image)
                  .setColor(constants.Colors.MAIN_EMBED_COLOR)
              ]
          });
        }
        catch (error) {
          reply.edit(`Failed to fetch an image of \`${animeCommand.name}\``);
          console.log(error.name + " " + error.message + " | CommandName: " + animeCommand.name + " | Subreddit: " + subreddits[animeCommand.name][Math.floor(Math.random() * subreddits[animeCommand.name].length)]);
        }
      }
    });

    bot.prefixCommands.set(animeCommand.name, command as typings.ElainaPrefixCommand);
  }
});