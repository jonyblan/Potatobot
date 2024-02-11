const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('copycat')
		.setDescription('Replies with your input!')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The input to echo back')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('ephemeral')
				.setDescription('Whether it should be send back as ephemeral')
				.setRequired(false)
		),

	async execute(interaction){
		const msg = interaction.options.getString('input', false);
		var isEphemeral = false; // implement this
		if(isEphemeral == null || isEphemeral == false){
			await interaction.reply({content: `${msg}`, ephemeral: `false`});
		}
		else{
			await interaction.reply({content: `${msg}`, ephemeral: `false`});
		}
	},
};