const { SlashCommandBuilder } = require("discord.js");
const { InventoryView } = require("../../API");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("your inventory"),
    async execute(interaction) {
        const market = new InventoryView(interaction, 1)
        interaction.reply({
            embeds: [market.embed],
            components: [market.row],
        })
    }
}