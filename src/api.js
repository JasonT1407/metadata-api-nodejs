const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const axios = require('axios');
const serverless = require('serverless-http');
const router = express.Router();
const encoding = require('encoding');
var bodyParser = require('body-parser');
const cors = require('cors');
//var enforce = require('express-sslify');

const PORT = process.env.PORT || 5000

const app = express()
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

app.use(bodyParser.json());
app.use(cors());
// remove until ssl bought
//app.use(enforce.HTTPS({ trustProtoHeader: true }))

router.get('/', function(req, res) {
  res.send('This API works!');
})

async function resolveMetadata(req) {
  try {
    const tokenId = parseInt(req.params.token_id).toString();
    const metadataURI = `https://diddydinos.blob.core.windows.net/metadata/${tokenId}.json`;
    const response = await axios(metadataURI);
    console.log(response);
    if (response.status < 400) return response.data;
    return null;
  } catch (e) {
    return null;
  }
}

router.get('/test', function(req, res) {
  res.send('This test page works!');
})

router.get('/:token_id', async function (req, res) {
  const metadata = await resolveMetadata(req);
  if (metadata) res.send(metadata);
//unauthorized
//  else res.sendStatus(401);
// not found
// else res.sendStatus(401);
// easter egg
else res.sendStatus(418);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})

app.use(`/`, router);

module.exports = app;
module.exports.handler = serverless(app);