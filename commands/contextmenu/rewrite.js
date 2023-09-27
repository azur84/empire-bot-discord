const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits, TextInputStyle, ModalBuilder, TextInputBuilder, ActionRowBuilder,  } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('rewrite message')
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        async execute(interaction) {
            const modal = new ModalBuilder()
                .setTitle("text")
                .setCustomId("rewrite")
            const tag = new TextInputBuilder()
                .setCustomId("message")
                .setLabel("message id")
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setValue(interaction.targetMessage.id)
            const icon = new TextInputBuilder()
                .setCustomId("text")
                .setLabel("text")
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph)
                .setValue(interaction.targetMessage.content)
            const firsttext = new ActionRowBuilder().addComponents(icon);
            const tagtext = new ActionRowBuilder().addComponents(tag);
            modal.addComponents(tagtext,firsttext);
            await interaction.showModal(modal)
        }
}