import { typings, constants, Event } from "../index";
import { Client, Collection, Intents, ApplicationCommandDataResolvable, ClientEvents, Snowflake } from "discord.js";
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
    
    for (const filepath of prefixCommandFiles) {
      const command: typings.ElainaPrefixCommand = await importFile(filepath);
      if (!command.name) return;
   
      if (command.eventListener) {
        this.on(command.eventListener.event, command.eventListener.run);
      }
      
      this.prefixCommands.set(command.name, command);
    }
    
    // Slash Commands
    const slashCommandFiles = await globPromise(
      `${__dirname}/../slashCommands/*{.ts,.js}`
    );
    
    const arrayOfSlashCommands: ApplicationCommandDataResolvable[] = [];
    
    for (const filepath of slashCommandFiles) {
      const command: typings.ElainaSlashCommand = await importFile(filepath);
      if (!command.name) return;
      if (command.eventListener) {
        this.on(command.eventListener.event, command.eventListener.run);
      }
      
      this.slashCommands.set(command.name, command);
      arrayOfSlashCommands.push(command);
    }
    
    const guildIds: Snowflake[] = JSON.parse((process.env.guildIds) as string);
    
    this.on("ready", async () => {
      for (const guildId of guildIds) {
        await this.guilds.cache.get(guildId)!
          .commands.set(arrayOfSlashCommands);
      }
    });
    
    // Events
    const eventFiles = await globPromise(
      `${__dirname}/../events/*{.ts,.js}`
    );
    
    for (const filePath of eventFiles) {
      const event: Event<keyof ClientEvents> = await importFile(filePath);
      
      this.on(event.event, event.run);
    }
  }
}
