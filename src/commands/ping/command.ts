import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot's ping")
    ,
    execute: (interaction, client) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setAuthor({name: "Ping"})
                .setDescription(`🏓 Pong! \n 📡 Ping: ${interaction.client.ws.ping} for ${client.user?.username}`)
                .setColor("#2F3136")
            ]
        })
    },
    cooldown: 10
}

export default command