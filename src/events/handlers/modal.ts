import { Client, Interaction } from "discord.js";
import { BotEvent } from "../../types";

const event : BotEvent = {
    name: "interactionCreate",
    execute: (interaction: Interaction, client: Client) => {
        if (!interaction.isModalSubmit()) return;
        let modal = interaction.client.modals.get(interaction.customId)
        let cooldown = interaction.client.cooldowns.get(`modal-${interaction.id}-${interaction.user.username}`)
        if (!modal) return;
        if (modal.cooldown && cooldown) {
            if (Date.now() < cooldown) {
                interaction.reply(`You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this modal again.`)
                setTimeout(() => interaction.deleteReply(), 5000)
                return
            }
            interaction.client.cooldowns.set(`modal-${interaction.id}-${interaction.user.username}`, Date.now() + modal.cooldown * 1000)
            setTimeout(() => {
                interaction.client.cooldowns.delete(`modal-${interaction.id}-${interaction.user.username}`)
            }, modal.cooldown * 1000)
        } else if (modal.cooldown && !cooldown) {
            interaction.client.cooldowns.set(`modal-${interaction.id}-${interaction.user.username}`, Date.now() + modal.cooldown * 1000)
        } 
        modal.execute(interaction, client)
    }
}

export default event;