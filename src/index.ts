import { Client, Collection, PermissionFlagsBits } from "discord.js"
import { Button, Modal, SlashCommand } from "./types"
import { config } from "dotenv"
import { readdirSync } from "fs";
import { join } from "path";
config();

const client = new Client({ intents: 3276799 });

client.slashCommands = new Collection<string, SlashCommand>()
client.cooldowns = new Collection<string, number>();
client.modals = new Collection<string, Modal>();
client.buttons = new Collection<string, Button>();

const handlersDir = join(__dirname,"./handlers");
readdirSync(handlersDir).forEach(handler => {
    require(`${handlersDir}/${handler}`)(client);
})

client.login(process.env.TOKEN);