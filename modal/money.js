const { Guild } = require("discord.js");
const { } = require('fs');
const { GuildApi, CancelButton } = require("../API");

module.exports = {
    name: "money",
    async exe(interaction) {
        const icon = interaction.fields.getTextInputValue('icon');
        const name = interaction.fields.getTextInputValue('name');
        const guildid = interaction.guildId;

        const guild = new GuildApi(guildid)
        guild.money.icon = icon;
        guild.money.name = name;
        guild.write();
        interaction.reply({
            content: `**icon** : ${icon}\u000A**name** : ${name}`,
            components: [CancelButton.row]
        });
    }
};
