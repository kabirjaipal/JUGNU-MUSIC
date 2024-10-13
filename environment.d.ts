declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      PREFIX: string;
      GuildID: string;
      environment: "dev" | "prod" | "debug";
    }
  }
}

export {};
