const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const shjs = require('shelljs')
const fs = require("fs");

module.exports = {
    name: "startinstance",
    aliases: ["sti"],
    cooldown: 1000,//1 saniye = 1000 ms / cooldown olmasını istemezseniz 0 yazın.
    run: async (client, message, args) => {
        /// +ci <template> <token>

      if (!args[0]) {
        return message.reply(":x: Utilisation : +sti <id>")
      }
      if (!fs.existsSync(`./src/instances/bots/${args[0]}`)) {
        return message.reply(":x: Cette instance n'éxiste pas ! faite +instancelist")
    }
    if (db.isUserInstance(message.author.id, args[0])) {
        if (await db.getStats(args[0]) == "running") return message.reply(":x: Cette instance est déja démarré !") 
    let msg = await message.reply(`:orange_circle: ${args[0]} Démarrage de l'instance...`)
    let token = await db.getInstance(args[0])

         process.createProcess(args[0], `node`, [`./src/instances/bots/${args[0]}/index.js`, `${token[0]['token']}`], client)
         return msg.edit(`:white_check_mark: [${args[0]}] Instance démarré !`)

    } else {
        return message.reply(":x: Cette instance n'éxiste pas ! faite +instancelist")
    }


    }
 };
