import { constants } from "./index";
import { ElainaClient } from "./structures/ElainaClient";
import { Message, CommandInteraction, GuildMember, ApplicationCommandDataResolvable, ClientEvents } from "discord.js";

interface Init<Key extends keyof ClientEvents> {
  event: Key;
  run: (...args: ClientEvents[Key]) => any;
}

type Commons = {
  category: string;
  init?: Init<keyof ClientEvents>;
}

export type ElainaPrefixCommand = {
  name: string;
  aliases: string[];
  description: string;
  run: (
    client: ElainaClient,
    message: Message,
    args: {[index: number]: string}
  ) => any;
} & Commons;

export interface ExtendedCommandInteraction extends CommandInteraction {
  member: GuildMember;
}

export type ElainaSlashCommand = {
  run: (
    client: ElainaClient,
    interaction: ExtendedCommandInteraction
  ) => any;
} & Commons & ApplicationCommandDataResolvable;

export type BotPrefix = typeof constants.Prefixes[number];
