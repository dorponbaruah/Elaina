import client, { Event, constants } from "../index";
import { Guild } from "discord.js";

export default new Event("ready", async () => {
  const bot = client.user!;
 
  console.log(
    `${bot.tag} is up and ready to go!\n\nGuilds: ${client.guilds.cache.map((guild: Guild) => guild.name).join(", ")}.`
  );
  
  await bot.setPresence(constants.ElainaPresenceData);
});
