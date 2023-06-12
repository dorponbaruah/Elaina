import { ElainaPrefixCommand, ElainaWebhook, ElainaErrorMessage } from "../index";

export default new ElainaPrefixCommand({
  name: "anonymous",
  description: "Anonymously send a message in #chat",
  aliases: ["anym"],
  category: "Fun",
  run: (client, message, args) => {
    message.delete();
    
    if (!args[0]) {
      new ElainaWebhook({ channelId: message.channel.id })
        .send({
          username: "Fake Elaina",
          avatarURL: "",
          content: "Whoever tried to use the `anonymous` command doesn't know how to use it. 👎👎\n\nCorrect usage: `e!anonymous <your message here>"
        });
        
      return;
    }
    
    const text = args.join(" ");
    
    new ElainaWebhook({ channelId: "" })
      .send({
        username: "Anonymous",
        avatarURL: "",
        content: text
      });
  }
});
