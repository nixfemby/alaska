import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } from "discord.js"
import { prisma } from "../../helpers/DB";
import { SlashCommand } from "../../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("imblock")
    .setDescription("Block someone from creating invites")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(meow => meow.setName("user").setDescription("the user to block").setRequired(true))
    .addStringOption(meow => meow.setName("reason").setDescription("block reason - defaults to empty").setRequired(false))
    ,
    execute: async (interaction, client) => {
        if(!interaction.guild) return interaction.reply({ content: "Sowwy, this can only be used in a server", ephemeral: true})
        let member = await interaction.options.getUser("user", true);
        let reason = await interaction.options.getString("reason") || "meow <3"

        let invite = await prisma.invites.findUnique({
            where: {
                authorID: member.id
            }
        });

        if(invite) {
            let invites = await interaction.guild.invites.delete(invite.code, "user has been blocked from creating invites");
            await prisma.invites.delete({
                where: {
                    code: invite.code
                }
            });
        }

        let exists = await prisma.inviteBans.findUnique({
            where: {
                userID: member.id
            }
        })

        if(exists) return interaction.reply({ content: "awww thank you but this user is already blocked <3", ephemeral: true});
        let newBan = await prisma.inviteBans.create({
            data: {
                modID: interaction.user.id,
                userID: member.id,
                reason: reason
            }
        });

        let logChan = await client.channels.fetch("1061063760485298176");
        if(!logChan || logChan.type !== ChannelType.GuildText) return interaction.reply({ content: "User has been blocked, failed creating log entry.", ephemeral: true});

        logChan.send({ embeds: [new EmbedBuilder().setTitle("User blocked successfully!").setDescription(`User: <@${member.id}>\nReason: ${reason}\n\nThey are no longer able to create invites!`).setColor("#ff9fbc")] });
        interaction.reply({ content: "User has been blocked and a log entry was created <3", ephemeral: true})
    },
    cooldown: 1
}

export default command