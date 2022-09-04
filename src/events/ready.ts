import client, { Event } from "../index";
import { Guild } from "discord.js";

export default new Event("ready", () => {
  const bot = client.user!;
 
  console.log(
    `${bot.tag} is up and ready to go!\n\nGuilds: ${client.guilds.cache.map((guild: Guild) => guild.name).join(", ")}.`
  );
});
