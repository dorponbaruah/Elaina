import { ElainaPrefixCommand } from "../index";

export default new ElainaPrefixCommand({
  name: "ping",
  description: "Shows bot's latency to discord.",
  aliases: ["latency"],
  category: "Info",
  run: (client, message, args) => {
    message.reply(`Pong! 🏓 \`${client.ws.ping}ms\``);
  }
});
