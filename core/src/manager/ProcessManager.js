const {spawn} = require('child_process')
const db = require('./DataManager')

async function createProcess(id, commands, args, client) {
    if (db.getStats(id) == "running") return "alrrunning"
    const childProcess = spawn(commands, args);
    db.processlist[id] = {
      name: `Process ${id}`,
      state: 'running',
      childProcess: childProcess
    };
    db.setStats(id, "running")

    db.processlist[id].childProcess.stdout.on('data', (data) => {
        console.log(`[Instance ${id}] ${data}`);
      });
      db.processlist[id].childProcess.stderr.on('data', async (data) => {
        if (data.includes("TokenInvalid") || data.includes("invalid token")) {
            let ownerid = await db.getOwnerByInstance(id)
            client.users.fetch(ownerid, false).then((user) => {
                user.send(`[${id}] :x: Le token est invalide ! Veuillez changez le token de démarrage !`);
               });
        } else {
            console.error(`[Instance ${id} ERROR] ${data}`);
        }
      });
      db.processlist[id].childProcess.on('close', (code) => {
        console.log(`[Instance ${id}] Processus terminé avec le code ${code}`);
        db.setStats(id, "stopped")
      });

    return;
}


function stopProcess(id) {
    db.setStats(id, "stopped")
    const process = db.processlist[id];
  if (process && process.childProcess) {
    process.childProcess.kill();
    process.state = 'stopped';
    console.log(`Process ${id} stopped.`);
    return "stopped"
  } else {
    console.log(`Process ${id} not found.`);
    return "notfound"
  }
}

function restartProcess(id, args) {
    stopProcess(id);
    createProcess(id, `node`, [`./src/instances/bots/${id}/index.js`], `${args[1]}`)
    return "restarted"
  }

function startProcess(id, args) {
    if (db.getStats(id) = "running") return "alrrunning"
    createProcess(id, `node`, [`./src/instances/bots/${id}/index.js`], `${args[1]}`)
    return "started"
  }

module.exports = {
    createProcess,
    stopProcess,
    restartProcess,
    startProcess
}