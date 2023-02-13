import { Client } from "discord.js";
import { readdir, readdirSync } from "fs";
import { join } from "path";
import { logger } from "../helpers/logging";
import { Modal } from "../types";

module.exports = (client: Client) => {
    let modalsDir: string = join(__dirname, "../modals");

    readdirSync(modalsDir).forEach(dir => {
        let directory: string = join(__dirname, `../modals/${dir}`);

        readdirSync(directory).forEach(file => {
            if(!file.endsWith("js")) return;
            let modal: Modal = require(`${directory}/${file}`);

            client.modals.set(modal.id, modal);
        })
    })

    logger.startup(`Successfully loaded ${client.modals.size} Modal(s)!`);
}