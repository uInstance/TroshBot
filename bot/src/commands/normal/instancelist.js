const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require('../../manager/DataManager')
const process = require('../../manager/ProcessManager')
const shjs = require('shelljs')
const fs = require("fs");

module.exports = {
    name: "instancelist",
    aliases: ["il"],
    cooldown: 1000,//1 saniye = 1000 ms / cooldown olmasını istemezseniz 0 yazın.
    run: async (client, message, args) => {
        /// +ci <template> <token>
    if (!await db.getUserInstance(message.author.id)) {
        return message.reply(":x: Vous n'avez aucune instance !")
    }
    let instancelist = await db.getUserInstance(message.author.id)
    let embeddesc = ``
    for (const t of instancelist) {

        let status;
        if (t.stats == "running") {
            status = ":white_check_mark:"
        } else if (t.stats == "stopped") {
            status = ":x:"
        } else {
            status = ":orange_circle:"
        }
        embeddesc = embeddesc + `\n**Instance [${t.id}]**\n:arrow_right: Status : ${status}\n:arrow_right: Template : ${t.template}\n:arrow_right: Owner : ${t.userid}\n`
    }


    const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Liste de vos instances')
	.setDescription(embeddesc)
	.setFooter({ text: 'TroshBot | Hosted by TroshHost.fr' });

message.channel.send({ embeds: [exampleEmbed] });
    }
 };
