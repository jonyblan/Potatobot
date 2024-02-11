const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		const row = new ActionRowBuilder()
		.addComponents(component);
	
		await interaction.reply({ components: [row] });	
	},
};