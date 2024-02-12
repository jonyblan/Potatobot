const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const dbFilePath = require('./../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('counter')
        .setDescription('Increments and displays the counter'),

    async execute(interaction) {
        // Create a new SQLite database connection
        const db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                return interaction.reply({ content: 'An error occurred while connecting to the database.', ephemeral: true });
            }

            console.log('Connected to the database');

            // Query the current value of the counter from the database
            db.get('SELECT * FROM counter', (err, row) => {
                if (err) {
                    console.error('Error reading counter:', err.message);
                    return interaction.reply({ content: 'An error occurred while reading the counter.', ephemeral: true });
                }

                if (!row) {
                    // Handle case where the counter doesn't exist yet (e.g., first-time setup)
                    console.error('Counter not found in database');
                    return interaction.reply({ content: 'Counter not found in database.', ephemeral: true });
                }

                // Increment the counter value by 1
                const newValue = row.count + 1;

                // Update the counter value in the database
                db.run('UPDATE counter SET count = ?', [newValue], function(err) {
                    if (err) {
                        console.error('Error updating counter:', err.message);
                        return interaction.reply({ content: 'An error occurred while updating the counter.', ephemeral: true });
                    }

                    // Send a message indicating the new counter value
                    interaction.reply(`The counter was incremented. New value: ${newValue}`);
                });
            });
        });
    },
};
