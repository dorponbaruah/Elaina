import { ElainaSlashCommand } from "../index";

export default new ElainaSlashCommand({
  name: "send",
  description: "Send a message using raw JSON.",
  options: [{
    type: "STRING",
    name: "raw_json",
    description: "Enter json data",
    required: true
  }],
  category: "Server settings",
  run: (client, interaction) => {
    const str = JSON.parse(interaction.options.getString("raw_json"));
    
    interaction.channel.send(str)
      .then(() => {
        interaction.reply({ content: "Successfully sent the message to this channel!", ephemeral: true });
      })
      .catch((err) => {
        interaction.reply({ content: `Error: ${err.message}`, ephemeral: true });
      });
  }
});