const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("clear the chat")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        await interaction.reply({
            content: "https://imgur.com/pKopwXp",
            ephemeral: true,
        });
        const message = await interaction.channel.messages.fetch({ limit: 100 })
        await message.forEach(element => {
            if (!element.pinned) {
                element.delete();
            }
        });
        await interaction.editReply({
            content: "channel clear",
            ephemeral: true,
        })
    }
}