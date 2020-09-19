var fs = require('fs');
configPath = __dirname + "/config/db_info.json";
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
module.exports = parsed;