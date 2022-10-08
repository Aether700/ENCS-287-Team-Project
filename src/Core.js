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

function ReadFile(filepath)
{
    return fs.readFileSync(path.resolve(filepath));
}

function ServerRequestListener(request, response)
{
    response.statusCode = 200;
    if (request.url === "/")
    {
        //response.setHeader('Content-Type', 'text/html');
        response.setHeader('Content-Type', 'text/plain');
        let html = ReadFile("../src/index.html");
        //response.write();  
        //response.end();
        if (html != undefined)
        {
            //response.end("<!DOCTYPE html>\n\n<html><head></head><body><p>Webpage loaded successfully</p></body></html>");
            response.end(html);
        }
        else
        {
            response.end("<!DOCTYPE html><html><head></head><body><p>Error loading webpage</p></body></html>");
        }
    }
    else
    {
        response.setHeader('Content-Type', 'text/plain');
        response.end("other webpage");
    }
}

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(ServerRequestListener);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});