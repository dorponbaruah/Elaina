import client, { Event } from "../index";
import { Guild, GuildTextBasedChannel } from "discord.js";

export default new Event("guildMemberRemove", async (member) => {
  if (member.user.bot) return;

  const guildId: string = JSON.parse((process.env.guildIds) as string)[1];

  await (client.guilds.cache.get(guildId)!
    .channels.cache.find(channel => channel.name === "fresh-blood") as GuildTextBasedChannel
  )
  .send(`The feint of heart should not be here, you were warned **${member.user.tag}**`);
});
