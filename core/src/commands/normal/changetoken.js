const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const shjs = require('shelljs')
const fs = require("fs");

module.exports = {
    name: "changetoken",
    aliases: ["ct"],
    cooldown: 1000,//1 saniye = 1000 ms / cooldown olmasını istemezseniz 0 yazın.
    run: async (client, message, args) => {
        /// +ci <template> <token>
        message.delete()
        if (!args[1]) return message.channel.send(":x: Utilisation : +ct <id> <token>")
        if (db.isUserInstance(message.author.id, args[0])) {
            let msg = await message.channel.send(`Changement du token de l'instance ${args[0]}`)
            db.setToken(args[1])
            msg.edit(`:white_check_mark: [${args[0]}] Token changé !`)
        }
    }
 };
