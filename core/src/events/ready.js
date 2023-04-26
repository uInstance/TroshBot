const { ActivityType } = require("discord.js")
const db = require('../manager/DataManager')

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
	db.stopallprocess()
    let activities = [ `Coucou, moi c'est`, `${client.user.username}` ], i = 0;
    setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Listening }), 22000);
}};
