import { typings, constants, Event } from "../index";
import { Client, Collection, Intents, ApplicationCommandDataResolvable, ClientEvents } from "discord.js";
import { promisify } from "util";
import glob from "glob";

export class ElainaClient extends Client<true> {
  public prefixCommands: Collection<string, typings.ElainaPrefixCommand> = new Collection();
  public slashCommands: Collection<string, typings.ElainaSlashCommand> = new Collection();
  
  public start() {
    this.login(process.env.botToken);
    this.registerModules();
  }

  public async registerModules() {
    const globPromise = promisify(glob);
    
    const importFile = async (filepath: string) => {
      return (await import(filepath))?.default;
    }
    
    // Prefix Commands
    const prefixCommandFiles = await globPromise(
      `${__dirname}/../prefixCommands/*{.ts,.js}`
    );
    
    prefixCommandFiles.forEach( async (filepath) => {
      const command: typings.ElainaPrefixCommand = await importFile(filepath);
      if (!command.name) return;
      if (command.init) {
        this.on(command.init.event, command.init.run);
      }
      
      this.prefixCommands.set(command.name, command);
    });
    
    // Slash Commands
    const slashCommandFiles = await globPromise(
      `${__dirname}/../slashCommands/*{.ts,.js}`
    );
    
    const arrayOfSlashCommands: ApplicationCommandDataResolvable[] = [];
    
    slashCommandFiles.forEach( async (filepath) => {
      const command: typings.ElainaSlashCommand = await importFile(filepath);
      if (!command.name) return;
      if (command.init) {
        this.on(command.init.event, command.init.run);
      }
      
      this.slashCommands.set(command.name, command);
      arrayOfSlashCommands.push(command);
    });
    
    const guildIds: string[] = JSON.parse((process.env.guildIds) as string);
    
    this.on("ready", () => {
      guildIds.forEach( async (guildId) => {
        await this.guilds.cache.get(guildId)!
          .commands.set(arrayOfSlashCommands);
      });
    });
    
    // Events
    const eventFiles = await globPromise(
      `${__dirname}/../events/*{.ts,.js}`
    );
    
    eventFiles.forEach( async (filepath) => {
      const event: Event<keyof ClientEvents> = await importFile(filepath);
      
      this.on(event.event, event.run);
    });
  }
}
