const fs = require("fs");
const path = require("path");

function ReadFile(filepath)
{
    return fs.readFileSync(path.resolve(filepath));
}

module.exports = { ReadFile };