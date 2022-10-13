const fs = require("fs");
const path = require("path");
const dataDirectory = "../data";

function ReadFile(filepath)
{
    return fs.readFileSync(path.resolve(filepath));
}

function GenerateHTMLHeader()
{
    return "<!DOCTYPE html><html>";
}

function GenerateHTMLFooter()
{
    return "</html>";
}

module.exports = { ReadFile, GenerateHTMLHeader, GenerateHTMLFooter, dataDirectory };