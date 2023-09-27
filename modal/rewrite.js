module.exports = {
    name: "rewrite",
    async exe(interaction) {
        const text = interaction.fields.getTextInputValue('text');
        const channelid = interaction.fields.getTextInputValue('message')
        try {
            const targetMessage = await interaction.channel.messages.fetch(channelid);
            await targetMessage.edit(text);
            await interaction.reply({
                content: `Le message avec l'ID ${channelid} a été modifié avec succès.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "Impossible de modifier le message.",
                ephemeral: true,
            });
        }
    }
};
