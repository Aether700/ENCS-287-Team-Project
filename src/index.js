const database = require("../src/Database.js");
const util = require("../src/Util.js");

function UsernamesToStr(usernames)
{
    let outputStr = "";
    for (let i = 0; i < usernames.length; i++)
    {
        outputStr += "\"" + usernames.at(i) + "\"";
        if (i != usernames.length - 1)
        {
            outputStr += ", ";
        }
    }
    return outputStr
}

function LoadIndexClientJs(hostname, port, usernames)
{
    let src = util.GenerateClientSideFunctionSendPostForm(hostname, port) + "\n";
    src += "const usernamesInUse = [" + UsernamesToStr(usernames) + "];\n\n";
    src += "function WriteToOutput(str)\n";
    src += "{\n";
    src += "    document.getElementById(\"AccountCreationOutput\").innerText = str;\n";
    src += "}\n\n";
    
    src += "function ValidatePassword(password)\n";
    src += "{\n";
    src += "    const minNumCharacters = 7;\n";
    src += "    if (password.length < minNumCharacters)\n";
    src += "    {\n";
    src += "        WriteToOutput(\"Please enter a password containing at least \"";
    src +=              " +  minNumCharacters + \" characters\");\n";
    src += "        return false;\n";
    src += "    }\n";
    src += "    return true;\n";
    src += "}\n\n";
    
    src += "function ValidateUsername(username)\n";
    src += "{\n";
    
    src += "    if (username == \"\" || username == undefined)\n";
    src += "    {\n";
    src += "        WriteToOutput(\"Please enter a username\");\n";
    src += "        return false;\n";
    src += "    }\n\n";
    
    src += "    if (usernamesInUse.includes(username))\n";
    src += "    {\n";
    src += "        WriteToOutput(\"This username is already used by another user. ";
    src +=                "Please enter another one\");\n";
    src += "        return false;\n";
    src += "    }\n";
    src += "    return true;\n";
    src += "}\n\n";
    
    src += "function HandleAccountCreation()\n";
    src += "{\n";
    src += "    let form = document.getElementById(\"createAccountForm\");\n";
    src += "    let object = {\n";
    src += "        formType: form.formType.value,\n";
    src += "        userType: form.userType.value,\n";
    src += "        username: form.username.value,\n";
    src += "        password: form.password.value,\n";
    src += "        passwordReEntered: form.passwordReEntered.value\n";
    src += "    };\n\n";
    
    src += "    if (object.userType != \"Student\" && object.userType != \"Teacher\")\n";
    src += "    {\n";
    src += "        WriteToOutput(\"Please indicate whether you are a student or a teacher\");\n";
    src += "        return;\n";
    src += "    }\n\n";
        
    src += "    if (!ValidateUsername(object.username))\n";
    src += "    {\n";
    src += "        return;\n";
    src += "    }\n\n";
        
    src += "    if (object.password != object.passwordReEntered)\n";
    src += "    {\n";
    src += "        WriteToOutput(\"The two passwords entered do not match\");\n";
    src += "        return;\n";
    src += "    }\n\n";
    
    src += "    if (ValidatePassword(object.password))\n";
    src += "    {\n";
    src += "        SendFormPost(object, function(event)\n";
    src += "        {\n";
    src += "            WriteToOutput(\"Account Created\");\n";
    src += "            usernamesInUse.push(object.username);\n";
    src += "        });\n";
    src += "    }\n";
    src += "}";

    return src;
}

module.exports = { LoadIndexClientJs };


/*
========================================================================================
function SendFormPost(form, onLoadCallback, onErrorCallback)
{
    let request = new XMLHttpRequest();
    let urlPairs = [];
    for (let [name, value] of Object.entries(form))
    {
        urlPairs.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
    }
    
    let urlEncodedData = urlPairs.join('&').replace(/%20/, '+');
    
    request.addEventListener("load", onLoadCallback);
    
    if (onErrorCallback == undefined)
    {
        onErrorCallback = function()
        {
            alert("An error occured");
        };
    }

    request.addEventListener("error", onErrorCallback);
    
    request.open('POST', '127.0.0.1:3000');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(urlEncodedData);
}

// writes the provided string to the account creation output paragraph
function WriteToOutput(str)
{
    document.getElementById("AccountCreationOutput").innerText = str;
}

// returns true if the password is valid, false otherwise. The function will 
// also output any error message using the WriteToOutput function
function ValidatePassword(password)
{
    const minNumCharacters = 7;
    if (password < minNumCharacters)
    {
        WriteToOutput("Please enter a password containing at least "+  minNumCharacters + " characters");
        return false;
    }
    return true;
}

// returns true if the username is valid, false otherwise. The function will 
// also output any error message using the WriteToOutput function
function ValidateUsername(username)
{
    const usernamesInUse = ["student", "student2", "teacher"];

    if (username == "" || username == undefined)
    {
        WriteToOutput("Please enter a username");
        return false;
    }

    if (usernamesInUse.includes(username))
    {
        WriteToOutput("This username is already used by another user. Please enter another one");
        return false;
    }
    return true;
}

function HandleAccountCreation()
{
    let form = document.getElementById("createAccountForm");
    let object = {
        formType: form.formType.value,
        userType: form.userType.value,
        username: form.username.value,
        password: form.password.value,
        passwordReEntered: form.passwordReEntered.value
    };

    if (object.userType != "Student" && object.userType != "Teacher")
    {
        WriteToOutput("Please indicate whether you are a student or a teacher");
        return;
    }
    
    if (!ValidateUsername(object.username))
    {
        return;
    }
    
    if (object.password != object.passwordReEntered)
    {
        WriteToOutput("The two passwords entered do not match");
        return;
    }

    if (ValidatePassword(object.password))
    {
        SendFormPost(object, function(event)
        {
            console.log("temp: loading successful");
        });
        WriteToOutput("Account Created");
    }
}
*/
