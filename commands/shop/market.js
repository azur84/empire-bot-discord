const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client } = require("discord.js");
const { GuildApi, arrayMutil, CancelButton, MarketView, ifReturn } = require("../../API");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("market")
        .setDescription("the shop")
        .addSubcommand(subcommand =>
            subcommand
                .setName("buy")
                .setDescription("buy in admin shop")
                .addStringOption(option =>
                    option.setName('id')
                        .setRequired(true)
                        .setDescription('id of the shop'))
                .addNumberOption(option =>
                    option.setName('number')
                        .setDescription('number of item to buy')
                        .setMinValue(1)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("sell")
                .setDescription("sell a item in admin shop")
                .addStringOption(option =>
                    option.setName('id')
                        .setRequired(true)
                        .setDescription('id of item'))
                .addNumberOption(option =>
                    option.setName('number')
                        .setDescription('number of item to sell')
                        .setMinValue(1)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("view")
                .setDescription("view the shop")),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === "view") {
            const market = new MarketView(interaction, 1)
            interaction.reply({
                embeds: [market.embed],
                components: [market.row],
            })
        } else if (subcommand === "buy") {
            const itemID = interaction.options.getString("id");
            const number = ifReturn(interaction.options.getNumber("number") == null, 1, interaction.options.getNumber("number"))
            const guild = new GuildApi(interaction.guildId)
            if (!guild.shop().toArray.includes(itemID)) {
                interaction.reply({
                    content: "error your id is invalid",
                    ephemeral: true,
                });
                return
            }
            const user = guild.user(interaction.member.id)
            const shop = guild.shop()[itemID];
            const item = guild.items()[shop.itemId];
            if (user.money >= shop.cost * number) {
                user.money -= shop.cost * number
                if (user.inventory[item.id] == null) {
                    user.inventory[item.id] = 0
                }
                user.inventory[item.id] += number
                user.write()
                interaction.reply({
                    content: `you buy ${ifReturn(number == 1,"a",number)} ${item.name}`,
                    ephemeral: true,
                });
            } else {
                interaction.reply({
                    content: "you don't have the money",
                    ephemeral: true,
                });
            }
        } else if (subcommand === "sell") {
            const itemID = interaction.options.getString("id");
            const number = ifReturn(interaction.options.getNumber("number") == null, 1, interaction.options.getNumber("number"))
            const guild = new GuildApi(interaction.guildId)
            if (!guild.items().toArray.includes(itemID)) {
                interaction.reply({
                    content: "error your id is invalid",
                    ephemeral: true,
                });
                return
            }
            const user = guild.user(interaction.member.id)
            const item = guild.items()[itemID];
            if (user.inventory[itemID] >= number) {
                user.inventory[itemID] -= number
                user.money += item.cp * number
                user.write()
                interaction.reply({
                    content: `you sell ${ifReturn(number == 1, "a", number)} ${item.name}`,
                    ephemeral: true,
                });
            } else {
                interaction.reply({
                    content: "you don't have the item",
                    ephemeral: true,
                });
            }
        }
    }
}