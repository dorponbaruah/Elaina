import bot, { Event, constants, ElainaPrefixCommand, typings } from "../index";
import { Guild, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import HMtai from "hmtai";
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
    { name: "hentai", description: "Sends a random vanilla hentai imageURL~", aliases: ["h"], usage: "{prefix}hentai" },
    { name: "anal", description: "Does somebody like being in all holes?~", aliases: [], usage: "{prefix}anal" },
    { name: "ass", description: "I know you like anime ass~ uwu", aliases: [], usage: "{prefix}ass" },
    { name: "bdsm", description: "If you don't know what it is, search it up", aliases: [], usage: "{prefix}bdsm" },
    { name: "cum", description: "Basically sticky white stuff that is usually milked from sharpies.", aliases: [], usage: "{prefix}cum" },
    { name: "classic", description: "Relaxing classic kekus uwu", aliases: ["cl"], usage: "{prefix}classic" },
    { name: "creampie", description: "So hot, sticky, and inside uwu", aliases: ["cp"], usage: "{prefix}creampie" },
    { name: "manga", description: "Sends a random doujin page imageURL!", aliases: ["mg"], usage: "{prefix}manga" },
    { name: "masturbation", description: "You like lewd solo?~", aliases: [], usage: "{prefix}masturbation" },
    { name: "public", description: "Some people like do it on a public..uh~", aliases: [], usage: "{prefix}public" },
    { name: "elves", description: "So, it's not Elvis Presley, but I know, you like it :)", aliases: [], usage: "{prefix}elves" },
    { name: "glasses", description: "Girls that wear glasses, uwu~", aliases: [], usage: "{prefix}glasses" },
    { name: "blowjob", description: "Basically an image of a girl sucking on a sharp blade!", aliases: ["blow", "bj"], usage: "{prefix}blowjob" },
    { name: "boobjob", description: "So soft, round ... gentle ... damn we love it", aliases: [], usage: "{prefix}boobjob" },
    { name: "footjob", description: "So you like smelly feet huh?", aliases: [], usage: "{prefix}footjob" },
    { name: "handjob", description: "So you like how's it feeling in hand, huh?", aliases: [], usage: "{prefix}handjob" },
    { name: "boobs", description: "A-am..that's normal size!", aliases: [], usage: "{prefix}boobs" },
    { name: "thighs", description: "Oh, I so like it, it's best of the best, like a religion <3", aliases: [], usage: "{prefix}thighs" },
    { name: "pussy", description: "The genitals of a female, or a cat, you give the meaning.", aliases: ["pus"], usage: "{prefix}pussy" },
    { name: "uwuniform", description: "School and many other Uniforms~", aliases: ["uwfm"], usage: "{prefix}uwuniform" },
    { name: "gangbang", description: "5 on 1? Uh..", aliases: [], usage: "{prefix}gangbang" },
    { name: "tentacles", description: "I'm sorry but, why do you like it? Uh..", aliases: [], usage: "{prefix}tentacles" },
    { name: "hentaigif", description: "Basically an animated image, so yes :3", aliases: ["hgif"], usage: "{prefix}hentaigif" },
    { name: "nsfwneko", description: "NSFW Neko Girls (Cat Girls)", aliases: [], usage: "{prefix}nsfwneko" },
    { name: "nsfwwallpaper", description: "NSFW Anime Mobile Wallpaper", aliases: [], usage: "{prefix}nsfwwallpaper" },
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
        
        const hmtai = new HMtai();
        hmtai.nsfw[hentaiCommand.name
            .replace("hentaigif", "gif")
            .replace("uwuniform", "uniform")
            .replace("nsfwwallpaper", "nsfwMobileWallpaper")
          ]()
          .then((imageUrl: string) => {
            const embeds = [
              new MessageEmbed()
              .setImage(imageUrl)
              .setColor(constants.Colors.MAIN_EMBED_COLOR)
            ];
            
            if (Math.floor(Math.random() * 7) === 0) {
              const shuffled = hentaiCommands.sort(() => 0.5 - Math.random());
              const count = Math.floor(Math.random() * 3) + 3;
              const randomCommands = shuffled.slice(0, count)
                .map(cmd => `\`${cmd.usage.replace("{prefix}", constants.Prefixes[1])}\``)
                .join(", ");
              
              const promoEmbed = new MessageEmbed()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription(`Also check out my other commands: ${randomCommands}`)
                .setColor(constants.Colors.MAIN_EMBED_COLOR);
              
              embeds.push(promoEmbed);
            }
            
            reply.edit({
              content: null,
              embeds: embeds,
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
  const animeCommands: { name: string;description: string;aliases: string[];usage: string } [] = [
    { name: "depression", description: "SFW depression Gifs :c", aliases: [], usage: "{prefix}depression" },
    { name: "wolfart", description: "Awoooooo girls :3", aliases: [], usage: "{prefix}wolfart" },
    { name: "jahyart", description: "So hot Jahy :3", aliases: [], usage: "{prefix}jahyart" },
    { name: "nekoart", description: "SFW Neko Girls (Cat Girls)", aliases: [], usage: "{prefix}nekoart" },
    { name: "coffeeart", description: "Do you want some coffee? And girls :3", aliases: [], usage: "{prefix}coffeeart" },
    { name: "wallpaper", description: "SFW Wallpaper with Anime", aliases: ["wp"], usage: "{prefix}wallpaper" },
    { name: "mobilewallpaper", description: "SFW Wallpaper with Anime on Mobile", aliases: ["mobilewp"], usage: "{prefix}mobilewallpaper" }
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
        
        const hmtai = new HMtai();
        hmtai.sfw[animeCommand.name
            .replace("wolfart", "wolf_arts")
            .replace("jahyart", "jahy_arts")
            .replace("nekoart", "neko_arts")
            .replace("coffeeart", "coffee_arts")
            .replace("mobilewallpaper", "mobileWallpaper")
          ]()
          .then((imageUrl: string) => {
            const embeds = [
              new MessageEmbed()
              .setImage(imageUrl)
              .setColor(constants.Colors.MAIN_EMBED_COLOR)
            ];
            
            if (Math.floor(Math.random() * 7) === 0) {
              const shuffled = animeCommands.sort(() => 0.5 - Math.random());
              const count = Math.floor(Math.random() * 3) + 3;
              const randomCommands = shuffled.slice(0, count)
                .map(cmd => `\`${cmd.usage.replace("{prefix}", constants.Prefixes[1])}\``)
                .join(", ");
              
              const promoEmbed = new MessageEmbed()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription(`Also check out my other commands: ${randomCommands}`)
                .setColor(constants.Colors.MAIN_EMBED_COLOR);
              
              embeds.push(promoEmbed);
            }
            
            reply.edit({
              content: null,
              embeds: embeds,
              components: [pinAndSendDmButtons]
            });
          })
          .catch(error => {
            reply.edit(`Failed to fetch an image of \`${animeCommand.name}\``);
            console.log(error.name + " " + error.message + " | CommandName: " + animeCommand.name);
          });
      }
    });
    
    bot.prefixCommands.set(animeCommand.name, command as typings.ElainaPrefixCommand);
  }
  
  // waifu commands
  const waifuCommands: { name: string;description: string;aliases: string[];usage: string } [] = [
    { name: "waifu", description: "Anime waifus~ UWU~", aliases: ["wai"], usage: "{prefix}waifu" },
    { name: "maid", description: "Maid anime girls~ UWU~", aliases: [], usage: "{prefix}maid" },
    { name: "marin-kitagawa", description: "Marin Kitagawa from My Dress-Up Darling.", aliases: ["marin", "kitagawa", "m-k"], usage: "{prefix}marin-kitagawa" },
    { name: "raiden-shogun", description: "Raiden Shogun from Genshin Impact.", aliases: ["raiden", "shogun", "r-s"], usage: "{prefix}raiden-shogun" },
    { name: "selfies", description: "Anime girl selfies~ UWU~", aliases: ["sel"], usage: "{prefix}selfies" },
    { name: "uniform", description: "Anime girls in uniform~ UWU~", aliases: ["uni"], usage: "{prefix}uniform" }
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
        
        try {
          const res = await fetch(`https://api.waifu.im/search?included_tags=${waifuCommand.name}`);
          const data = await res.json();
          
          const embeds = [
            new MessageEmbed()
            .setImage(data.images[0].url)
            .setColor(constants.Colors.MAIN_EMBED_COLOR)
          ];
          
          if (Math.floor(Math.random() * 7) === 0) {
            const shuffled = waifuCommands.sort(() => 0.5 - Math.random());
            const count = Math.floor(Math.random() * 3) + 3;
            const randomCommands = shuffled.slice(0, count)
              .map(cmd => `\`${cmd.usage.replace("{prefix}", constants.Prefixes[1])}\``)
              .join(", ");
            
            const promoEmbed = new MessageEmbed()
              .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
              .setDescription(`Also check out my other commands: ${randomCommands}`)
              .setColor(constants.Colors.MAIN_EMBED_COLOR);
            
            embeds.push(promoEmbed);
          }
          
          reply.edit({
            content: null,
            embeds: embeds,
            components: [pinAndSendDmButtons]
          });
        } catch (error) {
          reply.edit(`Failed to fetch an image of \`${waifuCommand.name}\``);
          console.error(`${error.name}: ${error.message} | CommandName: ${waifuCommand.name}`);
        }
      }
    });
    
    bot.prefixCommands.set(waifuCommand.name, command as typings.ElainaPrefixCommand);
  }
  
  // animal commands
  const animalCommands: { name: string;description: string;aliases: string[];usage: string } [] = [
    { name: "dog", description: "Sends an image of a dog.", aliases: ["dogs", "kutta"], usage: "{prefix}dog" },
    { name: "cat", description: "Sends an image of a cat.", aliases: ["cats", "billi", "billa"], usage: "{prefix}cat" },
    { name: "bird", description: "Sends an image of a bird.", aliases: ["chidiya", "birds", "birdy"], usage: "{prefix}bird" },
    { name: "panda", description: "Sends an image of a panda.", aliases: ["pandas", "pamda"], usage: "{prefix}panda" },
    { name: "capybara", description: "Sends an image of a capybara.", aliases: ["redpa", "redpamda", "redpandas"], usage: "{prefix}redpanda" },
    { name: "koala", description: "Sends an image of a koala.", aliases: ["koa", "koalas"], usage: "{prefix}koala" },
    { name: "fox", description: "Sends an image of a fox.", aliases: ["foxes"], usage: "{prefix}fox" },
    { name: "kangaroo", description: "Sends an image of a kangaroo.", aliases: ["kan", "kangaroos"], usage: "{prefix}kangaroo" },
    { name: "duck", description: "Sends an image of a duck.", aliases: ["ducks"], usage: "{prefix}duck" },
    { name: "bunny", description: "Sends an image of a bunny.", aliases: ["bun", "bunnies"], usage: "{prefix}bunny" },
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
        
        let imageUrl: string | null = null;
        
        try {
          switch (animalCommand.name) {
            case "dog":
            {
              const res = await fetch("https://dog.ceo/api/breeds/image/random");
              const data = await res.json();
              imageUrl = data.message;
            }
            break;
            case "cat":
            {
              const res = await fetch("https://api.thecatapi.com/v1/images/search");
              const data = await res.json();
              imageUrl = data[0].url;
            }
            break;
            case "duck":
            {
              const res = await fetch("https://random-d.uk/api/random");
              const data = await res.json();
              imageUrl = data.url;
            }
            break;
            case "bunny":
            {
              const res = await fetch("https://api.bunnies.io/v2/loop/random/?media=gif,png");
              const data = await res.json();
              imageUrl = data.media.gif;
            }
            break;
            case "bird":
            case "panda":
            case "koala":
            case "fox":
            case "kangaroo":
            {
              const res = await fetch(`https://some-random-api.com/animal/${animalCommand.name}`);
              const data = await res.json();
              imageUrl = data.image;
            }
            break;
            case "capybara":
            {
              const res = await fetch("https://api.capy.lol/v1/capybara?json=true");
              const data = await res.json();
              imageUrl = data.data.url;
            }
            break;
            default:
              imageUrl = null;
          }
          
          const embeds = [
            new MessageEmbed()
            .setImage(imageUrl)
            .setColor(constants.Colors.MAIN_EMBED_COLOR)
          ];
          
          if (Math.floor(Math.random() * 7) === 0) {
            const shuffled = animalCommands.sort(() => 0.5 - Math.random());
            const count = Math.floor(Math.random() * 3) + 3;
            const randomCommands = shuffled.slice(0, count)
              .map(cmd => `\`${cmd.usage.replace("{prefix}", constants.Prefixes[1])}\``)
              .join(", ");
            
            const promoEmbed = new MessageEmbed()
              .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
              .setDescription(`Also check out my other commands: ${randomCommands}`)
              .setColor(constants.Colors.MAIN_EMBED_COLOR);
            
            embeds.push(promoEmbed);
          }
          
          reply.edit({
            content: null,
            embeds: embeds,
            components: [pinAndSendDmButtons]
          });
        } catch (error) {
          reply.edit(`Failed to fetch an image of \`${animalCommand.name}\``);
          console.log(`${error.name} ${error.message} | CommandName: ${animalCommand.name}`);
        }
      }
    });
    
    bot.prefixCommands.set(animalCommand.name, command as typings.ElainaPrefixCommand);
  }
});