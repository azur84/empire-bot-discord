const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require("discord.js");
const { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } = require("fs");
const { CancelButton, GuildApi } = require("../../API");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("the admin shop")
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName("buy")
        //         .setDescription("buy in admin shop"))
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName("view")
        //         .setDescription("view the shop"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("add a item in the shop")
                .addStringOption(option =>
                    option.setName("id")
                        .setDescription("shop item id")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("itemid")
                        .setDescription("item's ID")
                        .setRequired(true))
                .addNumberOption(option =>
                    option.setName("price")
                        .setDescription("item's price")
                        .setRequired(true))
                // .addBooleanOption(option =>
                //     option.setName("sell")
                //         .setDescription("is sell shop")
                //         .setRequired(true))
                        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("remove a item in the shop")),
    async execute(interaction) {
        if (!existsSync(`./serveur/${interaction.guildId}/shop`)) {
            mkdirSync(`./serveur/${interaction.guildId}/shop`);
        }
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "buy") {
            // Implémentez la logique pour la sous-commande "buy" ici.
            interaction.reply("Vous avez choisi d'acheter dans la boutique.");
        } else if (subcommand === "view") {
            const items = readdirSync(`./serveur/${interaction.guildId}/shop`);
            let options = "> **shop:**\u000A*> /shop buy *to buy or sale\u000A\u000A";
            items.forEach((element) => {
                const shopInfo = JSON.parse(readFileSync(`./serveur/${interaction.guildId}/shop/${element}`))
                const itemInfo = JSON.parse(readFileSync(`./serveur/${interaction.guildId}/item/${shopInfo.itemID}.json`));
                if (shopInfo.sell) {
                    options += "to buy : "
                } else {
                    options += "for sale : "
                }
                if (itemInfo.icon == null) {
                    options += `**${shopInfo.name}**\u000A** cost : ${shopInfo.cost}**\u000A** ID : ${shopInfo.name}**\u000A[------------------]\u000A`
                } else {
                    options += `${itemInfo.icon}** ${shopInfo.name}**\u000A** cost : ${shopInfo.price}**\u000A** ID : ${shopInfo.name}**\u000A[------------------]\u000A`
                }
            })
            interaction.reply({
                content: options,
                ephemeral: true,
            });
        } else if (subcommand === "add") {
            // Implémentez la logique pour la sous-commande "add" ici.
            const id = interaction.options.getString("id");
            const itemID = interaction.options.getString("itemid");
            const price = interaction.options.getNumber("price");
            // const sell = interaction.options.getBoolean("sell")

            if (id == "cancel") {
                interaction.reply({
                    content: "error your id is invalid",
                    ephemeral: true,
                });
                return
            }
            if (!new GuildApi(interaction.guildId).items().toArray.includes(itemID)) {
                interaction.reply({
                    content: "error your itemid is invalid",
                    ephemeral: true,
                });
                return
            }
            if (!existsSync(`./serveur/${interaction.guildId}/item/${itemID}.json`)) {
                interaction.reply({
                    content: "error your itemId is invalid",
                    ephemeral: true,
                });
                return
            }
            new GuildApi(interaction.guildId).shop().newItem(id,itemID,price)
            interaction.reply({
                content: `You have chosen to add an item: id : ${id}, ID : ${itemID}, Prix : ${price}`,
                components: [CancelButton.row]
            }
            );
        } else if (subcommand === "remove") {
            let options = []
            const guildshop = new GuildApi(interaction.guildId)
            const array = guildshop.shop().toArray
            array.forEach((element) => {
                console.log(element);
                const shopInfo = guildshop.shop()[element]
                const itemInfo = guildshop.items()[shopInfo.itemId]
                if (itemInfo.icon == null) {
                    options.push(new StringSelectMenuOptionBuilder().setLabel(itemInfo.name).setValue(shopInfo.id))
                } else {
                    options.push(new StringSelectMenuOptionBuilder().setLabel(itemInfo.name).setValue(shopInfo.id).setEmoji(itemInfo.icon))
                }
            })
            const nul = new StringSelectMenuOptionBuilder().setLabel("cancel").setValue("cancel").setEmoji('❌');
            options.push(nul);
            const menu = new StringSelectMenuBuilder()
                .setCustomId("deleteshop")
                .setPlaceholder("delete an item in the shop")
                .addOptions(options)
            const row = new ActionRowBuilder()
                .addComponents(menu);
            interaction.reply({ components: [row] });
        }
    },
};
