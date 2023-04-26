const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const shjs = require('shelljs')
const fs = require("fs");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("templatelist")
    
    .setDescription("Liste des templates"),
    // komutu geliştirmek istersen guide: https://discordjs.guide/slash-commands/advanced-creation.html
    run: async (client, interaction) => {    
        /// +ci <template> <token>
  
    await interaction.reply({ content: "Chargement...", ephemeral: true})
   

    const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Liste de vos instances')
	.setDescription(`
    **Template TEST**
    > Auteur : UTrosh
    > Version : 1.0.0
    > Prix : Gratuit :white_check_mark:`)
	.setFooter({ text: 'TroshBot | Hosted by TroshHost.fr' });

    return await interaction.editReply({ embeds: [exampleEmbed], ephemeral: true})
    }
 };
