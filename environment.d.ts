declare global {
  namespace NodeJS {
    interface ProcessEnv {
      botToken: string;
      developer: string;
      guilds: string;
    }
  }
}

export {};
