import { ElainaPrefixCommand, constants, ElainaErrorMessage } from "../index";
import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Message,
  GuildMember,
  Interaction,
  ButtonInteraction,
  Snowflake
} from "discord.js";

type AIDifficulty = 'easy' | 'normal' | 'hard';

interface GameState {
  playerX: Snowflake;
  playerO: Snowflake | 'AI';
  circleTurn: boolean;
  difficulty ? : AIDifficulty;
  board: (Marks | null)[][];
  createdAt: number;
}

function generateGameId(): string {
  return Math.random().toString(36).substring(2, 10);
}

const gameStates = new Map < string,
  GameState > ();
const cooldowns = new Map < string,
  number > ();
const COOLDOWN_TIME = 3000;
const enum Marks { CROSS = "x", CIRCLE = "o" };

export default new ElainaPrefixCommand({
  name: "tictactoe",
  description: "Challenge a fellow citizen or AI to a game of TicTacToe.",
  aliases: ["ttt"],
  onlyChannels: ["fun-bots"],
  category: "Fun",
  usage: "{prefix}tictactoe `<@user|ai>`",
  examples: [
    "{prefix}tictactoe <@826899456909770763>",
    "{prefix}tictactoe ai"
  ],
  run: async (client, message, args) => {
    const input = args[0]?.toLowerCase();
    
    if (input === 'ai') {
      const difficultyRow = new MessageActionRow()
        .addComponents(
          new MessageButton()
          .setCustomId(`ttt_ai_difficulty::${message.id}::easy`)
          .setLabel('Easy')
          .setStyle('SUCCESS'),
          new MessageButton()
          .setCustomId(`ttt_ai_difficulty::${message.id}::normal`)
          .setLabel('Normal')
          .setStyle('PRIMARY'),
          new MessageButton()
          .setCustomId(`ttt_ai_difficulty::${message.id}::hard`)
          .setLabel('Hard')
          .setStyle('DANGER')
        );
      
      const difficultyMsg = await message.channel.send({
        embeds: [
          new MessageEmbed()
          .setDescription(`${message.member}, select AI difficulty:`)
          .setColor(constants.Colors.MAIN_EMBED_COLOR)
        ],
        components: [difficultyRow]
      });
      
      gameStates.set(difficultyMsg.id, {
        circleTurn: Math.random() < 0.5,
        playerX: message.member.id,
        playerO: 'AI',
        board: [
          [null, null, null],
          [null, null, null],
          [null, null, null]
        ],
        createdAt: Date.now()
      });
      
      setTimeout(async () => {
        try {
          const currentState = gameStates.get(difficultyMsg.id);
          if (!currentState || currentState.difficulty) return;
          
          try {
            const msg = await difficultyMsg.channel.messages.fetch(difficultyMsg.id).catch(() => null);
            if (!msg) return;
            
            await msg.edit({
              embeds: [
                new MessageEmbed()
                .setDescription("**Game expired** - No difficulty selected.")
                .setColor(constants.Colors.WARNING_EMBED_COLOR)
              ],
              components: [new MessageActionRow().addComponents(
                difficultyRow.components.map(button =>
                  (button as MessageButton)
                  .setDisabled(true)
                  .setStyle('DANGER')
                )
              )]
            });
          } finally {
            gameStates.delete(difficultyMsg.id);
          }
        } catch (error) {
          if (error.code !== 10008) {
            console.error('Error handling difficulty timeout:', error);
          }
        }
      }, 30000);
      return;
    }
    
    const invitedForChallenge = message.mentions.users.first();
    
    const getInvalidInputErrorMessage = (): string | boolean => {
      switch (true) {
        case !invitedForChallenge && input !== 'ai':
          return "Please mention (@) a user to challenge or type 'ai' to play against computer.";
        case invitedForChallenge?.id === message.member.id:
          return "You cannot challenge yourself!";
        case invitedForChallenge?.bot:
          return "You cannot challenge bots!";
        default:
          return false;
      }
    }
    
    if (getInvalidInputErrorMessage()) {
      return message.reply(
        new ElainaErrorMessage(getInvalidInputErrorMessage() as string, {
          mention: true
        })
      );
    }
    
    const challengeAcceptBtn = new MessageButton()
      .setStyle("SUCCESS")
      .setLabel("Accept Challenge")
      .setCustomId(`ttt_challenge_button::${JSON.stringify({ 
        invited: invitedForChallenge.id, 
        initiator: message.member.id 
      })}`);
    
    const challengeMsg = await message.channel.send({
      embeds: [
        new MessageEmbed()
        .setDescription(`<@${invitedForChallenge.id}>, **${message.member.nickname ?? message.member.user.username}** challenged you to a duel!`)
        .setColor(constants.Colors.MAIN_EMBED_COLOR)
      ],
      components: [new MessageActionRow().addComponents(challengeAcceptBtn)]
    });
    
    setTimeout(async () => {
      try {
        if (!challengeMsg) return;
        
        try {
          const fetchedMsg = await challengeMsg.channel.messages.fetch(challengeMsg.id);
          if (fetchedMsg.components[0]?.components[0]?.customId.startsWith("ttt_challenge_button")) {
            await fetchedMsg.edit({
              embeds: [
                new MessageEmbed()
                .setDescription("**Challenge expired** - Your opponent didn't accept the challenge.")
                .setColor(constants.Colors.WARNING_EMBED_COLOR)
              ],
              components: [
                new MessageActionRow().addComponents(
                  challengeAcceptBtn
                  .setDisabled(true)
                  .setStyle('DANGER')
                  .setLabel("Expired")
                )
              ]
            });
          }
        } catch (error) {
          if (error.code !== 10008) console.error('Error editing challenge:', error);
        }
      } catch (error) {
        console.error('Error in timeout handler:', error);
      }
    }, 32000);
  },
  eventListener: {
    event: "interactionCreate",
    run: async (interaction: Interaction) => {
      if (!interaction.isButton()) return;
      
      const { customId, user, message } = interaction;
      
      if (customId.startsWith('ttt_ai_difficulty::')) {
        const [_, messageId, difficulty] = customId.split('::') as[string, string, AIDifficulty];
        
        try {
          await interaction.deferUpdate();
          const originalMessage = await interaction.channel!.messages.fetch(messageId);
          if (user.id !== originalMessage.author.id) {
            return interaction.followUp({
              content: `${constants.Emojis.ERROR} Only the command sender can select difficulty!`,
              ephemeral: true
            });
          }
        } catch (error) {
          return interaction.followUp({
            content: `${constants.Emojis.ERROR} Could not verify the original message.`,
            ephemeral: true
          });
        }
        
        await (interaction.message as Message).delete();
        
        const currentState = gameStates.get(message.id);
        if (!currentState) {
          return interaction.followUp({
            content: `${constants.Emojis.ERROR} Game state was lost. Please start a new game.`,
            ephemeral: true
          });
        }
        
        currentState.difficulty = difficulty;
        const gameId = generateGameId();
        
        const gameRows: MessageActionRow[] = [];
        for (let r = 0; r < 3; r++) {
          const row = new MessageActionRow();
          for (let c = 0; c < 3; c++) {
            row.addComponents(
              new MessageButton()
              .setStyle("SECONDARY")
              .setEmoji(constants.Emojis.EMPTY)
              .setCustomId(`ttt::${gameId}::${r}::${c}`)
            );
          }
          gameRows.push(row);
        }
        
        gameStates.set(gameId, {
          ...currentState,
          board: [
            [null, null, null],
            [null, null, null],
            [null, null, null]
          ]
        });
        
        const gameMessage = await interaction.channel!.send({
          embeds: [
            new MessageEmbed()
            .setTitle(`${(interaction.member as GuildMember).nickname ?? interaction.user.username} ${constants.Emojis.VERSUS} AI (${difficulty})`)
            .setThumbnail(`https://cdn.discordapp.com/emojis/${currentState.circleTurn ? constants.Emojis.CIRCLE.replace(/\D/g, '') : constants.Emojis.CROSS.replace(/\D/g, '')}.png`)
            .setDescription(`${constants.Emojis.LOADING} ${currentState.circleTurn ? "AI's turn" : `<@${currentState.playerX}>'s turn`}`)
            .setColor(constants.Colors.MAIN_EMBED_COLOR)
          ],
          components: gameRows
        });
        
        if (currentState.circleTurn) {
          setTimeout(() => makeAIMove(gameMessage), 1000);
        }
        return;
      }
      
      if (customId.startsWith("ttt_challenge_button::")) {
        const { invited, initiator } = JSON.parse(customId.split("::")[1]);
        const invitedPlayer = interaction.guild!.members.cache.get(invited);
        const initiatingPlayer = interaction.guild!.members.cache.get(initiator);
        
        if (!invitedPlayer || !initiatingPlayer) {
          return interaction.reply({
            content: `${constants.Emojis.ERROR} Could not find one or both players.`,
            ephemeral: true
          });
        }
        
        if (user.id !== invitedPlayer.id) {
          return interaction.reply({
            content: user.id === initiatingPlayer.id ?
              `${constants.Emojis.ERROR} Wait, you can't accept your own challenge!` : `${constants.Emojis.ERROR} This challenge is not for you!`,
            ephemeral: true
          });
        }
        
        await interaction.deferUpdate();
        await (interaction.message as Message).delete();
        
        const circleTurn = Math.random() < 0.5;
        const player_x = circleTurn ? initiatingPlayer : invitedPlayer;
        const player_o = circleTurn ? invitedPlayer : initiatingPlayer;
        const gameId = generateGameId();
        
        gameStates.set(gameId, {
          circleTurn,
          playerX: player_x.id,
          playerO: player_o.id,
          board: [
            [null, null, null],
            [null, null, null],
            [null, null, null]
          ],
          createdAt: Date.now()
        });
        
        const rows: MessageActionRow[] = [];
        for (let r = 0; r < 3; r++) {
          const row = new MessageActionRow();
          for (let c = 0; c < 3; c++) {
            row.addComponents(
              new MessageButton()
              .setStyle("SECONDARY")
              .setEmoji(constants.Emojis.EMPTY)
              .setCustomId(`ttt::${gameId}::${r}::${c}`)
            );
          }
          rows.push(row);
        }
        
        await interaction.channel!.send({
          embeds: [
            new MessageEmbed()
            .setTitle(`${initiatingPlayer.nickname ?? initiatingPlayer.user.username} ${constants.Emojis.VERSUS} ${invitedPlayer.nickname ?? invitedPlayer.user.username}`)
            .setThumbnail(`https://cdn.discordapp.com/emojis/${circleTurn ? constants.Emojis.CIRCLE.replace(/\D/g, '') : constants.Emojis.CROSS.replace(/\D/g, '')}.png`)
            .setDescription(`${constants.Emojis.LOADING} <@${circleTurn ? player_o.id : player_x.id}>'s turn`)
            .setColor(constants.Colors.MAIN_EMBED_COLOR)
          ],
          components: rows
        });
        return;
      }
      
      if (customId.startsWith("ttt::")) {
        const cooldownKey = `${interaction.user.id}_game_move`;
        const now = Date.now();
        
        if (cooldowns.has(cooldownKey)) {
          const remainingTime = cooldowns.get(cooldownKey) !+COOLDOWN_TIME - now;
          if (remainingTime > 0) {
            return interaction.reply({
              content: `${constants.Emojis.ERROR} Please wait ${(remainingTime/1000).toFixed(1)} seconds before making another move!`,
              ephemeral: true
            });
          }
        }
        
        cooldowns.set(cooldownKey, now);
        
        const [_, gameId, rowStr, colStr] = customId.split("::");
        const row = parseInt(rowStr) as 0 | 1 | 2;
        const col = parseInt(colStr) as 0 | 1 | 2;
        
        const gameState = gameStates.get(gameId);
        if (!gameState) {
          return interaction.reply({
            content: `${constants.Emojis.ERROR} Game session expired. Please start a new game.`,
            ephemeral: true
          });
        }
        
        const currentTurn = gameState.circleTurn ? Marks.CIRCLE : Marks.CROSS;
        const currentPlayer = currentTurn === Marks.CROSS ? gameState.playerX : gameState.playerO;
        
        if (currentPlayer !== user.id && currentPlayer !== 'AI') {
          return interaction.reply({
            content: `${constants.Emojis.ERROR} Please wait your turn!`,
            ephemeral: true
          });
        }
        
        if (gameState.board[row][col] !== null) {
          return interaction.reply({
            content: `${constants.Emojis.ERROR} This cell is already marked!`,
            ephemeral: true
          });
        }
        
        gameState.board[row][col] = currentTurn;
        gameState.circleTurn = !gameState.circleTurn;
        
        const button = (message.components[row].components[col] as MessageButton)
          .setStyle(currentTurn === Marks.CROSS ? "DANGER" : "PRIMARY")
          .setEmoji(currentTurn === Marks.CROSS ? constants.Emojis.CROSS : constants.Emojis.CIRCLE);
        
        const updatedMsg = await interaction.update({
          embeds: [
            (message.embeds[0] as MessageEmbed)
            .setThumbnail(`https://cdn.discordapp.com/emojis/${gameState.circleTurn ? constants.Emojis.CIRCLE.replace(/\D/g,'') : constants.Emojis.CROSS.replace(/\D/g,'')}.png`)
            .setDescription(`${constants.Emojis.LOADING} ${
                gameState.circleTurn 
                  ? gameState.playerO === 'AI' 
                    ? "AI's turn" 
                    : `<@${gameState.playerO}>'s turn`
                  : `<@${gameState.playerX}>'s turn`
              }`)
            .setColor(constants.Colors.MAIN_EMBED_COLOR)
          ],
          components: message.components.map(row =>
            new MessageActionRow().addComponents(
              ...row.components.map(button => button as MessageButton)
            )
          ),
          fetchReply: true
        }) as Message;
        
        if (checkWin(gameState.board, currentTurn)) {
          await endGame(updatedMsg, gameState, currentTurn);
          gameStates.delete(gameId);
        } else if (checkDraw(gameState.board)) {
          await endGame(updatedMsg, gameState, null, true);
          gameStates.delete(gameId);
        } else if (gameState.playerO === 'AI' && gameState.circleTurn) {
          setTimeout(() => makeAIMove(updatedMsg), 1000);
        }
      }
    }
  }
});

async function makeAIMove(msg: Message): Promise < void > {
  const firstButton = msg.components[0].components[0] as MessageButton;
  const [_, gameId] = firstButton.customId.split("::");
  
  const gameState = gameStates.get(gameId);
  if (!gameState || !gameState.difficulty) return;
  
  const availableMoves: { row: number, col: number } [] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (gameState.board[r][c] === null) {
        availableMoves.push({ row: r, col: c });
      }
    }
  }
  
  if (availableMoves.length === 0) return;
  
  let move: { row: number, col: number };
  const aiMark = Marks.CIRCLE;
  const opponentMark = Marks.CROSS;
  
  switch (gameState.difficulty) {
    case 'easy':
      move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      break;
    case 'normal':
      if (Math.random() < 0.5) {
        move = getSmartMove(gameState.board, aiMark, opponentMark, availableMoves);
      } else {
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
      break;
    case 'hard':
      move = getSmartMove(gameState.board, aiMark, opponentMark, availableMoves);
      break;
  }
  
  gameState.board[move.row][move.col] = aiMark;
  gameState.circleTurn = false;
  
  const button = (msg.components[move.row].components[move.col] as MessageButton)
    .setStyle("PRIMARY")
    .setEmoji(constants.Emojis.CIRCLE);
  
  const updatedMsg = await msg.edit({
    embeds: [
      (msg.embeds[0] as MessageEmbed)
      .setThumbnail(`https://cdn.discordapp.com/emojis/${constants.Emojis.CROSS.replace(/\D/g, '')}.png`)
      .setDescription(`${constants.Emojis.LOADING} <@${gameState.playerX}>'s turn`)
      .setColor(constants.Colors.MAIN_EMBED_COLOR)
    ],
    components: msg.components.map(row =>
      new MessageActionRow().addComponents(
        ...row.components.map(button => button as MessageButton)
      )
    )
  });
  
  if (checkWin(gameState.board, aiMark)) {
    await endGame(updatedMsg, gameState, aiMark);
    gameStates.delete(gameId);
  } else if (checkDraw(gameState.board)) {
    await endGame(updatedMsg, gameState, null, true);
    gameStates.delete(gameId);
  }
}

function getSmartMove(
  board: (Marks | null)[][],
  aiMark: Marks,
  opponentMark: Marks,
  availableMoves: { row: number, col: number } []
): { row: number, col: number } {
  for (const move of availableMoves) {
    const testBoard = JSON.parse(JSON.stringify(board));
    testBoard[move.row][move.col] = aiMark;
    if (checkWin(testBoard, aiMark)) {
      return move;
    }
  }
  
  for (const move of availableMoves) {
    const testBoard = JSON.parse(JSON.stringify(board));
    testBoard[move.row][move.col] = opponentMark;
    if (checkWin(testBoard, opponentMark)) {
      return move;
    }
  }
  
  const center = { row: 1, col: 1 };
  if (availableMoves.some(m => m.row === center.row && m.col === center.col)) {
    return center;
  }
  
  const corners = [
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 }
  ];
  const availableCorners = corners.filter(corner =>
    availableMoves.some(m => m.row === corner.row && m.col === corner.col)
  );
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function checkWin(board: (Marks | null)[][], mark: Marks): boolean {
  const winConditions = [
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]]
  ];
  
  return winConditions.some(condition =>
    condition.every(([r, c]) => board[r][c] === mark)
  );
}

function checkDraw(board: (Marks | null)[][]): boolean {
  return board.flat().every(cell => cell !== null);
}

async function endGame(
  msg: Message,
  gameState: GameState,
  winningMark: Marks | null,
  isDraw = false
): Promise < void > {
  const disabledComponents = msg.components.map(row => {
    const newRow = new MessageActionRow();
    newRow.addComponents(
      ...row.components.map(button =>
        (button as MessageButton).setDisabled(true)
      )
    );
    return newRow;
  });
  
  if (isDraw) {
    await msg.edit({
      embeds: [
        (msg.embeds[0] as MessageEmbed)
        .setThumbnail(`https://cdn.discordapp.com/emojis/${constants.Emojis.EMPTY.replace(/\D/g,'')}.png`)
        .setDescription(`${constants.Emojis.INFO} No one won the game, it's a tie! Let's try again?`)
        .setColor("#79b2ff")
      ],
      components: disabledComponents
    });
  } else if (winningMark) {
    const winner = winningMark === Marks.CROSS ? gameState.playerX : gameState.playerO;
    await msg.edit({
      embeds: [
        (msg.embeds[0] as MessageEmbed)
        .setThumbnail(`https://cdn.discordapp.com/emojis/${constants.Emojis.EMPTY.replace(/\D/g,'')}.png`)
        .setDescription(`${constants.Emojis.TADA} ${
              winner === 'AI' ? 'The AI has won the game!' : `<@${winner}> has won the game!`
            }`)
        .setColor("#00ffff")
      ],
      components: disabledComponents
    });
  }
}