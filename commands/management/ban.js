const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Select a member and ban them.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for banning'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Ban')
            .setStyle(ButtonStyle.Danger);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);

        await interaction.reply({
            content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
            ephemeral: true,
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await interaction.channel.awaitMessageComponent({ filter: collectorFilter, time: 6000 });

            if (confirmation.customId === 'confirm') {
                await interaction.guild.members.ban(target);
                await interaction.channel.send(`${target.username} has been banned for reason: ${reason}`);
                await confirmation.update({ content: 'Banned successfully', components: [] });
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({ content: 'Action cancelled', components: [] });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
    },
};
