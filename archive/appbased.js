const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const serverless = require('serverless-http');
const router = express.Router();
const encoding = require('encoding');
var bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 5000

const app = express()
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

// Static public files
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(cors());


app.get('/', function(req, res) {
  res.send('OpenSea API ready for Diddy Dinos!');
})

async function resolveMetadata(req) {
  try {
    const tokenId = parseInt(req.params.token_id).toString();
    const metadataURI = `https://diddydinos.blob.core.windows.net/metadata/${tokenId}.json`;
    const response = await fetch(metadataURI);
    if (response.status < 400) return response.json();
    return null;
  } catch (e) {
    return null;
  }
}

app.get('/test/:token_id', async function (req, res) {
  console.log('trying')
  const metadata = await resolveMetadata(req);
  if (metadata) res.send(metadata);
  else res.sendStatus(404);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})
//app.use(`/.netlify/functions/api`, router);
//app.use(`/.netlify/functions/api`);

module.exports = app;
module.exports.handler = serverless(app);
