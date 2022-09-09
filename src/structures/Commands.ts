import { typings } from "../index";

export class PrefixCommand {
  constructor(options: typings.ElainaPrefixCommand) {
    Object.assign(this, options);
  }
}

export class SlashCommand {
  constructor(options: typings.ElainaSlashCommand) {
    Object.assign(this, options);
  }
}
