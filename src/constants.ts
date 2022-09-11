import { PresenceData } from "discord.js";

export const Prefixes = [
  "e",
  "e!",
  "<@905531439188181003>",
  "<@!905531439188181003>"
] as const;

export const Emojis = {
  ERROR: "<a:Error:1017806230451925002>",
  SUCCESS: "<a:Success:1012844463019802704>",
  INFO: "<:Info:913023268162789386>",
  ELAINA: "<a:a_elaina:1015651652109344878>"
} as const;

export const ElainaPresenceData = {
  status: "online",
  activities: [
    {
      name: "You know? Magic will deeply connect us all.",
      type: "PLAYING"
    }
  ]
} as PresenceData;

export const Colors = {
  MAIN_EMBED_COLOR: "#ffffff"
} as const;
