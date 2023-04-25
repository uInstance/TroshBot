const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const shjs = require('shelljs')
const fs = require("fs");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("instancelist")
    
    .setDescription("Liste vos instance"),
    // komutu geliştirmek istersen guide: https://discordjs.guide/slash-commands/advanced-creation.html
    run: async (client, interaction) => {    
        /// +ci <template> <token>
    if (!await db.getUserInstance(interaction.user.id)) {
        return await interaction.reply({ content: ":x: Vous n'avez aucune instance !", ephemeral: true})
    }
    await interaction.reply({ content: "Chargement...", ephemeral: true})
    let instancelist = await db.getUserInstance(interaction.user.id)
    let embeddesc = ``
    for (const t of instancelist) {

        let status;
        if (t.stats == "running") {
            status = ":white_check_mark:"
        } else if (t.stats == "stopped") {
            status = ":x:"
        } else {
            status = ":orange_circle:"
        }
        embeddesc = embeddesc + `\n**Instance [${t.id}]**\n:arrow_right: Status : ${status}\n:arrow_right: Template : ${t.template}\n:arrow_right: Owner : ${t.userid}\n`
    }


    const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Liste de vos instances')
	.setDescription(embeddesc)
	.setFooter({ text: 'TroshBot | Hosted by TroshHost.fr' });

    interaction.editReply({ embeds: [exampleEmbed], ephemeral: true})
    }
 };
