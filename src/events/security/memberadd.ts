import { ActivityType, Client, Embed, EmbedBuilder, GuildMember } from "discord.js";
import { logger } from "../../helpers/logging";
import { BotEvent } from "../../types";

const event: BotEvent = {
    name: "guildMemberAdd",
    execute : async (member: GuildMember, client: Client) => {
        // Check account age;

        if(Date.now() - member.user.createdTimestamp < 1000*60*60*24*14 ) {
            if(!member.kickable) return logger.error('owo I cant kick them :(')
            return member.kick("automod | account age below 14 days")
        }

        // No profile picture
        if(!member.avatarURL) {
            if(!member.kickable) return logger.error('owo I cant kick them :(')
            return member.kick("automod | no profile picture set")
        }

        return;
    }
}

export default event;
