import { ActivityType, Client, Embed, EmbedBuilder, GuildMember } from "discord.js";
import { logger } from "../../helpers/logging";
import { BotEvent } from "../../types";

const event: BotEvent = {
    name: "guildMemberAdd",
    execute : async (member: GuildMember, client: Client) => {
        // Check account age;

        if(Date.now() - member.user.createdTimestamp < 1000*60*60*24*14 ) {
            if(!member.kickable) return logger.error('owo I cant kick them :(')
            try {
                member.send({ embeds: [new EmbedBuilder().setTitle(`You've been kicked from ${member.guild.name}`).setDescription("Reason: `account age below 14 days`").setColor("#ff9fbc").setTimestamp(Date.now())]})
            } catch(e) {
                logger.error("Couldnt dm them :(")
                member.kick("automod | account age below 14 days")
            }
        }

        // No profile picture
        if(!member.avatarURL) {
            if(!member.kickable) return logger.error('owo I cant kick them :(')
            try {
                member.send({ embeds: [new EmbedBuilder().setTitle(`You've been kicked from ${member.guild.name}`).setDescription("Reason: `no profile picture set`").setColor("#ff9fbc").setTimestamp(Date.now())]})
            } catch(e) {
                logger.error("Couldnt dm them :(")
                member.kick("automod | no profile picture set")
            }
        }
    }
}

export default event;
