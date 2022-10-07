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

    getGrade() { return this.#grade; }

    getMaxGrade() { return this.#maxGrade; }

    toHTMLStr()
    {
        return "" + this.#grade + "/" + this.#maxGrade;
    }
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

    getName() { return this.#name; }

    getWeight() { return this.#weight; }

    getNumQuestions() { return this.#questions.length; }

    getQuestion(index) { return this.#questions[index]; }

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
}


class Database
{
    #assessments;

    constructor()
    {
        this.#assessments = new Array();
    }

    addAssessment(assessment)
    {
        this.#assessments.push(assessment);
    }

    loadFromFile(file)
    {
        this.#assessments = JSON.parse(file.read());
    }

    saveToFile(file)
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
window.onload = initializeDatabase;
