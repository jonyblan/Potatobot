const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('fs');
const path = require('path');

// Check if a file path is provided as an argument
if (process.argv.length < 3) {
    console.error("Usage: node deploy.js <file.js>");
    process.exit(1);
}

// Extract the file name from command line arguments
const fileName = process.argv[2];

// Define the commands directory
const commandsDir = path.join(__dirname, 'commands');

// Function to recursively search for the file within the directory
function findFile(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            const result = findFile(filePath);
            if (result) return result;
        } else if (file === fileName) {
            return filePath;
        }
    }
    return null;
}

// Find the file within the commands directory
const filePath = findFile(commandsDir);

// Check if the file exists
if (!filePath) {
    console.error(`File not found: ${fileName}`);
    process.exit(1);
}

// Ensure that the provided file is a JavaScript file
if (!filePath.endsWith('.js')) {
    console.error(`Invalid file type. Please provide a JavaScript file.`);
    process.exit(1);
}

// Initialize an array to hold the command data
const commands = [];

// Load the command data from the specified file
const command = require(filePath);
if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
} else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// Deploy the command
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
