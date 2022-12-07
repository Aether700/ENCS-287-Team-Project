const http = require("http");
const database = require("../src/Database.js");
const util = require("../src/Util.js");

function QuestionToHTMLStrStudent(assessment, index)
{
    return assessment.GetQuestionGrade(index) + "/" + assessment.GetQuestionMaxGrade(index);
}

function AssessmentToHTMLStrStudent(assessment)
{
    var htmlStr = "<h2><b><u>"  + assessment.GetName() +  "</u></h2>"; 
    htmlStr += "<p>Mark:&emsp;&emsp;&emsp;&emsp;" + assessment.GetGrade() + "/" + assessment.GetMaxGrade() + "</p>";
    htmlStr +=  "<p>Weight: &emsp;&emsp;&emsp;" + ((assessment.GetWeightedGrade()*100)/100).toFixed(2) + "/" + assessment.GetWeight() + "</p>";
    htmlStr += "<table><caption><b>Marks per Question</b></caption>"
    for (let i = 0; i < assessment.GetNumQuestions(); i++)
    {
        htmlStr += "<tr><th>Question " + (i+1) + "</th><td>" + QuestionToHTMLStrStudent(assessment, i) + "</td></tr>";
    }
    htmlStr += "</table>";
    
    htmlStr += "<p> Rank percentile of the student: " + assessment.GetRankPercentile();
    htmlStr += "<p> Median for this assessment: " + assessment.GetMedian();
    htmlStr += "<p> Standard deviation: " + assessment.GetStandardDeviation();
    
    return htmlStr;
}

function GenerateStudentPageHead()
{
    return "<head>"+ GenerateStyle()+"</head>";
}

function GenerateStyle()
{
    return "<style> table, th, td {border:1px solid black;border-radius: " 
        + "10px;width:200px;font-weight: bold;} u{color: #912338}  </style>";
}

function GenerateStudentBody(user)
{
    let body = "<body style='position:absolute;width:100%;overflow-x: hidden;height:100%;top:0;left:0;'>";
    body += util.GeneratePageHeader();
    let assessments = user.GetAssessmentsStudent();
    assessments.forEach(function (assessment)
    {
        body += AssessmentToHTMLStrStudent(assessment);
    });

    body +=  "<table><tr><td> Student ID: &emsp;" +user.GetID();
    body += "<table><tr><td> Letter Grade: " + user.GetLetterGrade() ; 
    body += "</table>";
    body += "<p style=';background-color:#912338; width: 250px; padding:3px; margin:2px;" 
        + "top:-30px; border-radius:10px;border:2px solid black;'>Total: &emsp;&emsp;&emsp;&emsp;" 
        + user.GetFinalGrade().toFixed(2) + "%</p>";
    body += util.GeneratePageFooter();
    body += "</body>";
    

    return body;
}

function LoadStudentHomePage(user)
{
    console.log("loading /student/home/" + user.GetID());
    let studentPage = util.GenerateHTMLHeader();
    studentPage += GenerateStudentPageHead();
    studentPage += GenerateStudentBody(user);
    studentPage += util.GenerateHTMLFooter();
    return studentPage;
}

module.exports = { LoadStudentHomePage };

