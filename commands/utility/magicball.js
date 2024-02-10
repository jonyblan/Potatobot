const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	category: 'utility',

	data: new SlashCommandBuilder()
		.setName('magicball')
		.setDescription('Gives a magic 8 ball answer'),

	async execute(interaction) {
		await interaction.deferReply();
		var answers = ['It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Yes', 'Signs point to yes', 'Reply hazy, try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', 'Don\'t count on it', 'My reply is no', 'My sources say no', 'Outlook not so good', 'Very doubtful'];
		var index = Math.floor(Math.random() * 20);
		await wait(2_000);
		await interaction.editReply(answers[index]);
	},
};