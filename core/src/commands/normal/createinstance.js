const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const shjs = require('shelljs')
const fs = require("fs");

module.exports = {
    name: "createinstance",
    aliases: ["ci"],
    cooldown: 1000,//1 saniye = 1000 ms / cooldown olmasını istemezseniz 0 yazın.
    run: async (client, message, args) => {
      message.delete()
      if (!args[1]) {
        return message.channel.send(":x: Utilisation : +ci <template> <token>")
      }
      if (!fs.existsSync(`./src/instances/template/${args[0]}`)) {
        return message.channel.send(":x: Cette template n'éxiste pas ! faite +template")
    }

      if (!(parseInt(await db.getTotalInstances(message.author.id)) >=  parseInt(await db.getMaxInstances(message.author.id)))) {
        let msg = await message.channel.send(":orange_circle: Création d'une instance...")
        msg.edit(":orange_circle: Obtentions d'une ID...")
        genCI(msg)
        async function genCI(msg) {
            let id = "FR-" + Math.floor(Math.random() * (9999 - 1000) + 1000)
            if (!await db.getInstance(id)) {
                msg.edit(`:orange_circle: [${id}] Création de l'instances...`)
                return genCI2(msg, id)
            } else {
                return genCI(msg)
            }
        }

        async function genCI2(msg, id) {
            /// la db comportera le  tableau instance de :
            /*
            ID : id de l'instance
            USERID : id de l'owner
            TEMPLATE : nom de la template
            TOKEN : Token du bot

            */
            db.createInstance(id, message.author.id, args[0], args[1])
            await msg.edit(`:orange_circle: [${id}] Installation de l'instances...`)
            shjs.mkdir(`./src/instances/bots/${id}`)
            shjs.cp('-R', `./src/instances/template/${args[0]}`, `./src/instances/bots/${id}`)
            shjs.mv(`-f`, `./src/instances/bots/${id}/${args[0]}/*`, `./src/instances/bots/${id}`)
            shjs.rm('-rf', `./src/instances/bots/${id}/${args[0]}`)
            shjs.exec(`cd ./src/instances/bots/${id} && npm i`)
            msg.edit(`:white_check_mark: [${id}] Démarrage de l'instances...`)
            return process.createProcess(id, `node`, [`./src/instances/bots/${id}/index.js`, `${args[1]}`], client)

        }
return;
      } else {
        return message.reply(":x: Vous avez atteint le maximum d'instance !")
      }
    }
 };
