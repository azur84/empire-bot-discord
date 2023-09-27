const { } = require("discord.js");
const { } = require("fs");
const { CancelButton, GuildApi } = require("../API");

module.exports = {
    name: "deleteitem",
    async exe(interaction) {
        const item = interaction.values;
        if (item == "cancel") {
            interaction.message.delete();
            return
        }
        new GuildApi(interaction.guildId).items()[item].delete();
        interaction.update({
            content: `you have chosen to delete ${item}.`,
            components: [CancelButton.row]
        });
    }
};
