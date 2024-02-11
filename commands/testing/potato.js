const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('potato')
		.setDescription('Replies with knish-!')
		.addStringOption(option =>
			option.setName('letter')
				.setDescription('the last letter')
				.setRequired(true)
				.addChoices(
					{ name: 'a', value: 'a' },
					{ name: 'e', value: 'e' },
					{ name: 'i', value: 'i' },
					{ name: 'o', value: 'o' },
					{ name: 'u', value: 'u' },
				)),
	async execute(interaction) {
		const lastLetter = interaction.options.getString('letter', true);
		await interaction.reply(`knish${lastLetter}`);
	},
};