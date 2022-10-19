const fs = require("fs");
const util = require("../../src/Util.js");

const databaseFilepath = util.dataDirectory + "/database.json";
const guidFilepath = util.dataDirectory + "/GUID.json";
const accountsFilepath = util.dataDirectory + "/accounts.json";
let guidUsed = new Map();
var accounts = new Array();
let students = new Array();
const maxGUID = 999999;

// enum like const object used to differentiate between student accounts and teacher accounts
const AccountType = 
{
    Student: 0,
    Teacher: 1
};

// function responsible for hashing provided passwords
function HashPassword(password)
{
    let hash = 0;
    for (let i = 0; i < password.length; i++)
    {
        hash = (hash + Math.pow(password.charCodeAt(i), i + 1)) % 4093;
    }
    return hash;
}

function AddStudent(studentID)
{
    if (!students.includes(studentID))
    {
        students.push(studentID);
    }
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

class Account
{
    #username;
    #passwordHash; //for security reasons only store the password hash and not the password itself
    #userType; // keeps track of if the user is a teacher or a student
    #id; // either the student ID or the teacher's employee id depending on the user type

    constructor(username, passwordHash, userType, id)
    {
        this.#username = username;
        this.#passwordHash = passwordHash;
        this.#userType = userType;
        this.#id = id;

        if (this.#userType == AccountType.Student)
        {
            AddStudent(this.#id);
        }
    }

    GetID() { return this.#id; }

    GetUserType() { return this.#userType; }

    Validate(username, hashedPassword)
    {
        return username === this.#username && this.#passwordHash === hashedPassword;
    }

    ToJSONStr() 
    {
        return "{\"username\":\"" + this.#username + "\",\"passwordHash\":" 
            + this.#passwordHash + ",\"userType\":" + this.#userType + ",\"id\":" + this.#id + "}";
    }
}

class Question
{
    #maxGrade;

    constructor(maxGrade)
    {
        this.#maxGrade = maxGrade;
    }

    GetMaxGrade() { return this.#maxGrade; }

    ToJSONStr() { return "{\"maxGrade\":" + this.#maxGrade + "}"; }
}

class AssesmentResult
{
    //link assessment?
    #grades;
    //comments?

    constructor(grades)
    {
        this.#grades = Array.from(grades);
    }

    GetGrades() { return this.#grades; }

    static DefaultResult(numQuestions)
    {
        let grades = new Array();
        for (let i = 0; i < numQuestions; i++)
        {
            grades.push(0);
        }
        return new AssesmentResult(grades);
    }

    ToJSONStr()
    {
        let jsonStr = "{\"grades\":[";
        this.#grades.forEach(function(grade)
        {
            jsonStr += grade + ",";
        });

        if (this.#grades.length > 0)
        {
            jsonStr = jsonStr.slice(0, jsonStr.length - 1);
        }
        jsonStr += "]}";
        return jsonStr;
    }
}

class Assesment
{
    #name;
    #weight;
    #questions;
    #marks;

    constructor(name, weight, questions)
    {
        this.#name = name;
        this.#weight = weight;
        this.#questions = Array.from(questions);
        this.#marks = new Map();
        for (let i = 0; i < students.length; i++)
        {
            this.#marks.set(students[i], AssesmentResult.DefaultResult(this.#questions.length));
        }
    }

    GetName() { return this.#name; }

    GetWeight() { return this.#weight; }

    GetQuestions() { return this.#questions; }

    // returns undefined if the id provided is invalid
    GetMarks(id)
    {
        if (!IsGUIDValid(id))
        {
            return undefined;
        }
        return this.#marks[id];
    }

    SetMarks(id, marks)
    {
        if (IsGUIDValid(id))
        {
            this.#marks.set(id, marks);
        }
    }

    ToJSONStr() 
    {
        let jsonStr = "{ \"name\":\"" + this.#name + "\", \"weight\":" 
            + this.#weight + ", \"questions\": [";
        this.#questions.forEach(function(question)
        {
            jsonStr += question.ToJSONStr() + ",";
        });

        if (this.#questions.length > 0)
        {
            jsonStr = jsonStr.slice(0, jsonStr.length - 1);
        }

        jsonStr += "],\"marks\":[";

        this.#marks.forEach(function(grade, id)
        {
            jsonStr += "{\"id\":" + id + ",\"grade\":" + grade.ToJSONStr() + "},";
        });

        if (this.#marks.size > 0)
        {
            jsonStr = jsonStr.slice(0, jsonStr.length - 1);
        }
        jsonStr += "]}";
        return jsonStr;
    }
}

function LoadAccounts()
{
    console.log("Loading Accounts From File");
    
    // contains generic objects not Accounts
    let tempArr = JSON.parse(util.ReadFile(accountsFilepath));
    
    tempArr.forEach(function(account)
    {
        accounts.push(new Account(account.username, account.passwordHash, account.userType, account.id));
    });
}

function SaveAccounts()
{
    console.log("Saving Accounts To File");
    let data = "[";
    accounts.forEach(function(account)
    {
        data += account.ToJSONStr() + ",";
    });
    
    if (accounts.length > 0)
    {
        data = data.slice(0, data.length - 1);
    }
    
    data += "]";
    
    fs.writeFile(accountsFilepath, data, function(err)
    {
        if (err)
        {
            console.error(err);
        }
    });
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

    // returns undefined if the id provided is invalid
    GetUserType(id) 
    {
        let account = accounts.find(function(account)
        {
            return account.GetID() == id;
        });

        if (account == undefined)
        {
            return undefined;
        }
        return account.GetUserType();
    }

    LoadFromFile()
    {
        console.log("Loading Database From File");
        
        LoadAccounts();
        LoadGUIDs();

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

            let assessmentRead = new Assesment(obj.name, obj.weight, questions);

            let marks = Array.from(obj.marks);
            marks.forEach(function(mark)
            {
                assessmentRead.SetMarks(mark.id, new AssesmentResult(mark.grade));
            });

            newArr.push(assessmentRead);
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
        
        SaveAccounts();
        SaveGUIDs();
        
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

// class used to query different parts of the database
class User
{
    #id;
    #database;

    constructor(id)
    {
        this.#id = id;
        this.#database = database;
    }

    IsValid() { return IsGUIDValid(this.#id); }

    // returns undefined if this User object is invalid
    GetType() { return this.#database.GetUserType(this.#id); }

    //returns undefined if the User is invalid or if the user is a teacher
    GetGradesForAssessment(assessment)
    {
        if (this.GetType() == AccountType.Teacher)
        {
            return undefined;
        }
        return assessment.GetMarks(this.#id);
    }
}

function InitializeDefaultStaticAccounts()
{
    accounts.push(new Account("teacher", HashPassword("teacher"), 
    AccountType.Teacher, GenerateGUID()));
    accounts.push(new Account("student", HashPassword("student"), 
    AccountType.Student, GenerateGUID()));
    
    SaveGUIDs();
}

function InitializeAccounts()
{
    console.log("Initializing accounts");
    if (fs.existsSync(accountsFilepath))
    {
        LoadAccounts();
    }
    else
    {
        console.log("Generating Default Account Data");
        
        if (!fs.existsSync(util.dataDirectory))
        {
            fs.mkdirSync(util.dataDirectory);
        }
        
        InitializeDefaultStaticAccounts();
        SaveAccounts();
    }
}

function InitializeDatabase()
{   
    if (fs.existsSync(guidFilepath))
    {
        LoadGUIDs();
    }

    InitializeAccounts();

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

// returns a User object or undefined if no valid account was found
function OnLogin(form)
{
    let username = form.username;
    let passwordHash = HashPassword(form.password);
    let accountToLogin = accounts.find(function (account)
    {
        return account.Validate(username, passwordHash)
    });

    if (accountToLogin == undefined)
    {
        return undefined;
    }

    return new User(accountToLogin.GetID());
}

module.exports = { database, Database, Question, Assesment, Account, User, AccountType, 
    InitializeDatabase, GenerateGUID, IsGUIDValid, SaveGUIDs, OnLogin };