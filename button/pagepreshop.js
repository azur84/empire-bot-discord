const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { GuildApi, arrayMutil, CancelButton, MarketView } = require("../API");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "pagepreshop",
    async exe(interaction) {
        const page = parseInt(interaction.message.embeds[0].data.description.split("**")[1]) - 1;
        const market = new MarketView(interaction, page)
        interaction.message.edit({
            embeds: [market.embed],
            components: [market.row],
        })
        await interaction.reply({
            content: `Curent page ${page}.`,
            ephemeral: true,
        })
        await wait(1000)
        await interaction.deleteReply()
    }
};
