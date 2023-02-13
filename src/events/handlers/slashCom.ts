import { BotEvent } from "../../types";
import { Interaction, Client } from "discord.js";

const event: BotEvent = {
    name: "interactionCreate",
    execute: (interaction: Interaction, client: Client) => {
        if(!interaction.isChatInputCommand()) return;

        let command = interaction.client.slashCommands.get(interaction.commandName);
        let cooldown = interaction.client.cooldowns.get(`${interaction.commandName}-${interaction.user.username}`);
        if(!command) return interaction.reply({ content: "This command is outdated!" });
        if(command.cooldown && cooldown) {
            if(Date.now() < cooldown) {
                interaction.reply({ content: `You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again!` });
                setTimeout(() => {
                    interaction.deleteReply()
                }, 5000);
            }
            interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000);
            setTimeout(() => {
                interaction.client.cooldowns.delete(`${interaction.commandName}-${interaction.user.username}`);
            })
        } else if (command.cooldown && !cooldown) {
            interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 10000);
        }
        command.execute(interaction, client);
    }
}

export default event;