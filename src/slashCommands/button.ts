import { ElainaSlashCommand, ElainaWebhook, ElainaErrorMessage, constants } from "../index";
import { GuildTextBasedChannel, Role, MessageActionRow, MessageButton, MessageButtonStyleResolvable, Interaction, GuildMember, Snowflake } from "discord.js";

const changes: { roleId: Snowflake, type: "add" | "remove" }[] = [];

export default new ElainaSlashCommand({
  name: "button",
  description: "Useful commands for configuring a message button.",
  options: [
    {
      type: "SUB_COMMAND",
      name: "role",
      description: "Adds a buttonrole to a message.",
      options: [
        {
          type: "ROLE",
          name: "role",
          description: "The role that you want the buttonrole to work with.",
          required: true
        },
        {
          type: "NUMBER",
          name: "type",
          description: "Type of the buttonrole (select from above).",
          required: true,
          choices: [
            {
              name: "Toggle - gives the role when you press it and removes when you press it again.",
              value: 1
            },
            {
              name: "Add - roles can only be picked up, not removed.",
              value: 2
            },
            {
              name: "Remove - roles can only be removed, not picked up.",
              value: 3
            }
          ]
        },
        {
          type: "STRING",
          name: "message_url",
          description: "The URL of the message you want to add the buttonrole to.",
          required: true
        },
        {
          type: "STRING",
          name: "color",
          description: "Color of the button.",
          choices: [
            {
              name: "Red",
              value: "DANGER"
            },
            {
              name: "Green",
              value: "SUCCESS"
            },
            {
              name: "Blurple",
              value: "PRIMARY"
            },
            {
              name: "Grey",
              value: "SECONDARY"
            }
          ]
        },
        {
          type: "STRING",
          name: "label",
          description: "The text displayed on the button."
        },
        {
          type: "STRING",
          name: "emoji",
          description: "The emoji displayed on the button."
        },
        {
          type: "ROLE",
          name: "role_2",
          description: 'Another "role".',
        },
        {
          type: "ROLE",
          name: "role_3",
          description: 'Another "role".',
        },
        {
          type: "ROLE",
          name: "role_4",
          description: 'Another "role".',
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "custom_function",
      description: "Adds a button to a message that will run a custom function.",
      options: [
        {
          type: "STRING",
          name: "custom_id",
          description: "A unique string to be sent in the interaction when clicked.",
          maxLength: 100,
          required: true
        },
        {
          type: "STRING",
          name: "message_url",
          description: "The URL of the message you want to add the buttonrole to.",
          required: true
        },
        {
          type: "STRING",
          name: "color",
          description: "Color of the button.",
          choices: [
            {
              name: "Red",
              value: "DANGER"
            },
            {
              name: "Green",
              value: "SUCCESS"
            },
            {
              name: "Blurple",
              value: "PRIMARY"
            },
            {
              name: "Grey",
              value: "SECONDARY"
            }
          ]
        },
        {
          type: "STRING",
          name: "label",
          description: "The text displayed on the button."
        },
        {
          type: "STRING",
          name: "emoji",
          description: "The emoji displayed on the button."
        }
      ]
    }
  ],
  
  category: "Server settings",
  
  run: async (client, interaction) => {
    await interaction.reply({ content: `${constants.Emojis.LOADING} Processing...`, ephemeral: true });

    const { options } = interaction;
    
    let messageURL = options.getString("message_url").split("/");

    messageURL = messageURL.slice(messageURL.length - 3);

    const targetChannel = interaction.guild.channels.cache.get(messageURL[1]) as GuildTextBasedChannel;

    const targetMessage = await targetChannel?.messages.fetch(messageURL[2]);

    const rolesForButtonRole: Role[] = [];
    
    ["role", "role_2", "role_3", "role_4"]
      .forEach(str => {
        if (options.getRole(str))
          rolesForButtonRole.push(options.getRole(str) as Role);
      });
    
    const getInvalidInputErrorMessage = (): string | boolean => {
      const botsHighestRole = interaction.guild.me.roles.highest;
      
      switch (true) {
        case !targetMessage:
          return "Invalid message!";
          
        case (targetMessage.applicationId || targetMessage.author.id) !== client.user.id:
          return `Provide a message or webhook that was sent by <@${client.user.id}>.`;
          
        case rolesForButtonRole.filter(role => role.managed).length !== 0:
          return `The role <@&${rolesForButtonRole.find(role => role.managed)?.id}> is managed. I can't assign a managed role to a member.`;
          
        case rolesForButtonRole.filter(role => botsHighestRole.rawPosition < role.rawPosition).length !== 0:
          return `The role <@&${rolesForButtonRole.find(role => botsHighestRole.rawPosition < role.rawPosition)?.id}> is above my highest role <@&${botsHighestRole.id}>, which I can't manage.`;
     
        case rolesForButtonRole.filter(role => botsHighestRole.rawPosition === role.rawPosition).length !== 0:
          return `The role <@&${rolesForButtonRole.find(role => botsHighestRole.rawPosition === role.rawPosition).id}> is my highest role, which I can't manage.`;
     
        default: 
          return false;
      }
    }
  
    if (getInvalidInputErrorMessage()) {
      interaction.editReply(new ElainaErrorMessage("Error!"));
  
      await interaction.followUp({
        content: getInvalidInputErrorMessage() as string,
        ephemeral: true
      });

      return;
    }
    
    const buttonToAdd = new MessageButton()
      .setStyle((options.getString("color") ?? "PRIMARY") as MessageButtonStyleResolvable)
      .setLabel(
        options.getString("label") ??
        (
          !rolesForButtonRole.length ?
          "Button" :
          `Click to ${String(options.getNumber("type")).replace("1", "toggle").replace("2", "add").replace("3", "remove")} ${rolesForButtonRole.length} role(s)`
        )
      )
      .setEmoji(options.getString("emoji") ?? '');
    
    if (
      !targetMessage.components.length ||
      targetMessage.components[targetMessage.components.length - 1].components.length === 5
    ) {
      targetMessage.components.push(new MessageActionRow());
    }
      
    const rowForButton = targetMessage.components[targetMessage.components.length - 1] as MessageActionRow;
    
    if (options.getSubcommand() === "role")
      buttonToAdd.setCustomId(`e/br:${options.getNumber("type")}:${rolesForButtonRole.map(role => role.id).join(":")}`);

    if (options.getSubcommand() === "custom_function")
      buttonToAdd.setCustomId(options.getString("custom_id"));
      
    rowForButton.components.push(buttonToAdd);
    
    const messageToEdit = (
      targetMessage.webhookId ?
      new ElainaWebhook({ messageUrl: options.getString("message_url") }) :
      targetMessage
    );
    
    messageToEdit.edit({ components: [...targetMessage.components] })
      .then(() => {
        interaction.editReply(`${constants.Emojis.SUCCESS} Success!`);
        
        interaction.followUp({
          content: `Successfully added the "${options.getSubcommand()}" button to the provided message.`,
          ephemeral: true
        });
      })
      .catch(error => {
        interaction.editReply(new ElainaErrorMessage("Error!"));
        
        interaction.followUp({
          content: `Failed to add the "${options.getSubcommand()}" button to the provided message.\n\nError name:\n\`\`\`\n${error.name}\`\`\`\nError message:\n\`\`\`\n${error.message}\`\`\``,
          ephemeral: true
        });
      });
  },

  eventListener: {
    event: "interactionCreate",
    run: async (interaction: Interaction) => {
      if (!interaction.isButton()) return;

      const customId = interaction.customId;
      const member = interaction.member as GuildMember;
      
      if (customId.startsWith("e/br:")) {
        let type = customId.split(":")[1];
        let roleIds = customId.split(":").slice(2) as Snowflake[];
        
        roleIds.forEach(roleId => {
          switch (Number(type)) {
            case 1: //toggle
              if (member.roles.cache.has(roleId)) {
                member.roles.remove(roleId)
                  .then(() => changes.push({ roleId, type: "remove" }));
              }
              else {
                member.roles.add(roleId)
                  .then(() => changes.push({ roleId, type: "add" }));
              }1
              break;
            
            case 2: //add
              if (!member.roles.cache.has(roleId)) {
                member.roles.add(roleId)
                  .then(() => changes.push({ roleId, type: "add" }));
              }
              break;
            
            case 3: //remove
              if (member.roles.cache.has(roleId)) {
                member.roles.remove(roleId)
                  .then(() => changes.push({ roleId, type: "add" }));
              }
          }
        });
      
        await interaction.reply({
          content: (
            !changes.length ?
            "No role changes were made." :
            `I've updated your roles!\n>>> ${changes.map(ele => `${constants.Emojis[ele.type.replace("add", "PLUS").replace("remove", "MINUS")]} <@&${ele.roleId}>`).join("\n")}`
          ),
          ephemeral: true
        });
      }
    }
  }
});
