const http = require("http");
const route = require("url");
const querystring = require("querystring");
const login = require("./Login.js");
const student = require("../src/Student.js");
const teacher = require("../src/Teacher.js");
const util = require("../src/Util.js");
const database = require("../src/Database.js");

function HandleGetRequest(request, response)
{
    switch(request.url)
    {
        case "/":
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html');
            response.end(util.ReadFile("../src/index.html"));
            break;

        case "/index.css":
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/css');
            response.end(util.ReadFile("../src/index.css"));
            break;

        case "/login.js":
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/js');
            response.end(util.ReadFile("../src/login.js"));
            break;

        default:
            response.statusCode = 404;
            response.setHeader('Content-Type', 'text/plain');
            response.end("Unknown Webpage: " + request.url);
            break;
    }
}

function HandleLoginRequest(request, response, form)
{
    console.log("handling logging request");
    let account = login.OnLogin(form);
            
    if (account != undefined)
    {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        switch(account.GetUserType())
        {
            case login.AccountType.Student:
                response.end(student.LoadStudentPage(account));
                break;

            case login.AccountType.Teacher:
                response.end(teacher.LoadTeacherPage(account));
                    break;

            default:
                response.statusCode = 404;
                response.end("<!DOCTYPE html><html><head></head><body><p>Unknown account type detected</p></body></html>");
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
        HandleLoginRequest(request, response, form);
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

login.InitializeAccounts();
database.InitializeDatabase();
const server = http.createServer(ServerRequestListener);

server.listen(port, hostname);