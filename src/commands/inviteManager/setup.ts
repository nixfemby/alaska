import { Channel } from "diagnostics_channel";
import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, TextChannel, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder, embedLength } from "discord.js"
import { logger } from "../../helpers/logging";
import { Button, SlashCommand } from "../../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("setupim")
    .setDescription("Setup the invite manager and send the initial button")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(meow => meow.setName('channel').setDescription('Channel to send the embed to').setRequired(true))
    ,
    execute: async (interaction, client) => {
        if(!interaction.guild) return interaction.reply({ content: "OwO this is a server only command, silly~", ephemeral: true});

        let chan = interaction.options.getChannel('channel', true);
        if(chan.type !== ChannelType.GuildText) return interaction.reply({ content: "OwO oopsie please use a valid text channel :3", ephemeral: true});

        let meowmbed = new EmbedBuilder().setTitle("Create Invite Link").setDescription("ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ\nDue to raid and safety concerns creating invites directly has been disabled. If you do however need an invite, click the button below to create one instead <3\nㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ").setFooter({ text: "Clicking below will create a permanent invite tied to your User ID"}).setColor("#ff9fbc");
        let meowbutton = new ButtonBuilder().setCustomId('create-invite').setLabel('Create Link').setStyle(ButtonStyle.Success);
        let meowrow = new ActionRowBuilder<ButtonBuilder>().addComponents(meowbutton);

        let meowchan = await interaction.guild.channels.fetch(chan.id);
        if(!meowchan) return interaction.reply({ content: "OwO this channel doesn't exist, you sure I can view it? :3", ephemeral: true});

        if(meowchan.type !== ChannelType.GuildText) return interaction.reply({ content: "OwO this isn't a text channel, silly~", ephemeral: true});

        try {
            meowchan.send({ embeds: [meowmbed], components: [meowrow]});
            return interaction.reply({ content: "Message has been sent!", ephemeral: true });
        } catch(e) {
            logger.error(e);
            return interaction.reply({ content: "The message was unable to send, please check my perms hun~", ephemeral: true});
        }
    },
    cooldown: 1
}

export default command