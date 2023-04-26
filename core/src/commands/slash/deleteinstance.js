const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const shjs = require('shelljs')
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("deleteinstance")
  
  .setDescription("Supprime une instance")
  .addStringOption(option =>
  option.setName('id')
    .setDescription("Id de l'instance")
          .setRequired(true)),
  // komutu geliştirmek istersen guide: https://discordjs.guide/slash-commands/advanced-creation.html
  run: async (client, interaction) => {    
        /// +ci <template> <token>

      if (!fs.existsSync(`./src/instances/bots/${interaction.options.get("id").value}`)) {
        return await interaction.reply({ content: ":x: Cette instance n'éxiste pas !", ephemeral: true})
    }

    if (db.isUserInstance(interaction.user.id, interaction.options.get("id").value)) {
      await interaction.reply({ content: `:orange_circle: ${interaction.options.get("id").value} Désinstallation de l'instance...`, ephemeral: true})
        db.deleteInstance(interaction.options.get("id").value)
        await interaction.editReply({ content: `:orange_circle: ${interaction.options.get("id").value} Arrêt de l'instance...`, ephemeral: true})
        process.stopProcess(interaction.options.get("id").value)
        await interaction.editReply({ content: `:orange_circle: ${interaction.options.get("id").value} Supression de l'instance...`, ephemeral: true})
        await deleteinstance(interaction.options.get("id").value)
        delete db.processlist[interaction.options.get("id").value]
        await interaction.editReply({ content: `:white_check_mark: [${interaction.options.get("id").value}] Instance désinstallé !`, ephemeral: true})

    } else {
      return await interaction.reply({ content: ":x: Cette instance n'éxiste pas !", ephemeral: true})
    }


    }

    
 };

 function deleteinstance(id) {
  return new Promise(async(resolve, reject)  => {
    shjs.rm('-rf', `./src/instances/bots/${id}`)
    resolve()
  })
}