module.exports = {
    name: "write",
    async exe(interaction) {
        const text = interaction.fields.getTextInputValue('text');
        await interaction.channel.send(text);
        await interaction.reply({
            content: "message send",
            ephemeral: true,
        })
    }
};
