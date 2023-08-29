import bot, { Event, constants, ElainaPrefixCommand, typings } from "../index";
import { Guild, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import akaneko from "akaneko";
import { randomImageFromSub } from "justreddit";
import fetch from "node-fetch";

export default new Event("ready", async () => {
  console.log(
    `${bot.user?.tag} is up and ready to go!\n\nGuilds: ${bot.guilds.cache.map((guild: Guild) => guild.name).join(", ")}.`
  );

  await bot.user?.setPresence(constants.ElainaPresenceData);

  const pinAndSendDmButtons = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setStyle("SUCCESS")
      .setLabel("Pin")
      .setEmoji("📌")
      .setCustomId("PIN_THE_MESSAGE_MAN"),

      new MessageButton()
      .setStyle("PRIMARY")
      .setLabel("Save in DM")
      .setEmoji("✉️")
      .setCustomId("SEND_IN_MY_DMS")
    );

  // hentai commands
  const hentaiCommands: { name: string;description: string;aliases: string[];usage: string } [] = [
    { name: "hentai", description: "Random vanilla hentai images.", aliases: ["h"], usage: "{prefix}hentai" },
    { name: "ass", description: "I know you like anime ass.", aliases: [], usage: "{prefix}ass" },
    { name: "blowjob", description: "Basically an image of a girl sucking on a sharp blade!", aliases: ["blow"], usage: "{prefix}blowjob" },
    { name: "cum", description: "Basically sticky white stuff that is usually milked from sharpies.", aliases: [], usage: "{prefix}cum" },
    { name: "panties", description: "I mean... just why? You like underwear?", aliases: ["pan"], usage: "{prefix}panties" },
    { name: "pussy", description: "The genitals of a female, or a cat, you give the meaning.", aliases: ["pus"], usage: "{prefix}pussy" },
    { name: "school", description: "School Uniforms!~ Yatta~!", aliases: ["sch"], usage: "{prefix}school" },
    { name: "tentacles", description: "I'm sorry but, why do they look like intestines?", aliases: ["ten"], usage: "{prefix}tentacles" },
    { name: "thighs", description: "The top part of your legs, very hot, isn't it?", aliases: ["thi"], usage: "{prefix}thighs" },
    { name: "uwuniform", description: "Military, Konbini, Work, Nurse Uniforms, etc!~ Sexy~", aliases: ["uwni"], usage: "{prefix}uwuniform" },
    { name: "hentaigif", description: "Basically an animated image, so yes :3", aliases: ["hentaigifs"], usage: "{prefix}hentaigif" }
  ];

  for (const hentaiCommand of hentaiCommands) {
    const command = new ElainaPrefixCommand({
      name: hentaiCommand.name,
      description: hentaiCommand.description,
      aliases: hentaiCommand.aliases,
      category: "Hentai",
      usage: hentaiCommand.usage,
      onlyChannels: ["hentai"],
      run: async (client, message, args) => {
        const reply = await message.reply(`${constants.Emojis.LOADING} **Finding a good post...**`);

        akaneko.nsfw[hentaiCommand.name.replace("hentaigif", "gif").replace("uwuniform", "uniform")]().then((imageUrl: string) => {
          reply.edit({
            content: null,
            embeds: [
              new MessageEmbed()
                .setImage(imageUrl)
                .setColor(constants.Colors.MAIN_EMBED_COLOR)
            ],
            components: [pinAndSendDmButtons]
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
  }

  const animeCommands: { name: string;description: string;aliases: string[];usage: string } [] = [
    { name: "wallpaper", description: "Cool anime wallpapers.", aliases: ["wallpapers", "wal"], usage: "{prefix}wallpaper" },
    { name: "meme", description: "Funny and wholesome Anime memes.", aliases: ["memes"], usage: "{prefix}meme" },
    { name: "art", description: "Amazing anime arts.", aliases: ["arts"], usage: "{prefix}art" },
  ];

  for (const animeCommand of animeCommands) {
    const command = new ElainaPrefixCommand({
      name: animeCommand.name,
      description: animeCommand.description,
      aliases: animeCommand.aliases,
      category: "Anime",
      usage: animeCommand.usage,
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
            ],
            components: [pinAndSendDmButtons]
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

  const waifuCommands: { name: string;description: string;aliases: string[];usage: string } [] = [
    { name: "waifu", description: "Anime waifus~ UWU~", aliases: ["wai"], usage: "{prefix}waifu" },
    { name: "maid", description: "Maid anime girls~ UWU~", aliases: [], usage: "{prefix}maid" },
    { name: "marin-kitagawa", description: "Marin Kitagawa is the main female protagonist of the anime and manga series My Dress-Up Darling.", aliases: ["marin", "kitagawa", "m-k"], usage: "{prefix}marin-kitagawa" },
    { name: "raiden-shogun", description: "Raiden Shogun is a playable character in Genshin Impact.", aliases: ["raiden", "shogun", "r-s"], usage: "{prefix}raiden-shogun" },
    { name: "selfies", description: "Anime girl selfies~ UWU~", aliases: ["sel"], usage: "" },
    { name: "uniform", description: "Anime girl in Uniform~ UWU~", aliases: ["uni"], usage: "{prefix}uniform" },
  ];

  for (const waifuCommand of waifuCommands) {
    const command = new ElainaPrefixCommand({
      name: waifuCommand.name,
      description: waifuCommand.description,
      aliases: waifuCommand.aliases,
      category: "Waifu",
      usage: waifuCommand.usage,
      onlyChannels: ["waifus", "waifu"],
      run: async (client, message, args) => {
        const reply = await message.reply(`${constants.Emojis.LOADING} **Finding a good post...**`);

        const urlSearchParams = new URLSearchParams({
          Authorization: "Bearer " + process.env.waifuApiKey,
          included_tags: waifuCommand.name,
        });

        fetch(`https://api.waifu.im/search?${urlSearchParams}`)

          .then(res => res.json())

          .then(data => {
            reply.edit({
              content: null,
              embeds: [
                new MessageEmbed()
                  .setImage(data.images[0].url)
                  .setColor(constants.Colors.MAIN_EMBED_COLOR)
              ],
              components: [pinAndSendDmButtons]
            });
          })

          .catch(error => {
            reply.edit(`Failed to fetch an image of \`${waifuCommand.name}\``);
            console.log(error.name + " " + error.message + " | CommandName: " + waifuCommand.name);
          });
      }
    });

    bot.prefixCommands.set(waifuCommand.name, command as typings.ElainaPrefixCommand);
  }

  const animalCommands: { name: string;description: string;aliases: string[];usage: string } [] = [
    { name: "dog", description: "Sends an image of a dog.", aliases: ["dogs", "kutta"], usage: "{prefix}dog" },
    { name: "cat", description: "Sends an image of a cat.", aliases: ["cats", "billi", "billa"], usage: "{prefix}cat" },
    { name: "bird", description: "Sends an image of a bird", aliases: ["chidiya", "birds", "birdy"], usage: "{prefix}bird" },
    { name: "panda", description: "Sends an image of a panda.", aliases: ["pandas", "pamda"], usage: "{prefix}panda" },
    { name: "redpanda", description: "Sends an image of a redpanda.", aliases: ["redpa", "redpamda", "redpandas"], usage: "{prefix}redpanda" },
    { name: "koala", description: "Sends an image of a koala.", aliases: ["koa", "koalas"], usage: "{prefix}koala" },
    { name: "fox", description: "Sends an image of a fox.", aliases: ["foxes"], usage: "{prefix}fox" },
    { name: "whale", description: "Sends an image of a whale.", aliases: ["whales", "wh"], usage: "{prefix}whale" },
    { name: "dolphin", description: "Sends an image of a dolphin.", aliases: ["dolphins", "dolp"], usage: "{prefix}dolphin" },
    { name: "kangaroo", description: "Sends an image of a kangaroo.", aliases: ["kan", "kangaroos"], usage: "{prefix}kangaroo" },
    { name: "bunny", description: "Sends an image of a bunny.", aliases: ["bun", "bunnies"], usage: "{prefix}bunny" },
    { name: "bear", description: "Sends an image of a bear.", aliases: ["bears"], usage: "{prefix}bear" },
    { name: "lion", description: "Sends an image of a lion.", aliases: ["lions"], usage: "{prefix}lion" },
    { name: "frog", description: "Sends an image of a frog.", aliases: ["frogs"], usage: "{prefix}frog" },
    { name: "duck", description: "Sends an image of a duck.", aliases: ["ducks"], usage: "{prefix}duck" },
    { name: "penguin", description: "Sends an image of a penguin.", aliases: ["peng", "penguins"], usage: "{prefix}penguin" },
    { name: "axolotl", description: "Sends an image of a axolotl.", aliases: ["axol", "axolotls"], usage: "{prefix}axolotl" },
    { name: "capybara", description: "Sends an image of a capybara.", aliases: ["capy", "capybaras"], usage: "{prefix}capybara" }
  ];

  for (const animalCommand of animalCommands) {
    const command = new ElainaPrefixCommand({
      name: animalCommand.name,
      description: animalCommand.description,
      aliases: animalCommand.aliases,
      category: "Animal",
      usage: animalCommand.usage,
      onlyChannels: ["animal", "animals"],
      run: async (client, message, args) => {
        const reply = await message.reply(`${constants.Emojis.LOADING} **Finding a good image...**`);

        fetch("https://api.animality.xyz/img/"+animalCommand.name)

          .then(res => res.json())

          .then(data => {
            reply.edit({
              content: null,
              embeds: [
                new MessageEmbed()
                  .setImage(data.link)
                  .setColor(constants.Colors.MAIN_EMBED_COLOR)
              ],
              components: [pinAndSendDmButtons]
            });
          })

          .catch(error => {
            reply.edit(`Failed to fetch an image of \`${animalCommand.name}\``);
            console.log(error.name + " " + error.message + " | CommandName: " + animalCommand.name);
          });
      }
    });

    bot.prefixCommands.set(animalCommand.name, command as typings.ElainaPrefixCommand);
  }
});