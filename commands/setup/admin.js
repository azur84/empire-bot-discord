const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin")
        .setDescription("the admin command")
        .addSubcommand(subcommand =>
            subcommand
                .setName("info")
                .setDescription("info")
                .addUserOption(option =>
                    option.setName("user")
                        .setDescription("user")
                        .setRequired(true)))
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName("resend")
        //         .setDescription("resend a message")
        //         .addStringOption(option =>
        //             option.setName("id")
        //                 .setDescription("id of the message")
        //                 .setRequired(true))
        //         .addStringOption(option =>
        //             option.setName("content")
        //                 .setDescription("content of the message")
        //                 .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("send")
                .setDescription("send a message")
                // .addStringOption(option =>
                //     option.setName("content")
                //         .setDescription("content of the message")
                //         .setRequired(true))
                ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "info":
                const user = interaction.options.getUser("user");
                console.log(user.avatarURL())
                break;

            case "resend":
                const messageId = interaction.options.getString("id");
                const newContent = interaction.options.getString("content");
                const nnewContent = newContent.replace(/µ/g,"\u000A");
                try {
                    const targetMessage = await interaction.channel.messages.fetch(messageId);
                    await targetMessage.edit(nnewContent);
                    await interaction.reply({
                        content: `Le message avec l'ID ${messageId} a été modifié avec succès.`,
                        ephemeral: true,
                    });
                } catch (error) {
                    console.error(error);
                    await interaction.reply({
                        content: "Impossible de modifier le message.",
                        ephemeral: true,
                    });
                }
                break;

            case "send":
                const modal = new ModalBuilder()
                    .setTitle("text")
                    .setCustomId("write")
                const icon = new TextInputBuilder()
                    .setCustomId("text")
                    .setLabel("text")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
                const firsttext = new ActionRowBuilder().addComponents(icon);
                modal.addComponents(firsttext);
                await interaction.showModal(modal)
                break;
            default:
                await interaction.reply({
                    content: "Sous-commande invalide.",
                    ephemeral: true,
                });
        }
    }
}