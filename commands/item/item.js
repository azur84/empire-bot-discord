const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { mkdirSync, existsSync } = require("fs");
const { CancelButton, GuildApi } = require("../../API");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("item")
        .setDescription("item")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("add a item")
                .addStringOption(option =>
                    option.setName("id")
                        .setDescription("item's ID")
                        .setRequired(true)
                        .setMaxLength(10))
                .addStringOption(option =>
                    option.setName("name")
                        .setDescription("item's name")
                        .setRequired(true))
                .addNumberOption(option =>
                    option.setName("sell")
                        .setDescription("item's sell cost")
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName("icon")
                        .setDescription("item's icon"))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("remove a item")),
    async execute(interaction) {
        if (!existsSync(`./serveur/${interaction.guildId}/item`)) {
            mkdirSync(`./serveur/${interaction.guildId}/item`);
        }

        if (interaction.options.getSubcommand() === "add") {
            const id = interaction.options.getString("id");
            const name = interaction.options.getString("name");
            const CP = interaction.options.getNumber("sell");
            const icon = interaction.options.getString("icon");
            if (id == "cancel") {
                interaction.reply({
                    content: "error your id is invalid",
                    ephemeral: true,
                });
                return
            }
            new GuildApi(interaction.guildId).items().newItem(id,name,icon,CP)
            interaction.reply({
                content: `You have chosen to add an item with ID: ${id}, Nom: ${name}, CP: ${CP}, icon: ${icon}`,
                components: [CancelButton.row]
            });
        } else if (interaction.options.getSubcommand() === "remove") {
            let options = []
            const guildItems = new GuildApi(interaction.guildId).items()
            const array = guildItems.toArray;
            array.forEach((element) => {
                const item = guildItems[element];
                if (item.islock()) return
                if (item.icon == null) {
                    options.push(new StringSelectMenuOptionBuilder().setLabel(item.name).setValue(item.id))
                } else {
                    options.push(new StringSelectMenuOptionBuilder().setLabel(item.name).setValue(item.id).setEmoji(item.icon))
                }
            })
            const nul = new StringSelectMenuOptionBuilder().setLabel("cancel").setValue("cancel").setEmoji('❌');
            options.push(nul);
            const menu = new StringSelectMenuBuilder()
                .setCustomId("deleteitem")
                .setPlaceholder("delete an item")
                .addOptions(options)
            const row = new ActionRowBuilder()
                .addComponents(menu);
            interaction.reply({ components: [row] });
        }
    },
};
