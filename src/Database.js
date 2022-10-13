const fs = require("fs");
const util = require("../src/Util.js");

const databaseFilepath = util.dataDirectory + "/database.json";
const guidFilepath = util.dataDirectory + "/GUID.json";
let guidUsed = undefined;
const maxGUID = 999999;

function SaveGUIDs()
{
    console.log("Saving GUIDs");
    data = "[";
    guidUsed.forEach(function(key, value)
    {
        data += key + ",";
    });

    if (guidUsed.size > 0)
    {
        data = data.slice(0, data.length - 1);
    }
    data += "]";
    util.WriteToFile(guidFilepath, data); 
}

function LoadGUIDs()
{
    console.log("Loading GUIDs");
    let dataArr = JSON.parse(util.ReadFile(guidFilepath));
    dataArr.forEach(function(guid)
    {
        guidUsed.set(guid, guid);
    });
}

// returns a unique random number between 0 and maxGUID or -1 if the database has not been initialized yet
function GenerateGUID()
{
    if (guidUsed == undefined)
    {
        return -1;
    }

    let tentativeID = Math.floor(Math.random() * maxGUID);
    while (guidUsed.has(tentativeID))
    {
        tentativeID = Math.floor(Math.random() * maxGUID);
    }

    guidUsed.set(tentativeID, tentativeID);
    return tentativeID;
}

function IsGUIDValid(guid)
{
    return guidUsed.has(guid);
}

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

    ToJSONStr() { return "{ \"grade\":" + this.#grade + ", \"maxGrade\":" + this.#maxGrade + "}"; }
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
        let jsonStr = "{ \"name\":\"" + this.#name + "\", \"weight\":" + this.#weight + ", \"questions\": [";
        this.#questions.forEach(function(question)
        {
            jsonStr += question.ToJSONStr() + ",";
        });

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
    #assesments;

    constructor()
    {
        this.#assesments = new Array();
    }

    AddAssessment(assesment)
    {
        this.#assesments.push(assesment);
    }

    RemoveAssessment(index)
    {
        this.#assesments.splice(index, 1);
    }

    GetAssessments() { return this.#assesments; }

    LoadFromFile()
    {
        console.log("Loading Database From File");
        
        // contains generic objects not Assessments
        let tempArr = JSON.parse(util.ReadFile(databaseFilepath));
        
        let newArr = new Array();
        
        tempArr.forEach(function(obj)
        {
            let tempQuestionArr = Array.from(obj.questions);
            let questions = new Array();
            tempQuestionArr.forEach(function(questionObj)
            {
                questions.push(new Question(questionObj.grade, questionObj.maxGrade));
            });
            newArr.push(new Assesment(obj.name, obj.weight, questions));
        });

        this.#assesments = Array.from(newArr);
    }

    SaveToFile()
    {
        console.log("Saving Database To File");
        if (!fs.existsSync(util.dataDirectory))
        {
            fs.mkdirSync(util.dataDirectory);
        }
        
        let data = "[";
        this.#assesments.forEach(function(assesment)
        {
            data += assesment.ToJSONStr() + ",";
        });
        
        if (this.#assesments.length > 0)
        {
            data = data.slice(0, data.length - 1);
        }
        
        data += "]";
        
        util.WriteToFile(databaseFilepath, data);
    }
}

var database = new Database();


function InitializeDatabase()
{
    guidUsed = new Map();
    
    if (fs.existsSync(guidFilepath))
    {
        LoadGUIDs();
    }

    if (fs.existsSync(databaseFilepath))
    {
        database.LoadFromFile();
    }
    else
    {
        console.log("Generating New Database");
        //temporary initialization
        
        var arr = [new Question(4, 6), new Question(6, 10), new Question(10, 25)];
        database.AddAssessment(new Assesment("quizzes", 50, arr));
        
        arr = [new Question(5, 5), new Question(6, 8), new Question(10, 10), new Question(6, 7)];
        database.AddAssessment(new Assesment("reflection essay", 30, arr));
        //////////////////////////////////////

        database.SaveToFile();
    }
}

module.exports = { database, Database, Question, Assesment, 
    InitializeDatabase, GenerateGUID, IsGUIDValid, SaveGUIDs };