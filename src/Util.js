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

function GenerateClientSideFunctionSendPostForm(hostname, port)
{
    return ""
        + "function SendFormPost(form, onLoadCallback, onErrorCallback)\n"
        + "{\n"
        + "   let request = new XMLHttpRequest();\n"
        + "   let urlPairs = [];\n"
        + "   for (let [name, value] of Object.entries(form))\n"
        + "   {\n"
        + "       urlPairs.push(encodeURIComponent(name) + \"=\" + encodeURIComponent(value));\n"
        + "   }\n\n"
 
        + "   let urlEncodedData = urlPairs.join(\"&\").replace(/%20/, \"+\");\n\n"
      
        + "   request.addEventListener(\"load\", onLoadCallback);\n\n"
        
        + "   if (onErrorCallback == undefined)\n"
        + "   {\n"
        + "       onErrorCallback = function()\n"
        + "       {\n"
        + "           alert(\"An error occured\");\n"
        + "       };\n"
        + "   }\n\n"
          
        + "   request.addEventListener(\"error\", onErrorCallback);\n\n"
              
        + "   request.open(\"POST\", \"" + hostname + ":" + port + "\");\n"
        + "   request.setRequestHeader(\"Content-Type\", \"application/x-www-form-urlencoded\");\n"
        + "   request.send(urlEncodedData);\n"
        + "}\n";
}

module.exports = { 
    ReadFile, WriteToFile, GenerateHTMLHeader, 
    GenerateHTMLFooter, GenerateClientSideFunctionSendPostForm,
    dataDirectory };