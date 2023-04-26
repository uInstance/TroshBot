const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const shjs = require('shelljs')
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("changetoken")
    
    .setDescription("Changer le token d'une instance!")
    .addStringOption(option =>
		option.setName('id')
			.setDescription("Id de l'instance")
            .setRequired(true))
    .addStringOption(option =>
        option.setName('token')
            .setDescription('Token a changer')
            .setRequired(true)),
    // komutu geliştirmek istersen guide: https://discordjs.guide/slash-commands/advanced-creation.html
    run: async (client, interaction) => {
        /// +ci <template> <token>
        //{ content: 'Secret Pong!', ephemeral: true }
        let id = interaction.options.get("id").value
        let token = interaction.options.get("token").value
        if (await db.isUserInstance(interaction.user.id, id)) {
            await interaction.reply({ content: `:orange_circle: [${id}] Changement du token...`, ephemeral: true})
            db.setToken(id, token)
            await interaction.editReply({ content: `:white_check_mark: [${id}] Token modifié`, ephemeral: true})
        } else {
            return interaction.reply({ content: `:x: [${id}] Cet instance n'éxiste pas !`, ephemeral: true})
        }
    }
 };
