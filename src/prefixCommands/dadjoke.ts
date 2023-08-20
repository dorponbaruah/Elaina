import { ElainaPrefixCommand, ElainaErrorMessage } from "../index";
import fetch from "node-fetch";

export default new ElainaPrefixCommand({
  name: "dadjoke",
  description: "Sends a random dad joke.",
  aliases: ["joke"],
  category: "Fun",
  onlyChannels: ["chat", "fun-bots", "royal-knights", "captains"],
  usage: "{prefix}dadjoke",
  run: (client, message, args) => {
    fetch("https://icanhazdadjoke.com/", {
        headers: {
          "Accept": "text/plain"
        }
      })

      .then(res => res.text())

      .then(joke => message.reply(joke))

      .catch(error => {
        console.error(error);

        message.reply(
          new ElainaErrorMessage("Failed to find a joke! :(", {
            mention: true
          })
        );
      });
  }
});