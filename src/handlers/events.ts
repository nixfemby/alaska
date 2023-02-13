import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { logger } from "../helpers/logging";
import { BotEvent } from "../types";

module.exports = (client: Client) => {
    let eventsDir = join(__dirname, "../events")
    let eventNames: String[] = [];

    readdirSync(eventsDir).forEach(dir => {
        let directory = join(__dirname, `../events/${dir}`);

        readdirSync(directory).forEach(file => {
            if (!file.endsWith("js")) return;
            let event: BotEvent = require(`${directory}/${file}`).default
            eventNames.push(event.name);

            event.rest ?
                event.once ?
                    client.rest.once(event.name, (...args) => event.execute(...args, client))
                    :
                    client.rest.on(event.name, (...args) => event.execute(...args, client))
                :
                event.once ?
                    client.once(event.name, (...args) => event.execute(...args, client))
                    :
                    client.on(event.name, (...args) => event.execute(...args, client))

        })
    })

    logger.startup(`Successfully loaded ${eventNames.length} events!`);
}