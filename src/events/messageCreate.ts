import client, { Event, typings, constants } from "../index";
import { GuildTextBasedChannel } from "discord.js";

export default new Event("messageCreate", async (message) => {
  if (
    message.author.bot ||
    !message.guild
  ) return;
  
  const msgContent = message.content!.toLowerCase(),
    msgChannel = (message.channel!) as GuildTextBasedChannel,
    msgMember = message.member!;
  
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
});
