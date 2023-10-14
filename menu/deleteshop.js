const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { existsSync, rmSync } = require("fs");
const { CancelButton, GuildApi } = require("../API");

module.exports = {
    name: "deleteshop",
    async exe(interaction) {
        const item = interaction.values;
        if (item == "cancel") {
            interaction.message.delete();
            return
        }
        new GuildApi(interaction.guildId).shop()[item].delete();
        interaction.update({
            content: `you have chosen to delete ${item}.`,
            components: [CancelButton.row]
        });
    }
};
