const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'gm-01.troshhost.fr',
    user: 'u14_b2LvU6P36v',
    password: 'x=ntCa7gCFK5d+^hjF7@2y8U',
    database: 's14_instance',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
  });
let processlist = [];

function getInstance(id) {
    return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM instance WHERE id='${id}'`, function(err, rows, fields) {

        if (err) {
            reject(err);
          } else {
            if (!rows[0]) return resolve(undefined)
            resolve(rows);
          }
     })
    });
}

function getUserInstance(id) {
    return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM instance WHERE userid=${id}`, function(err, rows, fields) {

        if (err) {
            reject(err);
          } else {
            if (!rows[0]) return resolve(undefined)
            resolve(rows);
          }
     })
    });
}

async function getTotalInstances(id) {
    if (!await getUserById(id)) {
        createUser(id)
        getMaxInstances(id)
    } else {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT COUNT(*) as count FROM instance WHERE userid=${id}`, function(err, rows, fields) {
              if (err) {
                reject(err);
              } else {
                if (!rows[0]) return resolve(0)
                resolve(rows[0].count);
              }
            });
          });
    }

  }

async function getMaxInstances(id, callback) {
    if (!await getUserById(id)) {
        createUser(id)
        getMaxInstances(id)
    } else {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT maxinstance FROM user WHERE userid=${id}`, function(err, rows, fields) {
                if (err) {
                    reject(err);
                  } else {
                    if (!rows[0]) return resolve(undefined)
                    resolve(rows[0].maxinstance);
                  }
                });
            });
    }

}

function getUserById(id) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM user WHERE userid=${id}`, function(err, rows, fields) {
            if (err) {
                reject(err);
              } else {
                if (!rows[0]) return resolve(undefined)
                resolve(rows[0]);
              }
            });
        });
}

function getOwnerByInstance(id) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT userid FROM instance WHERE id='${id}'`, function(err, rows, fields) {
            if (err) {
                reject(err);
              } else {
                if (!rows[0]) return resolve(undefined)
                resolve(rows[0].userid);
              }
            });
        });
}

function createUser(id) {
    return pool.query(`INSERT INTO user (userid, maxinstance) VALUES ('${id}', '2')`)
}

function createInstance(id, userid, template, token, nodeid) {
    return pool.query(`INSERT INTO instance (id, userid, template, token, stats, node) VALUES ('${id}', '${userid}', '${template}', '${token}', 'running', '${nodeid}')`)
}

function setStats(id, stats) {
    return pool.query(`UPDATE instance SET stats='${stats}' WHERE id='${id}'`)
}

function getStats(id) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT stats FROM instance WHERE id='${id}'`, function(err, rows, fields) {
            if (err) {
                reject(err);
              } else {
                if (!rows[0]) return resolve(undefined)
                resolve(rows[0].stats);
              }
            });
        });
}

function isUserInstance(userid, id) {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT id FROM instance WHERE userid='${userid}' AND id='${id}'`, function(err, rows, fields) {
            if (err) {
                reject(err);
              } else {
                console.log(rows)
                if (!rows[0]) return resolve(false)
                resolve(true);
              }
            });
        });
}

function deleteInstance(id) {
    return pool.query(`DELETE FROM instance WHERE id='${id}'`)
}

function stopallprocess() {
    pool.query(`UPDATE instance SET stats='stopped'`)
}

function setToken(id,token) {
    pool.query(`UPDATE instance SET token='${token}' WHERE id ='${id}'`)
}


module.exports = {
    processlist,
    getInstance,
    getTotalInstances,
    getMaxInstances,
    createInstance,
    setStats,
    setToken,
    getStats,
    getOwnerByInstance,
    isUserInstance,
    deleteInstance,
    getUserInstance,
    stopallprocess
}