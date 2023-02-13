import { Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { logger } from "../helpers/logging";
import { SlashCommand } from "../types";

module.exports = async (client : Client) => {
    let commands : SlashCommandBuilder[] = [];
    let commandsDir: string = join(__dirname,"../commands")

    readdirSync(commandsDir).forEach(dir => {
        let directory: string = join(__dirname,`../commands/${dir}`);

        readdirSync(directory).forEach(async (file) => {
            if(!file.endsWith("js")) return;
            let command : SlashCommand = require(`${directory}/${file}`).default;

            commands.push(command.command);
            client.slashCommands.set(command.command.name, command);
        })
    })

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands.map(command => command.toJSON())
    })
    .then((data : any) => {
       logger.startup(`Successfully loaded ${data.length} command(s)!`);
    }).catch(e => {
        logger.error(e)
    })
}