const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const shjs = require('shelljs')
const fs = require("fs");

module.exports = {
    name: "deleteinstance",
    aliases: ["di"],
    cooldown: 1000,//1 saniye = 1000 ms / cooldown olmasını istemezseniz 0 yazın.
    run: async (client, message, args) => {
        /// +ci <template> <token>

      if (!args[0]) {
        return message.reply(":x: Utilisation : +di <id>")
      }
      if (!fs.existsSync(`./src/instances/bots/${args[0]}`)) {
        return message.reply(":x: Cette instance n'éxiste pas ! faite +instancelist")
    }
    if (db.isUserInstance(message.author.id, args[0])) {
    let msg = await message.reply(`:orange_circle: ${args[0]} Désinstallation de l'instance...`)
        db.deleteInstance(args[0])
        await msg.edit(`:orange_circle: ${args[0]} Arrêt de l'instance...`)
        process.stopProcess(args[0])
        await msg.edit(`:orange_circle: ${args[0]} Supression de l'instance...`)
        shjs.rm('-rf', `./src/instances/bots/${args[0]}`)
        delete db.processlist[args[0]]
        msg.edit(`:white_check_mark: [${args[0]}] Instance désinstallé !`)

    } else {
        return message.reply(":x: Cette instance n'éxiste pas ! faite +instancelist")
    }


    }
 };
