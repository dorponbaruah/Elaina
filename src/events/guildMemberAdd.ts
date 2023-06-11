import client, { Event } from "../index";
import { MessageEmbed, Guild, GuildTextBasedChannel } from "discord.js";

export default new Event("guildMemberAdd", async (member) => {
  const guildId: string = JSON.parse((process.env.guildIds) as string)[1];
  
  if (
    member.guild.id !== guildId ||
    member.user.bot
  )
    return;
  
  (member.guild.channels.cache.get("899960876466057257") as GuildTextBasedChannel)
    .send({
      embeds: [
        new MessageEmbed()
          .setColor("#ffffff")
          .setDescription(`Another lost soul has stumbled upon the kingdom... be warned that not everything is as it seems\n<@${member.id}>`)
          .setImage("https://media.discordapp.net/attachments/926846660322160700/1015712579244535928/a2f7ad78-c17c-4499-818a-feb28a931495.gif")
        ]
    });
});
