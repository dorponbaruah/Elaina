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
  ELAINA: "<a:a_elaina:1015651652109344878>",
  LOADING: "<a:D_Loading:930501726270803988>",
  MINUS: "<:minus:930205412597301281>",
  PLUS: "<:plus:930205440728510465>",
  VERSUS: "<:versus:1020912444169793556>",
  CIRCLE: "<:tictactoe_o:1021142952933855264>",
  CROSS: "<:tictactoe_x:1021142994319056987>",
  TADA: "<:tada:1021201711177666650>"
} as const;

export const ElainaPresenceData = {
  status: "online",
  activities: [
    {
      name: "Coding is no fun at all",
      type: "PLAYING"
    }
  ]
} as PresenceData;

export const Colors = {
  MAIN_EMBED_COLOR: "#ffffff"
} as const;
