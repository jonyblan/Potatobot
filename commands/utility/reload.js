const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    category: 'utility',

    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload.')
                .setRequired(true)),

    async execute(interaction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const commandFiles = getAllCommandFiles(path.join(__dirname, '../../commands'));

        const commandFile = commandFiles.find(file => {
            const command = require(file);
            return command.data.name.toLowerCase() === commandName;
        });

        if (!commandFile) {
            return interaction.reply({ content: `There is no command with name \`${commandName}\`!`, ephemeral: true });
        }

        try {
            delete require.cache[require.resolve(commandFile)];
            const newCommand = require(commandFile);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply({ content: `Command \`${newCommand.data.name}\` was reloaded!`, ephemeral: true });
            console.log(`Reloaded \`${newCommand.data.name}\``);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``, ephemeral: true });
        }
    },
};

function getAllCommandFiles(directory) {
    const commandFiles = [];

    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            commandFiles.push(...getAllCommandFiles(filePath));
        } else if (stat.isFile() && file.endsWith('.js')) {
            commandFiles.push(filePath);
        }
    });

    return commandFiles;
}
