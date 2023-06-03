import { ElainaPrefixCommand, constants, ElainaErrorMessage } from "../index";
import { MessageEmbed, MessageActionRow, MessageActionRowComponent, MessageButton, Message, Interaction, ButtonInteraction, Snowflake, GuildMember } from "discord.js";

let circle_turn: boolean;

export default new ElainaPrefixCommand({
  name: "tictactoe",
  description: "Challenge a fellow citizen to a game of TicTacToe.",
  aliases: ["ttt"],
  category: "Fun",
  run: async (client, message, args) => {
    const invitedForChallenge = message.mentions.users.first();

    const getInvalidInputErrorMessage = (): string | boolean => {
      switch (true) {
        case !invitedForChallenge:
          return "Please mention (@) a user to challenge.";

        case invitedForChallenge.id === message.member.id:
          return "You cannot challenge yourself!";

        case invitedForChallenge.bot:
          return "You cannot challenge bots!";

        default:
          return false;
      }
    }

    if (getInvalidInputErrorMessage())
      return message.reply(
        new ElainaErrorMessage(getInvalidInputErrorMessage() as string, {
          mention: true
        })
      );

    const challengeAcceptBtn = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setStyle("SUCCESS")
        .setLabel("Accept Challenge")
        .setCustomId(`ttt_challenge_button::${JSON.stringify({ invited: invitedForChallenge.id, initiator: message.member.id })}`),
      );

    message.channel.send({
        content: `<@${invitedForChallenge.id}>, **${message.member.nickname ?? message.member.username}** challenged you to a duel!`,
        components: [challengeAcceptBtn]
      })
      .then(msg => {
        setTimeout(() => {
          if (msg.components[0].components.length === 3) return;

          (challengeAcceptBtn.components[0] as MessageButton)
            .setStyle("DANGER")
            .setLabel("Expired")
            .setDisabled(true);

          msg.edit({
            content: `${constants.Emojis.ERROR} <@${invitedForChallenge.id}> did not stand against the enemy.`,
            components: [challengeAcceptBtn]
          });
        }, 32000);
      });
  },
  eventListener: {
    event: "interactionCreate",
    run: async (interaction: Interaction) => {
      if (!interaction.isButton()) return;

      const { guild, customId, user, message } = interaction;

      const enum Marks {
        CROSS = "x",
          CIRCLE = "o"
      }

      const winConditions = [
        [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
        [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
        [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
        [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
        [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
        [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
        [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }]
      ];

      interface IDataPassedInCustomId {
        row: 0 | 1 | 2;
        column: 0 | 1 | 2;
        player ? : {
          x: Snowflake,
          o: Snowflake
        };
        isMarked ? : boolean;
        mark ? : Marks;
      }

      async function placeMark(currentTurn: Marks, data: IDataPassedInCustomId): Promise < Message > {
        const targetCell = (message.components[data.row].components[data.column] as MessageButton)
          .setLabel('')
          .setEmoji(currentTurn === Marks.CROSS ? constants.Emojis.CROSS : constants.Emojis.CIRCLE)
          .setStyle(currentTurn === Marks.CROSS ? "DANGER" : "PRIMARY")
          .setCustomId(`e/ttt_cell::${JSON.stringify({ isMarked: true, mark: currentTurn, row: data.row, column: data.column })}`)

        return await (interaction as ButtonInteraction).update({
          embeds: [
            (message.embeds[0] as MessageEmbed)
              .setThumbnail(
              currentTurn === Marks.CROSS ?
              `https://cdn.discordapp.com/emojis/${constants.Emojis.CIRCLE.replace(/\D/g,'')}.png` :
              `https://cdn.discordapp.com/emojis/${constants.Emojis.CROSS.replace(/\D/g, '')}.png`
            )
              .setDescription(`${constants.Emojis.LOADING} <@${currentTurn === Marks.CROSS ? data.player.o : data.player.x}>'s turn`)
              .setColor(constants.Colors.MAIN_EMBED_COLOR)
          ],
          components: message.components as MessageActionRow[],
          fetchReply: true
        }) as Message;
      }

      function checkWin(currentTurn: Marks): boolean {
        return winConditions.some(combinations =>
          combinations.every(cellPosition =>
            JSON.parse(
              (message.components[cellPosition.row].components[cellPosition.col] as MessageButton).customId.split("::")[1]
            ).mark === currentTurn
          )
        );
      }

      function checkDraw(): boolean {
        const buttons: MessageButton[] = [];

        for (const row of message.components) {
          for (const button of row.components) {
            buttons.push(button as MessageButton);
          }
        }

        return buttons.every((button: MessageButton) =>
          JSON.parse(button.customId.split("::")[1]).isMarked
        )
      }

      function endGame({ msg, dataPassedInCustomId, currentTurn }: { msg: Message, dataPassedInCustomId ? : IDataPassedInCustomId, currentTurn ? : Marks }, isDraw ? : boolean): void {
        for (const row of message.components) {
          for (const button of row.components) {
            (button as MessageButton)
            .setDisabled(true);
          }
        }

        if (isDraw) {
          msg.edit({
            embeds: [
              (message.embeds[0] as MessageEmbed)
                .setDescription(`${constants.Emojis.INFO} No one won the game, it's a tie! Let's try again?`)
                .setColor("#79b2ff")
            ],
            components: message.components as MessageActionRow[]
          });
        }
        else {
          msg.edit({
            embeds: [
              (message.embeds[0] as MessageEmbed)
                .setThumbnail(
                currentTurn === Marks.CROSS ?
                `https://cdn.discordapp.com/emojis/${constants.Emojis.CIRCLE.replace(/\D/g,'')}.png` :
                `https://cdn.discordapp.com/emojis/${constants.Emojis.CROSS.replace(/\D/g, '')}.png`
              )
                .setDescription(`${constants.Emojis.TADA} <@${dataPassedInCustomId.player[currentTurn]}> has won the game!`)
                .setColor("#00ffff")
            ],
            components: message.components as MessageActionRow[]
          });
        }
      }

      if (customId.startsWith("ttt_challenge_button::")) {
        const invitedPlayer = guild.members.cache.get(JSON.parse(customId.split("::")[1]).invited);
        const initiator = guild.members.cache.get(JSON.parse(customId.split("::")[1]).initiator);

        if (user.id !== invitedPlayer.id) {
          if (user.id === initiator.id) {
            interaction.reply(
              new ElainaErrorMessage("Wait, you can't!", {
                ephemeral: true
              })
            );
          }
          else {
            interaction.reply(
              new ElainaErrorMessage("This challenge is not for you, silly!", {
                ephemeral: true
              })
            );
          }
          return;
        }

        const rows: MessageActionRow[] = [];

        const player_x = new Array(initiator, invitedPlayer)[Math.floor(Math.random() * 2)];
        const player_o = player_x.id === invitedPlayer.id ? initiator : invitedPlayer;

        for (let r = 0; r < 3; r++) {
          rows.push(
            new MessageActionRow()
          );

          for (let c = 0; c < 3; c++) {
            rows[r].addComponents(
              new MessageButton()
              .setStyle("SECONDARY")
              .setEmoji(constants.Emojis.EMPTY)
              .setCustomId(`e/ttt_cell::${JSON.stringify({ player: { x: player_x.id, o: player_o.id }, row: r, column: c })}`)
            );
          }
        }

        await interaction.update({
          content: null,
          embeds: [
            new MessageEmbed()
              .setTitle(`${initiator.nickname ?? initiator.user.username} ${constants.Emojis.VERSUS} ${invitedPlayer.nickname ?? invitedPlayer.user.username}`)
              .setThumbnail(`https://cdn.discordapp.com/emojis/${constants.Emojis.CROSS.replace(/\D/g, '')}.png`)
              .setDescription(`${constants.Emojis.LOADING} <@${player_x.id}>'s turn`)
              .setColor(constants.Colors.MAIN_EMBED_COLOR)
          ],
          components: rows
        });
      }

      if (customId.startsWith("e/ttt_cell::")) {
        const dataPassedInCustomId = JSON.parse(customId.split("::")[1]);

        if (dataPassedInCustomId.isMarked)
          return interaction.deferUpdate();

        if (
          user.id !== dataPassedInCustomId.player.x &&
          user.id !== dataPassedInCustomId.player.o
        )
          return interaction.reply(
            new ElainaErrorMessage("Don't interrupt, they're playing!", {
              ephemeral: true
            })
          );

        const currentTurn = circle_turn ? Marks.CIRCLE : Marks.CROSS;

        if (dataPassedInCustomId.player[currentTurn] !== user.id)
          return interaction.reply(
            new ElainaErrorMessage("Please wait your turn!", {
              ephemeral: true
            })
          );

        await placeMark(currentTurn, dataPassedInCustomId)
          .then(msg => {
            if (checkWin(currentTurn)) {
              endGame({ msg, dataPassedInCustomId, currentTurn });
            }
            else if (checkDraw()) {
              endGame({ msg }, true);
            }
          });

        circle_turn = !circle_turn;
      }
    }
  }
});
