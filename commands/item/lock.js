const { SlashCommandBuilder } = require("discord.js");
const { GuildApi, CancelButton, ifReturn } = require("../../API");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("lock")
        .addSubcommand(subcommand =>
            subcommand
                .setName("item")
                .setDescription("lock a item")
                .addStringOption(option =>
                    option.setName("id")
                        .setDescription("item's ID")
                        .setRequired(true)
                        .setMaxLength(10)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("shop")
                .setDescription("lock a shop")
                .addStringOption(option =>
                    option.setName("id")
                        .setDescription("item's ID")
                        .setRequired(true)
                        .setMaxLength(10))),
    async execute(interaction) {
        const id = interaction.options.getString("id");
        if (interaction.options.getSubcommand() === "item") {
            const item = new GuildApi(interaction.guildId).items()[id]
            item.lock()
            interaction.reply({
                content: `you have chosen to **${ifReturn(item.islock(),"lock","unlock")} ${item.name}**.`,
                components: [CancelButton.row]
            })
        } else if (interaction.options.getSubcommand() === "shop") {
            new GuildApi(interaction.guildId).shop()[id].lock()
        }
    }
}