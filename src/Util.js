const fs = require("fs");
const path = require("path");
const dataDirectory = "../../data";

function ReadFile(filepath)
{
    return fs.readFileSync(path.resolve(filepath));
}

function WriteToFile(filepath, data)
{
    fs.writeFile(filepath, data, function(err)
    {
        if (err)
        {
            console.error(err);
        }
    });
}

function GenerateHTMLHeader()
{
    return "<!DOCTYPE html><html>";
}

function GenerateHTMLFooter()
{
    return "</html>";
}

module.exports = { ReadFile, WriteToFile, GenerateHTMLHeader, GenerateHTMLFooter, dataDirectory };