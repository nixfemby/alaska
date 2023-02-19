import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, Embed } from "discord.js"
import { prisma } from "../../helpers/DB";
import { SlashCommand } from "../../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("imdelete")
    .setDescription("Delete someones invite")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(meow => meow.setName("user").setDescription("the user to unblock").setRequired(true))
    .addStringOption(meow => meow.setName("reason").setDescription("block reason - defaults to empty").setRequired(false))
    ,
    execute: async (interaction, client) => {
        if(!interaction.guild) return interaction.reply({ content: "Sowwy, this can only be used in a server", ephemeral: true})
        let member = await interaction.options.getUser("user", true);
        let reason = await interaction.options.getString("reason") || "meow <3"

        let exists = await prisma.invites.findUnique({
            where: {
                authorID: member.id
            }
        })

        if(!exists) return interaction.reply({ content: "This user hasnt created any invites", ephemeral: true});

        let invite = await interaction.guild.invites.fetch(exists.code);
        if(!invite) return interaction.reply({ content: "Something weird happened, sowwy", ephemeral: true})
        await invite.delete();
        await prisma.invites.delete({
            where: {
                authorID: member.id
            }
        });
        
        let logChan = await client.channels.fetch("1061063760485298176");
        if(!logChan || logChan.type !== ChannelType.GuildText) return interaction.reply({ content: "Invite deleted, failed creating log entry.", ephemeral: true});

        logChan.send({ embeds: [new EmbedBuilder().setTitle("Invite deleted successfully!").setDescription(`User: <@${member.id}>\nReason: ${reason}\n\nTheir active invite has been revoked`).setColor("#ff9fbc")] });

        return interaction.reply({ content: "Deleted invite, created log entry", ephemeral: true });
        
    },
    cooldown: 1
}

export default command