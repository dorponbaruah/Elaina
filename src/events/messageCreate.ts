import client, { Event, typings, constants } from "../index";
import { GuildTextBasedChannel } from "discord.js";

export default new Event("messageCreate", async (message) => {
  if (
    message.author.bot ||
    !message.guild
  ) return;
  
  const msgContent = message.content!.toLowerCase(),
    msgChannel = (message.channel!) as GuildTextBasedChannel,
    msgMember = message.member!,
    msgGuild = message.guild!;
  
  // Prefix command handler
  let prefix: typings.BotPrefix = constants.Prefixes[0];

  for await (const thisPrefix of constants.Prefixes) {
    if (msgContent.startsWith(thisPrefix)) {
      prefix = thisPrefix;
    }
  }

  if (msgContent.startsWith(prefix)) {
    const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

    const command = client.prefixCommands.get(cmd.toLowerCase()) || client.prefixCommands.find(c => (c.aliases!.includes(cmd.toLowerCase())) as boolean);
    if (!command) return;

    if (command.category === "Developer" && msgMember.id !== process.env.developerId)
      return message.reply(
        `${constants.Emojis.ERROR} This command can only be used by the bot owner.`
      );

    command.run(client, message, args);
  }
  
  // Member verification
  if (msgChannel.name.includes("gatehouse")) {
    message.delete();
  
    const aceKingdomId: string = JSON.parse((process.env.guildIds) as string)[1];
  
    if (
      message.guildId !== aceKingdomId ||
      msgContent !== "!ace"
    ) return;
  
    msgMember.roles.add("891974559610318878", "Autorole");
    msgMember.roles.add("902166509701443604", "Autorole");
  
    msgMember.send(`Welcome to ${msgGuild.name} <@${msgMember.id}> ${constants.Emojis.ELAINA}`);
  }
});
