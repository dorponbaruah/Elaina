import client, { Event } from "../index";
import { Guild, GuildTextBasedChannel } from "discord.js";

export default new Event("guildMemberRemove", async (member) => {
  const guildId: string = JSON.parse((process.env.guildIds) as string)[1];
  
  if (
    member.guild.id !== guildId ||
    member.user.bot
  )
    return;
  
  (member.guild.channels.cache.get("899960876466057257") as GuildTextBasedChannel)
    .send(`The feint of heart should not be here, you were warned **${member.user.tag}**`);
});
