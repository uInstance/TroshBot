const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const nodemgr = require('../../manager/NodeManager')
const shjs = require('shelljs')
const fs = require("fs");
const unzipper = require('unzipper')
const config = require('../../config')

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

    if (!fs.existsSync(`./src/instances/template/${interaction.options.get("template").value}.zip`)) {
      return await interaction.reply({ content: ":x: Cette template n'éxiste pas !", ephemeral: true})
  }

      if (!(parseInt(await db.getTotalInstances(interaction.user.id)) >=  parseInt(await db.getMaxInstances(interaction.user.id)))) {
        await interaction.reply({ content: ":orange_circle: Création d'une instance...", ephemeral: true})
        if (config.selfhosted = false) {
          await interaction.editReply({ content: ":orange_circle: Recherche d'une node...", ephemeral: true})
          let node = await nodemgr.getAvailibleNode()
          if (!node) {
            return await interaction.editReply({ content: ":x: Aucune node disponible", ephemeral: true})
          } else {
            await interaction.editReply({ content: ":orange_circle: Obtentions d'une ID...", ephemeral: true})
            genCINode()
            async function genCINode() {
              let id = `${nodemgr.getDiscrim(node.nodeid)}` + Math.floor(Math.random() * (9999 - 1000) + 1000)
              if (!await db.getInstance(id)) {
                await interaction.editReply({ content:`:orange_circle: [${id}] Création de l'instances...` , ephemeral: true})  
                  return genCI2Node(id, node.nodeid)
              } else {
                  return genCINode()
              }
          }


          async function genCI2Node(id, nodeid) {
            /// la db comportera le  tableau instance de :
            /*
            ID : id de l'instance
            USERID : id de l'owner
            TEMPLATE : nom de la template
            TOKEN : Token du bot

            */ 
            db.createInstance(id, interaction.user.id, interaction.options.get("template").value, interaction.options.get("token").value, node.nodeid)
            await interaction.editReply({ content:`:orange_circle: [${id}] Installation de l'instances...` , ephemeral: true})  
            await nodemgr.installInstances(nodeid, id, interaction.options.get("template").value)
            await interaction.editReply({ content:`:white_check_mark: [${id}] Démarrage de l'instances...` , ephemeral: true})  
            return await nodemgr.createProcess(nodeid, id, `node`, [`./src/instances/bots/${id}/index.js`, `${interaction.options.get("token").value}`], client)

        }

          }
        } else {
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
              db.createInstance(id, interaction.user.id, interaction.options.get("template").value, interaction.options.get("token").value, "selfhosted")
              await interaction.editReply({ content:`:orange_circle: [${id}] Installation de l'instances...` , ephemeral: true})  
              await install(id, interaction.options.get("template").value)
              await interaction.editReply({ content:`:white_check_mark: [${id}] Démarrage de l'instances...` , ephemeral: true})  
              return process.createProcess(id, `node`, [`./index.js`, `${interaction.options.get("token").value}`, `${interaction.user.id}`], client, `./src/instances/bots/${id}/`)
  
          }
          return;
        }
        
      
return;
      } else {
        await interaction.reply({ content:":x: Vous avez atteint le maximum d'instance !" , ephemeral: true})  
      }
    }
 };

 function install(id, template) {
  return new Promise(async(resolve, reject)  => {
    shjs.mkdir(`./src/instances/bots/${id}`)
    shjs.cp('-R', `./src/instances/template/${template}.zip`, `./src/instances/bots/${id}`)
    fs.createReadStream(`./src/instances/bots/${id}/${template}.zip`).pipe(unzipper.Extract({ path: `./src/instances/bots/${id}` })).on('finish', async () => {
      shjs.rm('-rf', `./src/instances/bots/${id}/${template}.zip`)
      shjs.exec(`cd ./src/instances/bots/${id} && npm i`, {async:true}, (code, stdout, stderr) => {
        if (code !== 0) {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
          return;
        }
        resolve("Success installed");
      });
    })


  });
}