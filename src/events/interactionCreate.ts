import client, { Event, typings, constants } from "../index";

export default new Event("interactionCreate", async (interaction) => {
  // Slash command handler 
  if (interaction.isCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return interaction.reply({
      content: `${constants.Emojis.ERROR} Something went wrong!`,
      ephemeral: true
    });

    if (command.category === "Developer" && interaction.user.id !== process.env.developerId)
      return interaction.reply({
        content: `${constants.Emojis.ERROR} This command can only be used by the bot owner.`,
        ephemeral: true
      });

    await command.run(client, interaction as typings.ExtendedCommandInteraction);
  }
});
