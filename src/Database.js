const fs = require("fs");
const util = require("../src/Util.js");

const databaseDirectory = "../data";
const databaseFilepath = databaseDirectory + "/database.json";

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

    ToJSONStr() { return "{ \"#grade\":" + this.#grade + ", \"#maxGrade\":" + this.#maxGrade + "}"; }
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

    ToJSONStr() 
    {
        let jsonStr = "{ \"#name\":\"" + this.#name + "\", \"#weight\":" + this.#weight + ", \"#question\": [";
        this.#questions.forEach(function(question)
        {
            jsonStr += question.ToJSONStr() + ",";
        });

        console.log("questions length: " + this.#questions.length);
        if (this.#questions.length > 0)
        {
            jsonStr = jsonStr.slice(0, jsonStr.length - 1);
        }

        jsonStr += "]}";
        return jsonStr;
    }
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

    LoadFromFile()
    {
        console.log("Loading Database From File");
        this.#assessments = JSON.parse(util.ReadFile(databaseFilepath));
    }

    SaveToFile()
    {
        console.log("Saving Database To File");
        let data = "[";
        this.#assessments.forEach(function(assessment)
        {
            data += assessment.ToJSONStr() + ",";
        });

        console.log("assessments length: " + this.#assessments.length);
        if (this.#assessments.length > 0)
        {
            data = data.slice(0, data.length - 1);
        }

        data += "]";
        
        fs.writeFile(databaseFilepath, data, function(err)
        {
            if (err)
            {
                console.error(err);
            }
        });
    }
}

var database = new Database();

function InitializeDatabase()
{
    if (fs.existsSync(databaseFilepath))
    {
        database.LoadFromFile();
    }
    else
    {
        console.log("Generating New Database");
        
        if (!fs.existsSync(databaseDirectory))
        {
            fs.mkdirSync(databaseDirectory);
        }

        //temporary initialization
        var arr = [new Question(4, 6), new Question(6, 10), new Question(10, 25)];
        database.AddAssessment(new Assesment("quizzes", 50, arr));
        
        arr = [new Question(5, 5), new Question(6, 8), new Question(10, 10), new Question(6, 7)];
        database.AddAssessment(new Assesment("reflection essay", 30, arr));
        //////////////////////////////////////

        database.SaveToFile();
    }
}

module.exports = { database, Database, Question, Assesment, InitializeDatabase };