import { Signale } from "signale-logger";

const figureSet = require('figures')

const logger = new Signale({
    disabled: false,
    interactive: false,
    logLevel: "info",
    scope: 'Name', // Bot / Project Name
    secrets: [],
    stream: process.stdout,
    types: {
        success: {
            badge: figureSet.heart,
            color: 'green',
            label: 'success',
            logLevel: 'info'
        },
        error: {
            badge: figureSet.cross,
            color: 'red',
            label: 'error',
            logLevel: 'error'
        },
        api: {
            badge: figureSet.star,
            color: 'magenta',
            label: 'api',
            logLevel: 'info'
        },
        startup: {
            badge: figureSet.pointer,
            color: 'cyan',
            label: 'startup',
            logLevel: 'info'
        },
        database: {
            badge: figureSet.squareSmall,
            color: "yellow",
            label: "database",
            logLevel: 'info'
        }
    }
});

export { logger }