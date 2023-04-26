const express = require('express');
const config = require('../../config')
const host = "0.0.0.0", port = config.apiport;
const app = express()
async function startapi() {
    app.listen(port, () => {
    console.log(`[API] Started on http://0.0.0.0:${config.apiport}/`)
      });
}

app.get('/', (req, res) => {
    res.redirect('/help');
  });

app.get('/help', (req, res) => {
    const helpMessage = `
      <h1>Welcome to the API Page!</h1>
      <p>Available routes:</p>
      <ul>
        <li>
          <p><strong>GET /</strong></p>
          <p>Return main page</p>
        </li>
      </ul>
    `;
  
    res.send(helpMessage);
  });

module.exports = {
    startapi
}