const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const shjs = require('shelljs')
const fs = require("fs");

module.exports = {
    name: "stopinstance",
    aliases: ["si"],
    cooldown: 1000,//1 saniye = 1000 ms / cooldown olmasını istemezseniz 0 yazın.
    run: async (client, message, args) => {
        /// +ci <template> <token>

      if (!args[0]) {
        return message.reply(":x: Utilisation : +si <id>")
      }
      if (!fs.existsSync(`./src/instances/bots/${args[0]}`)) {
        return message.reply(":x: Cette instance n'éxiste pas ! faite +instancelist")
    }
    if (db.isUserInstance(message.author.id, args[0])) {

        if (await db.getStats(args[0]) == "stopped") return message.reply(":x: Cette instance est déja arrêté !") 
    let msg = await message.reply(`:orange_circle: ${args[0]} Arrêt de l'instance...`)
        process.stopProcess(args[0])
        delete db.processlist[args[0]]
        db.setStats(args[0], "stopped")
        msg.edit(`:white_check_mark: [${args[0]}] Instance arrêté !`)

    } else {
        return message.reply(":x: Cette instance n'éxiste pas ! faite +instancelist")
    }


    }
 };
