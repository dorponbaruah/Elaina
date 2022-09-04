import { ClientEvents } from "discord.js";

/**
 * Represents a event emitted by the Client.
 */
export class Event<Key extends keyof ClientEvents> {
  
  /**
   * @param {Key} event - Type of the event.
   * @param {function(ClientEvents[Key]):any} run - The event handler.
   * 
   * @example
   * new Event("guildMemberAdd", (member) => {
   *   member.send({
   *     `Welcome to the server! <${member.id}>`
   *   });
   * });
   */
  constructor(
    public event: Key,
    public run: (...args: ClientEvents[Key]) => any
    ) {}
}
