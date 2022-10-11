// Classes //////////////////////////////////////////////////
class Question
{
    #grade;
    #maxGrade;

    constructor(grade, maxGrade)
    {
        this.#grade = grade;
        this.#maxGrade = maxGrade;
    }

    GetGrade() { return this.#grade; }

    GetMaxGrade() { return this.#maxGrade; }

    /*
    toHTMLStr()
    {
        return "" + this.#grade + "/" + this.#maxGrade;
    }*/
}

class Assesment
{
    #name;
    #weight;
    #questions;

    constructor(name, weight, questions)
    {
        this.#name = name;
        this.#weight = weight;
        this.#questions = Array.from(questions);
    }

    GetName() { return this.#name; }

    GetWeight() { return this.#weight; }

    GetQuestions() { return this.#questions; }

    /*
    toHTMLStr()
    {

        var htmlStr = "<p>" + this.#name + "</p><ul>";
        this.#questions.forEach(function(question)
        {
            htmlStr += "<li>"+ question.toHTMLStr() + "</li>";
        });

        htmlStr += "</ul>";
        return htmlStr;
    }
    */
}


class Database
{
    #assessments;

    constructor()
    {
        this.#assessments = new Array();
    }

    AddAssessment(assessment)
    {
        this.#assessments.push(assessment);
    }

    RemoveAssessment(index)
    {
        this.#assessments.splice(index, 1);
    }

    GetAssessments() { return this.#assessments; }

    LoadFromFile(file)
    {
        this.#assessments = JSON.parse(file.read());
    }

    SaveToFile(file)
    {
        file.write(JSON.stringify(this.#assessments));
    }

    appendAssessmentToHTMLBody(index)
    {
        document.getElementById("body").innerHTML += this.#assessments[index].toHTMLStr();
    }

    appendAllAssessmentsToHTMLBody()
    {
        for (var i = 0; i < this.#assessments.length; i++)
        {
            this.appendAssessmentToHTMLBody(i);
        }
    }
}

// global variables /////////////////////////////////////////////
const databaseFilepath = "database.json";
var database;

module.exports = {database};

// functions ///////////////////////////////////////////////////

function initializeDatabase()
{
    database = new Database();
    var databaseFile = new File([], databaseFilepath);

    //need to figure out how to read/write to/from files on server

    //if (databaseFile.exists())
    {
        //database.loadFromFile(databaseFile);
    }
    //else
    {
        //database.saveToFile(databaseFile);
        
        //temporary initialization
        var arr = [new Question(4, 6), new Question(6, 10), new Question(10, 25)];
        database.addAssessment(new Assesment("quizzes", 50, arr));

        arr = [new Question(5, 5), new Question(6, 8), new Question(10, 10), new Question(6, 7)];
        database.addAssessment(new Assesment("reflection essay", 30, arr));
    }

    database.appendAllAssessmentsToHTMLBody();
}


// script code
//window.onload = initializeDatabase;

const http = require("http");
const fs = require("fs");
const path = require("path");
const route = require("url");
const querystring = require("querystring");
const login = require("../src/login.js")

function ReadFile(filepath)
{
    return fs.readFileSync(path.resolve(filepath));
}

function ServerRequestListener(request, response)
{
    let p = route.parse(request.url, true);
    
    if (request.method === "GET")
    {
        switch(request.url)
        {
            case "/":
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                response.end(ReadFile("../src/index.html"));
                break;

            case "/index.css":
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/css');
                response.end(ReadFile("../src/index.css"));
                break;

            case "/login.js":
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/js');
                response.end(ReadFile("../src/login.js"));
                break;

            case "/teacher.html?":
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                response.end(ReadFile("../src/teacher.html"));
                break;

            case "/student.html?":
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                response.end(ReadFile("../src/student.html"));
                break;

            default:
                response.statusCode = 404;
                response.setHeader('Content-Type', 'text/plain');
                response.end("Unknown Webpage: " + request.url);
                break;
        }
        console.log("using get");
    }
    else if (request.method === "POST" || request.method === "PUT")
    {
        var rawData = "";
        request.on("data", function(data)
        {
            rawData += data;
        }).on("end", function()
        {
            let form = querystring.parse(rawData);
            let account = login.OnLogin(form);
            if (account != undefined)
            {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/plain');
                response.end(account.GetUserType());
            }
            else
            {
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/html');
                response.end("<!DOCTYPE html><html><head></head><body><p>Wrong username/password</p><p>username: " + form.username + "<br/>password: " + form.password + "</p></body></html>");
            }
        });
    }
}

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(ServerRequestListener);

server.listen(port, hostname);