const http = require("http");
const route = require("url");
const querystring = require("querystring");
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
            response.end(util.ReadFile("../../src/index.html"));
            break;

        case "/index.css":
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/css');
            response.end(util.ReadFile("../../src/index.css"));
            break;

        case "/css/teacher.css":
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/css');
            response.end(util.ReadFile("../../src/css/teacher.css"));
            break;
        
        // temporary for demo
        case "/student.html":
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html');
            response.end(util.ReadFile("../../src/student.html"));
            break;

        case "/style.css":
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/css');
            response.end(util.ReadFile("../../src/style.css"));
            break;

        case "/teacher.html":
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html');
            response.end(util.ReadFile("../../src/teacher.html"));
            break;

        case "/teacherGradeDisplay.html":
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html');
            response.end(util.ReadFile("../../src/teacherGradeDisplay.html"));
            break;

        case "/teacherAddAssessment.html":
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html');
            response.end(util.ReadFile("../../src/teacherAddAssessment.html"));
            break;
        ////////////////////////////////

        default:
            console.log("Unknown Webpage: " + request.url);
            response.statusCode = 404;
            response.setHeader('Content-Type', 'text/plain');
            response.end("Unknown Webpage: " + request.url);
            break;
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
                response.end(student.LoadStudentPage(user));
                break;

            case database.AccountType.Teacher:
                response.end(teacher.LoadTeacherPage(user));
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

database.InitializeDatabase();
const server = http.createServer(ServerRequestListener);
console.log("\n\nServer Initialization Complete\n");

server.listen(port, hostname);
