import { ElainaPrefixCommand, ElainaErrorMessage } from "../index";
import fetch from "node-fetch";

export default new ElainaPrefixCommand({
  name: "hindijoke",
  description: "Sends a random hindi (हिंदी) joke.",
  aliases: ["indianjoke", "hj"],
  category: "Fun",
  onlyChannels: ["chat", "fun-bots", "royal-knights", "captains"],
  usage: "{prefix}hindijoke",
  run: (client, message, args) => {
    
    fetch("https://hindi-jokes-api.onrender.com/jokes?api_key=145413bd1a0c9d10cc933bf3dced")

      .then(res => res.json())

      .then(data => {
        message.reply(data.jokeContent);
      })

      .catch(error => {
        console.error(error);

        message.reply(
          new ElainaErrorMessage("Is baar koi joke nahi mila. Kya aap dobara koshish kar sakte hain?", {
            mention: true
          })
        );
      });
  }
});