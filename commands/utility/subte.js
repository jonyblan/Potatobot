const { SlashCommandBuilder } = require('discord.js');
const { adminId } = require('../../config.json');

// Define a map of input values to their corresponding replies
const repliesMap = {
	'Plaza de mayo-C': 'N/A',
	'Plaza de mayo-D': 'N/A',
	'Plaza de mayo-E': 'N/A',
	'Plaza de mayo-H': 'N/A',
	'San Pedrito-C': 'N/A',
	'San Pedrito-D': 'N/A',
	'San Pedrito-E': 'N/A',
	'San Pedrito-H': 'N/A',
	'Alem-C': 'N/A',
	'Alem-D': 'N/A',
	'Alem-E': 'N/A',
	'Alem-H': 'N/A',
	'Rosas-C': 'N/A',
	'Rosas-D': 'N/A',
	'Rosas-E': 'N/A',
	'Rosas-H': 'N/A',
	'Retiro(C)-A': 'N/A',
	'Retiro(C)-B': 'N/A',
	'Retiro(C)-D': 'N/A',
	'Retiro(C)-E': 'N/A',
	'Constitucion-A': 'N/A',
	'Constitucion-B': 'N/A',
	'Constitucion-D': 'N/A',
	'Constitucion-E': 'N/A',
	'Catedral-A': 'N/A',
	'Catedral-B': 'N/A',
	'Catedral-C': 'N/A',
	'Catedral-E': 'N/A',
	'Catedral-H': 'N/A',
	'Congreso de Tucuman-A': 'N/A',
	'Congreso de Tucuman-B': 'N/A',
	'Congreso de Tucuman-C': 'N/A',
	'Congreso de Tucuman-E': 'N/A',
	'Congreso de Tucuman-H': 'N/A',
	'Retiro(E)-A': 'N/A',
	'Retiro(E)-B': 'N/A',
	'Retiro(E)-C': 'N/A',
	'Retiro(E)-D': 'N/A',
	'Retiro(E)-H': 'N/A',
	'Virreyes-A': 'N/A',
	'Virreyes-B': 'N/A',
	'Virreyes-C': 'N/A',
	'Virreyes-D': 'N/A',
	'Virreyes-H': 'N/A',
	'Facultad de Derecho-A': 'N/A',
	'Facultad de Derecho-B': 'N/A',
	'Facultad de Derecho-D': 'N/A',
	'Facultad de Derecho-E': 'N/A',
	'Hospitales-A': 'N/A',
	'Hospitales-B': 'N/A',
	'Hospitales-D': 'N/A',
	'Hospitales-E': 'N/A',
	'Facultad de Derecho-Las Heras': '13va ultima',
	'Hospitales-Caseros': 'N/A',
	'Hospitales-Parque Patricios': 'N/A',
	'San Pedrito-Rio de Janeiro': 'N/A',
	'Rosas-Medrano': 'N/A',
	'Rosas-Carlos Gardel': 'N/A',
	'Rosas-Malabia': 'N/A',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('subte')
        .setDescription('donde pararte para combinar (formato: terminal actual-linea a combinar/terminal actual-estacion')
        .addStringOption(option =>
            option
				.setName('puerta')
                .setDescription('A donde vas?')
                .setAutocomplete(true)
                .setRequired(true))
		.addStringOption(option =>
			option
				.setName('cambiar-puerta')
				.setDescription('Cual es la puerta?')),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getString('puerta');
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
        const puertaPedida = interaction.options.getString('puerta', true);
		const nuevaPuerta = interaction.options.getString('cambiar-puerta', false);
        const reply = repliesMap[puertaPedida];
        if (reply) {
			if(reply == 'N/A'){
				if(!nuevaPuerta){
					await interaction.reply({content: 'No esta todavia, elegi la misma opcion pero usa la opcion "cambiar puerta"', ephemeral: true})
				}
				else{
					const jony = await interaction.client.users.fetch(adminId);
					await jony.send(`Nueva puerta para combinar!. ${puertaPedida} en ${nuevaPuerta}`);
					await interaction.reply({content: 'Gracias! La voy a agregar lo antes posible', ephemeral: true})
				}
			}
            else{
				await interaction.reply(`La puerta para ${puertaPedida} es la ${reply}`);
			}
        } else {
            await interaction.reply('Invalid tpname');
        }
    },
};