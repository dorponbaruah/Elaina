import { ElainaSlashCommand } from "../index";

export default new ElainaSlashCommand({
  name: "send",
  description: "Send a message using raw JSON.",
  options: [{
    type: "STRING",
    name: "raw_json",
    description: "Enter json data",
    require: true
  }],
  category: "Server settings",
  run: (client, interaction) => {
    const str = JSON.parse(interaction.options.getString("raw_json"));
    
    interaction.channel.send(str);
  }
});