const http = require("http");
const route = require("url");
const querystring = require("querystring");
const student = require("../src/Student.js");
const teacher = require("../src/Teacher.js");
const util = require("../src/Util.js");
const database = require("../src/Database.js");

function GeneratePage(request, response, user, url)
{
    if (url[0] == "/")
    {
        url = url.slice(1);
    }
    let currPos = url.indexOf("/");
    let nextDir = url.slice(0, currPos);
    url = url.slice(currPos + 1);
    currPos = url.indexOf("/");
    if (nextDir.valueOf() == "student")
    {
        if (currPos == -1)
        {
            nextDir = url;
        }
        else
        {
            nextDir = url.slice(0, currPos);
            url = url.slice(currPos + 1);
            currPos = url.indexOf("/");
        }

        switch(nextDir)
        {
            case "home":
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                response.end(student.LoadStudentHomePage(user));
                break;

            // temporary code for demonstration purposes
            case "test":
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                response.end("<!DOCTYPE html><html><head></head><body><p>student page generated</p>"
                    + "<input type = \"button\" onclick = \"window.location.href=\'/student/home/" 
                    + user.GetID() +  "\'\" value = \"Go to Test Page\"></body></html>");
                break;
            /////////////////////////////////////////////////

            default:
                response.statusCode = 404;
                response.setHeader('Content-Type', 'text/plain');
                response.end("Unknown resource: " + request.url);
                break;
        }
    }
    else if (nextDir == "teacher")
    {
        if (currPos == -1)
        {
            nextDir = url;
        }
        else
        {
            nextDir = url.slice(0, currPos);
            url = url.slice(currPos + 1);
            currPos = url.indexOf("/");
        }

        switch(nextDir)
        {
            case "home":
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                response.end(teacher.LoadTeacherHomePage(user));
                break;

            default:
                response.statusCode = 404;
                response.setHeader('Content-Type', 'text/plain');
                response.end("Unknown Webpage: " + request.url);
                break;
        }
    }
    else
    {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        response.end("Unknown Webpage: " + request.url);
    }
}

function HandleGetRequest(request, response)
{
    let indexLastSlash = request.url.lastIndexOf("/");
    let id = parseInt(request.url.slice(indexLastSlash + 1));
    if (isNaN(id))
    {
        switch(request.url)
        {
            case "/":
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                response.end(util.ReadFile("../../src/index.html"));
                break;

            case "/index.css":
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/css');
                response.end(util.ReadFile("../../src/index.css"));
                break;

            default:
                console.log("Unknown Webpage: " + request.url);
                response.statusCode = 404;
                response.setHeader('Content-Type', 'text/plain');
                response.end("Unknown Webpage: " + request.url);
                break;
        }
    }
    else
    {
        GeneratePage(request, response, new database.User(id), 
            request.url.slice(0, indexLastSlash));
    }
}

function HandleLoginRequest(request, response, form)
{
    console.log("handling logging request");
    let user = database.OnLogin(form);
            
    if (user != undefined)
    {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        switch(user.GetType())
        {
            case database.AccountType.Student:
                GeneratePage(request, response, user, "/student/home");
                break;

            case database.AccountType.Teacher:
                GeneratePage(request, response, user, "/teacher/home");
                break;

            default:
                response.statusCode = 404;
                response.end("<!DOCTYPE html><html><head></head><body><p>Unknown account type detected: " 
                    + user.GetType() + "</p></body></html>");
                break;
        }
    }
    else
    {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        response.end("<!DOCTYPE html><html><head></head><body><p>Wrong username/password</p><p>username: " + form.username + "<br/>password: " + form.password + "</p></body></html>");
    }
}

function HandlePostRequest(request, response)
{
    var rawData = "";
    request.on("data", function(data)
    {
        rawData += data;
    });
    request.on("end", function()
    {
        let form = querystring.parse(rawData);

        switch (form.formType)
        {
            case "login":
                HandleLoginRequest(request, response, form);
                break;

            default:
                response.statusCode = 404;
                response.setHeader('Content-Type', 'text/plain');
                if (form.formType == undefined)
                {
                    response.end("No form type provided");
                }
                else
                {
                    response.end("Unknown form: " + form.formType);
                }
                break;
        }
    });
}

function ServerRequestListener(request, response)
{
    let p = route.parse(request.url, true);
    
    if (request.method === "GET")
    {
        HandleGetRequest(request, response);
    }
    else if (request.method === "POST" || request.method === "PUT")
    {
        HandlePostRequest(request, response);
    }
}

const hostname = '127.0.0.1';
const port = 3000;

database.InitializeDatabase();
const server = http.createServer(ServerRequestListener);
console.log("\n\nServer Initialization Complete\n");

server.listen(port, hostname);