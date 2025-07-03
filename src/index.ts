import client from 'mineflayer';
require('dotenv').config();

const host: string = process.env.MINECRAFT_HOST || 'localhost';
const username: string = process.env.MINECRAFT_USERNAME || 'TestBot';
const password: string = process.env.MINECRAFT_PASSWORD || 'TestPassword1234';
const startupCommands: string[] | null = process.env.STARTUP_COMMANDS?.split(":|:") || null;
const recurringCommands: string[] | null = process.env.RECURRING_COMMANDS?.split(":|:") || null;
const delay: number = parseInt(process.env.RECURRING_COMMANDS_DELAY || '1000', 10);
const interval: number = parseInt(process.env.RECURRING_COMMANDS_INTERVAL || '10000', 10);
const rejoinDelay: number | null = process.env.REJOIN_DELAY ? parseInt(process.env.REJOIN_DELAY, 10) : null;

let viewerRunning = false;
let commandInterval: NodeJS.Timeout | null = null;

const botOptions: client.BotOptions = {
    host,
    username,
    auth: 'offline',
    hideErrors: true,
}
let bot: client.Bot;

async function loggedIn() {
    console.log("Login successful!");
    if (startupCommands && startupCommands.length > 0) {
        console.log("Executing startup commands...");
        for (const command of startupCommands) {
            console.log(`Executing command: ${command}`);
            bot.chat(command);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    if (recurringCommands && recurringCommands.length > 0) {
        if (commandInterval) {
            clearInterval(commandInterval);
        }
        commandInterval = setInterval(async () => {
            console.log("Executing recurring commands...");
            for (const command of recurringCommands) {
                console.log(`Executing command: ${command}`);
                bot.chat(command);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }, interval+(delay * (recurringCommands.length - 1)));
    } else {
        console.log("No recurring commands set.");
    }
}

function startBot() {
    bot = client.createBot(botOptions)

    bot.on("inject_allowed", () => {
        console.log("Bot is ready to inject!");
        console.log(bot._client.uuid);
    });

    bot.on("resourcePack", (url, hash) => {
        console.log("Resource pack URL:", url);
        console.log("Resource pack hash:", hash);
        bot.acceptResourcePack();
    });

    bot.on("death", () => {
        console.log("Bot has died.");
        bot.respawn();
    });

    bot.on("error", (err) => {
        console.error("Error:", err);
        bot.end();
    });
    
    bot.on("kicked", (reason) => {
        if (commandInterval) {
            clearInterval(commandInterval);
            commandInterval = null;
        }
        console.error("Kicked:", reason);
        bot.end();
    });

    bot.on("end", () => {
        console.log("Bot has ended. Attempting to reconnect...");
        if (rejoinDelay !== null) {
            console.log(`Rejoining in ${rejoinDelay} milliseconds...`);
            setTimeout(() => {
                console.log("Rejoining the server...");
                startBot();
            }, rejoinDelay);
        } else {
            console.log("Rejoin delay is not set, not attempting to reconnect.");
        }
    });

    bot.on("chat", (username, message) => {
        // if (username === bot.username) return; // Ignore messages from the bot itself
        console.log(`${username}: ${message}`);
    });
    bot.on("message", (message, position) => {
        if (position == "game_info") return; // Ignore game info messages
        console.log(`Message from ${position} at ${Date.now().toString()}:`, message.toAnsi());
        if (message.toString().includes("Please, login with the command: /login <password>")) {
            console.log("Login message detected. Attempting to log in...");
            bot.chat("/login " + password);
        } else if (message.toString().includes("Successful login!")) {
            loggedIn();
        } else if (message.toString().includes("Please, register to the server with the command: /register <password> <ConfirmPassword>")) {
            console.log("Registration message detected. Attempting to register...");
            bot.chat("/register " + password + " " + password);
        } else if (message.toString().includes("Successfully registered!")) {
            console.log("Registration successful!");
        }
    })

    bot.on("spawn", async () => {
        console.log("Bot has spawned in the world.");
    });
}

startBot();