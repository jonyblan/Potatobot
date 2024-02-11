const { SlashCommandBuilder } = require('discord.js');

// Define a map of input values to their corresponding replies
const repliesMap = {
    'POO-1': 'https://docs.google.com/document/d/18og_FE_50CdqR7lOhUa7UrmSRV59Wn63/edit',
    // Add more entries here as needed
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tp')
        .setDescription('gives a link to a tp (format: subject-tpname/number)')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('tp to be searched')
                .setAutocomplete(true)
                .setRequired(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getString('name');
        const choices = Object.keys(repliesMap);

        let filtered;
        if (!focusedValue) { // If no focused value is provided, display all options
            filtered = choices;
        } else {
            filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue.toLowerCase()));
        }

        await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
    },
    async execute(interaction) {
        const tpname = interaction.options.getString('name', true);
        const reply = repliesMap[tpname];
        if (reply) {
            await interaction.reply(reply);
        } else {
            await interaction.reply("Invalid name");
        }
    },
};