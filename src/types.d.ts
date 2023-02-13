import { ChatInputCommandInteraction, Client, Collection, ModalSubmitInteraction, SlashCommandBuilder } from "discord.js";

export interface SlashCommand {
    command: SlashCommandBuilder | any,
    execute: (interaction: ChatInputCommandInteraction, client: Client) => void,
    cooldown?: number // in seconds
} 

export interface BotEvent {
    name: string,
    once?: boolean | false,
    rest?: boolean | false,
    execute: (...args?) => void,
}

export interface Modal {
    id: string,
    execute: (Interaction: ModalSubmitInteraction, client: Client) => void,
    cooldown?: number,
}

export interface Button {
    id: string,
    execute: (Interaction: ButtonInteraction, client: Client) => void,
    cooldown?: number
}

// --- System
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string,
            CLIENT_ID: string,
            DATABASE_URL: string,
        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>,
        cooldowns: Collection<string, number>,
        modals: Collection<string, Modal>,
        buttons: Collection<string, Button>
    }
}