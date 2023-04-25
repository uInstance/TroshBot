const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const shjs = require('shelljs')
const fs = require("fs");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("stopinstance")
  
  .setDescription("Arrête une instance")
  .addStringOption(option =>
  option.setName('id')
    .setDescription("Id de l'instance")
          .setRequired(true)),
  // komutu geliştirmek istersen guide: https://discordjs.guide/slash-commands/advanced-creation.html
  run: async (client, interaction) => {    
        /// +ci <template> <token>

      if (!fs.existsSync(`./src/instances/bots/${interaction.options.get("id").value}`)) {
        return await interaction.reply({ content: ":x: Cette instance n'éxiste pas ! ", ephemeral: true})
    }
    if (db.isUserInstance(interaction.user.id, interaction.options.get("id").value)) {
        if (await db.getStats(interaction.options.get("id").value) == "stopped") return await interaction.reply({ content: ":x: Cette instance est déja arrêter ! ", ephemeral: true})
        await interaction.reply({ content: `:orange_circle: ${interaction.options.get("id").value} Arrêt de l'instance...`, ephemeral: true})

        process.stopProcess(interaction.options.get("id").value)
        delete db.processlist[interaction.options.get("id").value]
        db.setStats(interaction.options.get("id").value, "stopped")

         await interaction.editReply({ content: `:white_check_mark: [${interaction.options.get("id").value}] Instance arrêté !`, ephemeral: true})

    } else {
      return await interaction.reply({ content: ":x: Cette instance n'éxiste pas ! ", ephemeral: true})
    }


    }
 };
