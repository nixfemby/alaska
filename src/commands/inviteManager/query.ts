import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, Embed } from "discord.js"
import { prisma } from "../../helpers/DB";
import { SlashCommand } from "../../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("imquery")
    .setDescription("Check someones invite")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(meow => meow.setName("user").setDescription("the user to unblock").setRequired(true))
    ,
    execute: async (interaction, client) => {
        if(!interaction.guild) return interaction.reply({ content: "Sowwy, this can only be used in a server", ephemeral: true})
        let member = await interaction.options.getUser("user", true);

        let exists = await prisma.invites.findUnique({
            where: {
                authorID: member.id
            }
        })

        if(!exists) return interaction.reply({ content: "This user hasnt created any invites", ephemeral: true});

        let invite = await interaction.guild.invites.fetch(exists.code);
        if(!invite) return interaction.reply({ content: "Something weird happened, sowwy", ephemeral: true})
        return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`${member.username}'s Invite`).setDescription(`Created: ${member}\nUses: ${invite.uses}`).setColor("#ff9fbc")] });
    },
    cooldown: 1
}

export default command