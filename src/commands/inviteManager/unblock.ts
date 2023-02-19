import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } from "discord.js"
import { prisma } from "../../helpers/DB";
import { SlashCommand } from "../../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("imunblock")
    .setDescription("Unblock someone from creating invites")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(meow => meow.setName("user").setDescription("the user to unblock").setRequired(true))
    .addStringOption(meow => meow.setName("reason").setDescription("unblock reason - defaults to empty").setRequired(false))
    ,
    execute: async (interaction, client) => {
        if(!interaction.guild) return interaction.reply({ content: "Sowwy, this can only be used in a server", ephemeral: true})
        let member = await interaction.options.getUser("user", true);
        let reason = await interaction.options.getString("reason") || "meow <3"

        let exists = await prisma.inviteBans.findUnique({
            where: {
                userID: member.id
            }
        })

        if(!exists) return interaction.reply({ content: "awww thank you but this user isn't already blocked <3", ephemeral: true});
        let newBan = await prisma.inviteBans.delete({
            where: {
                userID: member.id
            }
        });

        let logChan = await client.channels.fetch("1061063760485298176");
        if(!logChan || logChan.type !== ChannelType.GuildText) return interaction.reply({ content: "User has been unblocked, failed creating log entry.", ephemeral: true});

        logChan.send({ embeds: [new EmbedBuilder().setTitle("User unblocked successfully!").setDescription(`User: <@${member.id}>\nReason: ${reason}\n\nThey can now create invites`).setColor("#ff9fbc")] });
        interaction.reply({ content: "User has been unblocked and a log entry was created <3", ephemeral: true})
    },
    cooldown: 1
}

export default command