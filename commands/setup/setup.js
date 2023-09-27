const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType } = require("discord.js");
const { readFileSync, existsSync, writeFileSync, mkdirSync } = require("fs");
const { GuildApi } = require('../../API')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("setup the bot")
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("the channel where bot works")
                .addChannelTypes(ChannelType.GuildCategory)
                .setRequired(true)),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setTitle("money")
            .setCustomId("money")
        const icon = new TextInputBuilder()
            .setCustomId("icon")
            .setLabel("money's icon")
            .setMinLength(1)
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
        const name = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("money's name")
            .setMinLength(1)
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
        const firsttext = new ActionRowBuilder().addComponents(icon);
        const secondtext = new ActionRowBuilder().addComponents(name);
        modal.addComponents(firsttext, secondtext);
        const group = interaction.options.getChannel("channel");
        const guildId = interaction.guildId;
        const guild = new GuildApi(guildId);
        guild.channels.group = group.id;
        guild.write();
        await interaction.showModal(modal)
        
    },
};
