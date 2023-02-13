import { Client, Interaction } from "discord.js";
import { BotEvent } from "../../types";

const event : BotEvent = {
    name: "interactionCreate",
    execute: (interaction: Interaction, client: Client) => {
        if (!interaction.isButton()) return;
        let button = interaction.client.buttons.get(interaction.customId)
        let cooldown = interaction.client.cooldowns.get(`button-${interaction.id}-${interaction.user.username}`)
        if (!button) return;
        if (button.cooldown && cooldown) {
            if (Date.now() < cooldown) {
                interaction.reply(`You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`)
                setTimeout(() => interaction.deleteReply(), 5000)
                return
            }
            interaction.client.cooldowns.set(`button-${interaction.id}-${interaction.user.username}`, Date.now() + button.cooldown * 1000)
            setTimeout(() => {
                interaction.client.cooldowns.delete(`button-${interaction.id}-${interaction.user.username}`)
            }, button.cooldown * 1000)
        } else if (button.cooldown && !cooldown) {
            interaction.client.cooldowns.set(`button-${interaction.id}-${interaction.user.username}`, Date.now() + button.cooldown * 1000)
        } 
        button.execute(interaction, client)
    }
}

export default event;