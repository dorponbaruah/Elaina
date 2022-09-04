import { PrefixCommand } from "../index";

export default new PrefixCommand({
  name: "ping",
  description: "Shows bot's latency to discord.",
  aliases: ["latency"],
  category: "Info",
  run: (client, message, args) => {
    message.reply(`Pong! 🏓 \`${client.ws.ping}ms\``);
  }
});