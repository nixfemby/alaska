import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../../types";

const event: BotEvent = {
    name: "ready",
    once: true,
    execute : (client: Client) => {
        console.log("Logged in!");
        client.user?.setPresence({
            activities: [
                {
                    name: `to ${process.env.PREFIX}help`,
                    type: ActivityType.Listening
                }
            ],
            status: "dnd"
        })
    }
}

export default event;