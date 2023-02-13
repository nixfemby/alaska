import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("")
    .setDescription("")
    ,
    execute: (interaction, client) => {

    },
    cooldown: 1
}

export default command