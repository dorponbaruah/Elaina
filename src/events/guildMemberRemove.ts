import client, { Event } from "../index";
import { GuildTextBasedChannel } from "discord.js";

export default new Event("guildMemberRemove", async (member) => {
  if (
    member.guild.id !== '870740803297902613' ||
    member.user.bot
  )
    return;
  
  (member.guild.channels.cache.get("899960876466057257") as GuildTextBasedChannel)
    .send(`The feint of heart should not be here, you were warned **${member.user.tag}**`);
});
