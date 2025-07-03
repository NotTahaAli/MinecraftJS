# MinecraftJS

A customizable Minecraft bot built with Node.js and Mineflayer that can automate server interactions.

## Description

MinecraftJS is a configurable bot that can connect to Minecraft servers, handle authentication, execute commands automatically, and reconnect when disconnected. It's useful for server AFKing, recurring tasks, or any automated Minecraft server interactions.

## Features

- Automatic login and registration with server authentication systems
- Execute startup commands when joining a server
- Run recurring commands at specified intervals
- Automatic reconnection after being kicked or disconnected
- Resource pack handling
- Death detection and automatic respawn
- Customizable through environment variables

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NotTahaAli/MinecraftJS.git
   cd MinecraftJS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the template:
   ```bash
   cp .env.template .env
   ```

4. Edit the `.env` file with your server details and configuration.

5. Build the project:
   ```bash
   npm run build
   ```

## Configuration

Configure the bot by editing the `.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| MINECRAFT_HOST | Minecraft server address | `play.example.com` |
| MINECRAFT_USERNAME | Bot's username | `MyBot` |
| MINECRAFT_PASSWORD | Password for server authentication | `securepassword` |
| COMMANDS_DELAY | Delay between command execution (ms) | `1000` |
| STARTUP_COMMANDS | Commands to run after login (separated by `:\|:`) | `/home:\|:/afk` |
| RECURRING_COMMANDS | Commands to run periodically (separated by `:\|:`) | `/home:\|:/afk` |
| RECURRING_COMMANDS_INTERVAL | Interval for recurring commands (ms) | `60000` |
| REJOIN_DELAY | Delay before reconnecting after disconnect (ms) | `5000` |

## Usage

Start the bot:

```bash
npm start
```

For development with auto-recompilation:

```bash
npm run watch
```

## How It Works

- The bot connects to the specified Minecraft server
- It automatically handles login/registration if required
- Executes startup commands after successful authentication
- Runs recurring commands at the specified interval
- Automatically reconnects if disconnected (if REJOIN_DELAY is set)
- Handles resource packs and automatically respawns on death

## Development

- Build the project: `npm run build`
- Watch for changes: `npm run watch`
- Lint the code: `npm run lint`

## License

ISC

## Author

[Muhammad Taha Ali](https://github.com/NotTahaAli)
