import { typings } from "../index";

/**
 * Represents a prefix command of Elaina#0102.
 * 
 */
export class PrefixCommand {
  
  /**
   * @param {typings.ElainaPrefixCommand} options - Options for the prefix command.
   * 
   * @example
   * new PrefixCommand({
   *   name: "ping",
   *   description: "Replies with pong.",
   *   aliases: ["ponge"],
   *   category: "Fun",
   *   run: (client, message, args) => {
   *     message.reply(`Pong! 🏓`);
   *   }
   * });
   */
  constructor(options: typings.ElainaPrefixCommand) {
    Object.assign(this, options);
  }
}

/**
 * Represents a chat input command of Elaina#0102.
 */
export class SlashCommand {
  
  /**
   * @param {typings.ElainaSlashCommand} options - Options for the slash command. 
   *
   * @example
   * new SlashCommand({
   *   name: "ping",
   *   description: "Replies with pong.",
   *   category: "Fun",
   *   run: (client, interaction) => {
   *     interaction.reply(`Pong! 🏓`);
   *   }
   * });
   */
  constructor(options: typings.ElainaSlashCommand) {
    Object.assign(this, options);
  }
}
