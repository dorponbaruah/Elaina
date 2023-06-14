import { ElainaPrefixCommand, ElainaWebhook, ElainaErrorMessage } from "../index";

export default new ElainaPrefixCommand({
  name: "anonymous",
  description: "Anonymously send a message in #chat",
  aliases: ["anym"],
  category: "Fun",
  usage: "{prefix}anonymous `<text>`",
  examples: ["{prefix}anonymous Hello, you'll never know who sent this message."],
  run: (client, message, args) => {
    message.delete();
    
    if (!args[0]) {
      new ElainaWebhook({ channelId: message.channel.id })
        .send({
          username: "Fake Elaina",
          avatarURL: "https://media.discordapp.net/attachments/926846660322160700/1117862760110358620/IMG_20230612_223704.jpg",
          content: "Whoever tried to use the `anonymous` command doesn't know how to use it. 👎👎\n\nCorrect usage: `e!anonymous <your message here>`"
        });
        
      return;
    }
    
    const text = args.join(" ");
    
    new ElainaWebhook({ channelId: "899931639860305930" })
      .send({
        username: "Anonymous#"+Math.floor(1000 + Math.random() * 9000),
        avatarURL: "https://media.discordapp.net/attachments/926846660322160700/1117862760374612058/779a66f4db83bc65c65256aa52f2a9e0.jpg",
        content: text
      });
  }
});
