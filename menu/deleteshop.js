const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { existsSync, rmSync } = require("fs");
const { CancelButton } = require("../API");

module.exports = {
    name: "deleteshop",
    async exe(interaction) {
        const item = interaction.values;
        if (item == "cancel") {
            interaction.message.delete();
            return
        }
        if (existsSync(`./serveur/${interaction.guildId}/shop/${item}.json`)) {
            rmSync(`./serveur/${interaction.guildId}/shop/${item}.json`)
        }
        interaction.update({
            content: `you have chosen to delete ${item}.`,
            components: [CancelButton.row]
        });
    }
};
