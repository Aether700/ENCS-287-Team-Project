const fs = require("fs");
const util = require("../src/Util.js");

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

    GetUsername() { return this.#username; }

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

class AssessmentResult
{
    //link assessment?
    #grades;
    //comments?

    constructor(grades)
    {
        this.#grades = Array.from(grades);
    }

    GetGrade()
    {
        let sum = 0;
        this.#grades.forEach(function(mark)
        {
            sum += mark;
        });
        return sum;
    }

    GetQuestionGrades() { return this.#grades; }

    static DefaultResult(numQuestions)
    {
        let grades = new Array();
        for (let i = 0; i < numQuestions; i++)
        {
            grades.push(0);
        }
        return new AssessmentResult(grades);
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

class Assessment
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
            this.#marks.set(students[i], AssessmentResult.DefaultResult(this.#questions.length));
        }
    }

    GetName() { return this.#name; }

    GetWeight() { return this.#weight; }

    GetQuestions() { return this.#questions; }

    //returns a Map object with the id as key and the total grade for the assessment as value
    GetTotals()
    {
        let totals = new Map();
        this.#marks.forEach(function(result, id)
        {
            totals.set(id, result.GetGrade());
        });
        return totals;
    }

    GetAverage()
    {
        let sum = 0;
        this.#marks.forEach(function(result)
        {
            sum += result.GetGrade();
        });
        return sum / this.#marks.size;
    }

    GetMedian()
    {
        let orderedArr = new Array();
        this.#marks.forEach(function(result, id)
        {
            // add grade to ordered list
            orderedArr.push(result.GetGrade());
        });

        orderedArr.sort(function(a, b) { return  a - b; });
        
        if (orderedArr.length % 2 == 0)
        {
            
            let lowestIndex = Math.floor((orderedArr.length - 1) / 2);
            let highestIndex = lowestIndex + 1;

            let lowestResult = orderedArr.at(lowestIndex);
            let highestResult = orderedArr.at(highestIndex);

            return (lowestResult + highestResult) / 2;
        }
        else
        {
            return orderedArr.at((orderedArr.length - 1) / 2);
        }
    }

    GetStandardDeviation()
    {
        let mean = this.GetAverage();
        let sum = 0;
        let numDataPoints = this.#marks.size;

        this.#marks.forEach(function(results, id)
        {
            sum += Math.pow(results.GetGrade() - mean, 2);
        });

        return Math.sqrt(sum / numDataPoints);
    }

    GetMaxGrade()
    {
        let sum = 0;
        this.#questions.forEach(function (question)
        {
            sum += question.GetMaxGrade();
        });
        return sum;
    }

    GetQuestionAverage(questionIndex)
    {
        let sum = 0;
        this.#marks.forEach(function(results)
        {
            sum += results.GetQuestionGrades()[questionIndex];
        });
        return sum / this.#marks.size;
    }

    // returns a map with the grades as key and the number of students as elements
    GetDistribution()
    {
        let distribution = new Map();
        this.#marks.forEach(function (mark, id)
        {
            let grade = mark.GetGrade();
            if (distribution.has(grade))
            {
                distribution[grade] = distribution[grade] + 1;
            }
            else
            {
                distribution.set(grade, 1);
            }
        });
        return distribution;
    }

    // returns undefined if the id provided is invalid
    GetGrades(id)
    {
        if (!IsGUIDValid(id))
        {
            return undefined;
        }

        return this.#marks.get(id);
    }

    SetGrades(id, marks)
    {
        if (IsGUIDValid(id))
        {
            this.#marks.set(id, marks);
        }
    }

    ComputeRankPercentileOfStudent(studentID)
    {
        if (!IsGUIDValid(studentID) || new User(studentID).GetType() != AccountType.Student)
        {
            return;
        }

        let distribution = this.GetDistribution();
        let studentGrade = this.#marks.get(studentID).GetGrade();

        let cummulative = 0;
        let frequencyOfStudentGrade = 0;
        distribution.forEach(function(numStudents, grade)
        {
            if (grade < studentGrade)
            {
                cummulative += numStudents;
            }
            else if (grade == studentGrade)
            {
                frequencyOfStudentGrade = numStudents;
            }
        });

        return ((cummulative + (0.5 * frequencyOfStudentGrade)) / students.length) * 100;
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
    #assessments;
    #letterGrades; // key: student id, value: letter grade as string

    constructor()
    {
        this.#assessments = new Array();
        this.#letterGrades = new Map();
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

    GetUsernames()
    {
        let usernameArr = [];
        accounts.forEach(function (account)
        {
            usernameArr.push(account.GetUsername());
        });
        return usernameArr;
    }

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

    GetLetterGrade(id)
    {
        if (!IsGUIDValid(id) || this.GetUserType(id) != AccountType.Student || !this.#letterGrades.has(id))
        {
            return undefined;
        }
        return this.#letterGrades.get(id);
    }

    SetLetterGrade(id, letterGrade)
    {
        if (!IsGUIDValid(id) || this.GetUserType(id) != AccountType.Student)
        {
            return undefined;
        }
        this.#letterGrades.set(id, letterGrade);
    }

    // returns a map with the letter grade as key and the number of students as elements
    GetLetterGradeDistribution()
    {
        let distribution = new Map();
        this.#letterGrades.forEach(function(letterGrade, id)
        {
            if (distribution.has(letterGrade))
            {
                distribution[letterGrade] = distribution[letterGrade] + 1;
            }
            else
            {
                distribution.set(letterGrade, 1);
            }
        });

        return distribution;
    }

    LoadFromFile()
    {
        console.log("Loading Database From File");

        // contains generic objects not Assessments
        let databaseTempObject = JSON.parse(util.ReadFile(databaseFilepath));
        
        // load assessments
        let tempArr = databaseTempObject.assessments;
        
        let newArr = new Array();
        
        tempArr.forEach(function(obj)
        {
            let tempQuestionArr = Array.from(obj.questions);
            let questions = new Array();
            tempQuestionArr.forEach(function(questionObj)
            {
                questions.push(new Question(questionObj.maxGrade));
            });

            let assessmentRead = new Assessment(obj.name, obj.weight, questions);

            let marks = Array.from(obj.marks);
            marks.forEach(function(mark)
            {
                assessmentRead.SetGrades(mark.id, new AssessmentResult(mark.grade.grades));
            });

            newArr.push(assessmentRead);
        });

        this.#assessments = Array.from(newArr);

        // load student letter grades

        this.#letterGrades.clear();
        let letterGradeArr = databaseTempObject.letterGrades;
        for (let i = 0; i < letterGradeArr.length; i++)
        {
            let currLetterGradeObj = letterGradeArr.at(i);
            this.#letterGrades.set(currLetterGradeObj.id, currLetterGradeObj.letterGrade);
        }

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
        
        let data = "{\"assessments\":[";
        this.#assessments.forEach(function(assessment)
        {
            data += assessment.ToJSONStr() + ",";
        });
        
        if (this.#assessments.length > 0)
        {
            data = data.slice(0, data.length - 1);
        }
        
        data += "],\"letterGrades\":[";

        this.#letterGrades.forEach(function(letterGrade, id)
        {
            data += "{\"id\":" + id + ",\"letterGrade\":\"" + letterGrade + "\"},"; 
        });

        if (this.#letterGrades.size > 0)
        {
            data = data.slice(0, data.length - 1);
        }

        data +="]}";
        
        util.WriteToFile(databaseFilepath, data);
    }
}

var database = new Database();

//user view of assessments
class UserAssessment
{
    #assessment;
    #results;
    #id;

    constructor(assessment, id)
    {
        this.#assessment = assessment;
        this.#results = assessment.GetGrades(id);
        this.#id = id;
    }

    GetName() { return this.#assessment.GetName(); }
    GetWeight()  { return this.#assessment.GetWeight(); }
    GetNumQuestions() { return this.#assessment.GetQuestions().length; }
    GetQuestionGrade(questionIndex) { return this.#results.GetQuestionGrades()[questionIndex]; }
    
    GetGrade() { return this.#results.GetGrade(); }
    GetWeightedGrade() { return this.GetGrade() * this.GetWeight() / this.GetMaxGrade(); }
    GetAverage() { return this.#assessment.GetAverage(); }
    GetMedian() { return this.#assessment.GetMedian(); }
    GetStandardDeviation() { return this.#assessment.GetStandardDeviation(); }

    GetQuestionMaxGrade(questionIndex) 
    { 
        return this.#assessment.GetQuestions()[questionIndex].GetMaxGrade(); 
    }

    GetMaxGrade() { return this.#assessment.GetMaxGrade(); }

    GetRankPercentile() { return this.#assessment.ComputeRankPercentileOfStudent(this.#id); }
}

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

    GetID() { return this.#id; }

    // returns undefined if this User object is invalid
    GetType() { return this.#database.GetUserType(this.#id); }

    // returns undefined if this User object is invalid or if the user is not a student
    GetLetterGrade() { return this.#database.GetLetterGrade(this.#id); }

    // returns undefined if the id is invalid or if the user is not a student
    // returns an array of UserAssessments for this specific student
    GetAssessmentsStudent()
    {
        if (!this.IsValid() || this.GetType() !== AccountType.Student)
        {
            return undefined;
        }

        const id = this.#id;
        let assessments = [];
        this.#database.GetAssessments().forEach(function (assessment)
        {
            assessments.push(new UserAssessment(assessment, id));
        });

        return assessments;
    }

    GetLetterGradeDistribution()
    {
        if (!this.IsValid())
        {
            return undefined;
        }

        return this.#database.GetLetterGradeDistribution();
    }

    // if the user is invalid or is not a student, will return undefined
    GetFinalGrade()
    {
        if (!this.IsValid() || this.GetType() !== AccountType.Student)
        {
            return undefined;
        }

        let numerator = 0;
        let denumerator = 0;
        let assessments = this.GetAssessmentsStudent();
        assessments.forEach(function(assessment)
        {
            let weight = assessment.GetWeight() / 100;
            // weight is percentage between 0 and 100 not between 0 and 1
            numerator += assessment.GetGrade() * weight;
            denumerator += weight;
        });

        return numerator / denumerator;
    }

    // returns undefined if the id is invalid or if the user is not a teacher
    // returns an array of Assessments
    GetAssessmentsTeacher()
    {
        if (!this.IsValid() || this.GetType() !== AccountType.Teacher)
        {
            return undefined;
        }
        return this.#database.GetAssessments();
    }
}

function InitializeDefaultStaticAccounts()
{
    accounts.push(new Account("teacher", HashPassword("teacher"), 
    AccountType.Teacher, GenerateGUID()));
    accounts.push(new Account("student", HashPassword("student"), 
    AccountType.Student, GenerateGUID()));
    accounts.push(new Account("student2", HashPassword("student2"), 
    AccountType.Student, GenerateGUID()));

    if (fs.existsSync(databaseFilepath))
    {
        SaveGUIDs();
    }
}

function InitializeAccounts()
{
    console.log("Initializing accounts");
    if (fs.existsSync(accountsFilepath))
    {
        LoadAccounts();
        if (!fs.existsSync(guidFilepath))
        {
            accounts.forEach(function (account)
            {
                guidUsed.set(account.GetID(), account.GetID());
            });
            SaveGUIDs();
        }
    }
    else
    {
        console.log("Generating Default Account Data");
        
        if (!fs.existsSync(util.dataDirectory))
        {
            fs.mkdirSync(util.dataDirectory);
        }
        
        InitializeDefaultStaticAccounts();

        if (fs.existsSync(databaseFilepath))
        {
            SaveAccounts();
        }
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
        
        var arr = [new Question(6), new Question(10), new Question(25)];
        database.AddAssessment(new Assessment("Quizzes", 50, arr));
        
        arr = [new Question(5), new Question(8), new Question(10), new Question(7)];
        database.AddAssessment(new Assessment("Reflection Essay", 30, arr));

        accounts.forEach(function(account)
        {
            database.SetLetterGrade(account.GetID(), "Not Submitted Yet");
        });
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

module.exports = { database, Database, Account, User, UserAssessment, AccountType, 
    InitializeDatabase, GenerateGUID, IsGUIDValid, SaveGUIDs, OnLogin };