import client, { Event, constants, ElainaPrefixCommand } from "../index";
import { Guild, MessageEmbed } from "discord.js";
import akaneko from "akaneko";

export default new Event("ready", async () => {
  const bot = client.user!;
 
  console.log(
    `${bot.tag} is up and ready to go!\n\nGuilds: ${client.guilds.cache.map((guild: Guild) => guild.name).join(", ")}.`
  );
  
  await bot.setPresence(constants.ElainaPresenceData);
  
  // hentai commands
  const hentaiCommands = [
    { name: "hentai", description: "Random vanilla hentai images.", aliases: ["h"] },
    { name: "ass", description: "I know you like anime ass.", aliases: [] },
    { name: "blowjob", description: "Basically an image of a girl sucking on a sharp blade!.", aliases: ["blj", "bjb"] },
    { name: "cum", description: "Basically sticky white stuff that is usually milked from sharpies.", aliases: [] },
    { name: "panties", description: "I mean... just why? You like underwear?", aliases: ["psy"] },
    { name: "pussy", description: "The genitals of a female, or a cat, you give the meaning.", aliases: [] },
    { name: "school", description: "School Uniforms!~ Yatta~!", aliases: [] },
    { name: "tentacles", description: "I'm sorry but, why do they look like intestines?", aliases: [] },
    { name: "thighs", description: "The top part of your legs, very hot, isn't it?", aliases: [] },
    { name: "uniform", description: "Military, Konbini, Work, Nurse Uniforms, etc!~ Sexy~", aliases: [] },
    { name: "gifs", description: "Basically an animated image, so yes :3", aliases: [] }
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
      
        akaneko[hentaiCommand]().then((imageUrl: string) => {
          reply.edit({
            embeds: [
              new MessageEmbed()
                .setImage(imageUrl)
                .setColor(constants.Colors.MAIN_EMBED_COLOR)
            ]
          });
        }).catch(error => {
          reply.edit(`Failed to fetch an image of ${hentaiCommand}`);
          console.log(error.name+" "+error.message+" | CommandName: "+hentaiCommand);
        });
      }
    });
    
    client.prefixCommands.set(hentaiCommand.name, command);
  }
});
