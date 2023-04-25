const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const shjs = require('shelljs')
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("createinstance")
  
  .setDescription("Créer une instance")
  .addStringOption(option =>
  option.setName('template')
    .setDescription("Template de l'instance")
          .setRequired(true))
  .addStringOption(option =>
      option.setName('token')
          .setDescription('Token du bot')
          .setRequired(true)),
  // komutu geliştirmek istersen guide: https://discordjs.guide/slash-commands/advanced-creation.html
  run: async (client, interaction) => {    

    if (!fs.existsSync(`./src/instances/template/${interaction.options.get("template").value}`)) {
      return await interaction.reply({ content: ":x: Cette template n'éxiste pas !", ephemeral: true})
  }

      if (!(parseInt(await db.getTotalInstances(interaction.user.id)) >=  parseInt(await db.getMaxInstances(interaction.user.id)))) {
        await interaction.reply({ content: ":orange_circle: Création d'une instance...", ephemeral: true})
        await interaction.editReply({ content: ":orange_circle: Obtentions d'une ID...", ephemeral: true})
        genCI()
        async function genCI() {
            let id = "FR-" + Math.floor(Math.random() * (9999 - 1000) + 1000)
            if (!await db.getInstance(id)) {
              await interaction.editReply({ content:`:orange_circle: [${id}] Création de l'instances...` , ephemeral: true})  
                return genCI2(id)
            } else {
                return genCI()
            }
        }

        async function genCI2(id) {
            /// la db comportera le  tableau instance de :
            /*
            ID : id de l'instance
            USERID : id de l'owner
            TEMPLATE : nom de la template
            TOKEN : Token du bot

            */ 
            db.createInstance(id, interaction.user.id, interaction.options.get("template").value, interaction.options.get("token").value)
            await interaction.editReply({ content:`:orange_circle: [${id}] Installation de l'instances...` , ephemeral: true})  
            await install(id, interaction.options.get("template").value)
            await interaction.editReply({ content:`:white_check_mark: [${id}] Démarrage de l'instances...` , ephemeral: true})  
            return process.createProcess(id, `node`, [`./src/instances/bots/${id}/index.js`, `${interaction.options.get("token").value}`], client)

        }
return;
      } else {
        await interaction.reply({ content:":x: Vous avez atteint le maximum d'instance !" , ephemeral: true})  
      }
    }
 };

 function install(id, template) {
  return new Promise((resolve, reject) => {
    shjs.mkdir(`./src/instances/bots/${id}`)
    shjs.cp('-R', `./src/instances/template/${template}`, `./src/instances/bots/${id}`)
    shjs.mv(`-f`, `./src/instances/bots/${id}/${template}/*`, `./src/instances/bots/${id}`)
    shjs.rm('-rf', `./src/instances/bots/${id}/${template}`)
    shjs.exec(`cd ./src/instances/bots/${id} && npm i`, {async:true, silent:true}, (code, stdout, stderr) => {
      if (code !== 0) {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
        return;
      }
      resolve(stdout.trim());
    });

  });
}