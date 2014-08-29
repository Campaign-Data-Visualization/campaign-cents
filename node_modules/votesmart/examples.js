var VoteSmart = require('./votesmart');

// Load apiKey from config.json - you can replace this code and manually set your API key here
var nconf = require('nconf');
nconf.use('file', { file: './config.json' });
nconf.load();
var apiKey = nconf.get('apiKey');

var votesmart = new VoteSmart(apiKey);

// votesmart.candidateBio('26732', function(err, json) {
//   if (err) throw err;
//   console.log(json);
// });

// votesmart.npat('26732', function(err, json) {
//   if (err) throw err;
//   // console.log(json);
//   json.npat.section.forEach(function(e) {
//     console.log(e);
//   })
// });