import { ElainaSlashCommand } from "../index";
import getHelpTemplates from "../templates/help";

export default new ElainaSlashCommand({
  name: "help",
  description: "Get instant guidance on my commands.",
  category: "Info",
  run: async (client, interaction) => {
    const row = getHelpTemplates("categorySelectionMenu");
    
    if (!interaction.inCachedGuild()) return;
    
    const msg = await interaction.reply({
      embeds: [getHelpTemplates("getStartedEmbed", interaction)],
      components: [row],
      fetchReply: true
    });
    
    const timeoutId = setTimeout(() => {
      row.components[0].disabled = true;
    
      if (msg) msg.edit({ components: [row] });
      
      client.timeoutIds.delete(msg.id);
    }, 24000);
    
    client.timeoutIds.set(msg.id, timeoutId);
  }
});
