import { ElainaSlashCommand } from "../index";

export default new ElainaSlashCommand({
  name: "ping",
  description: "Shows bot's latency to discord.",
  options: [
    {
      name: "hide",
      type: "BOOLEAN",
      description: "Hides the output."
    }
  ],
  category: "Info",
  run: (client, interaction) => {
    interaction.reply({
      content: `Pong! 🏓 \`${client.ws.ping}ms\``,
      ephemeral: interaction.options.getBoolean("hide") || true
    });
  }
});
