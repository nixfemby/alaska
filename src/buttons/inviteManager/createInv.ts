import { ChannelType } from "discord.js";
import { prisma } from "../../helpers/DB";
import { Button } from "../../types";

const button: Button = {
    id: "create-invite",
    execute: async (interaction, client) => {
        if(!interaction.guild) return interaction.reply({ content: "wtf how", ephemeral: true });
        let rulesChan = await client.channels.fetch("1060971130497794068");
        if(!rulesChan || rulesChan.type !== ChannelType.GuildText) return;
        let logChan = await client.channels.fetch("1061063760485298176");
        if(!logChan || logChan.type !== ChannelType.GuildText) return interaction.reply({ content: "You're banned from creating invites!", ephemeral: true});

        let banned = await prisma.inviteBans.findUnique({
            where: {
                userID: interaction.user.id
            }
        });

        if(banned) {
            logChan.send(`Banned user ${interaction.user.username} tried creating an invite`);

            return interaction.reply({ content: "You're banned from creating invites!", ephemeral: true});
        }

        let exists = await prisma.invites.findUnique({
            where: {
                authorID: interaction.user.id
            }
        });

        if(exists) return interaction.reply({ content: `You already have an invite, https://discord.gg/${exists.code}`, ephemeral: true});

        let invite = await interaction.guild.invites.create(rulesChan, {maxAge: 0, unique: true, reason: `requested by ${interaction.user.id}`})

        let data = await prisma.invites.create({
            data: {
                authorID: interaction.user.id,
                authorName: interaction.user.username,
                code: invite.code
            }
        });

        logChan.send({ content: `User ${interaction.user.username} created an invite: ${data.code}`});
        return interaction.reply({ content: `Your invite has been created, it's code is: ${data.code} \n https://discord.gg/${data.code}`, ephemeral: true});
    }
}

export default button;