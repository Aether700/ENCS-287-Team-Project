const http = require("http");
const database = require("../src/Database.js");
const util = require("../src/Util.js");

function QuestionToHTMLStrStudent(assessment, index)
{
    return assessment.GetQuestionGrade(index) + "/" + assessment.GetQuestionMaxGrade(index);
}

function GenerateHeader()
{
    return "<h1 style=\"position: relative;padding:0;margin:0; width:100% ; height:5.5%; top: -10px; left: -5px; right: 0; " +
        "text-align: center;font-size:40px; background: #912338; color: white;\">Concordia University</h1>";
        
}
function GenerateFooter()
{
    return "<h5 style=\"position: absolute; width:100%;height:5%; left: -5px; " + 
        "text-align: center; background: #912338; color: white;\"> " + 
        "Website made by Hao Mei, Jamil Hanachian, James Teasdale, Alex Ye, Catherine Pham " + 
        "& Nikita Ciobanu</h6>";
}

function AssessmentToHTMLStrStudent(assessment)
{
    var htmlStr = "<h2><b><u>"  + assessment.GetName() +  "</u></h2>"; 
    htmlStr += "<p>Mark:&emsp;&emsp;&emsp;&emsp;" + assessment.GetGrade() + "/" + assessment.GetMaxGrade() + "</p>";
    htmlStr +=  "<p>Weight: &emsp;&emsp;&emsp;" + ((assessment.GetWeightedGrade()*100)/100).toFixed(2) + "/" + assessment.GetWeight() + "</p>";
    for (let i = 0; i < assessment.GetNumQuestions(); i++)
    {
        htmlStr +="<table><tr><td>"+ "&emsp;Question " + (i+1) + "&emsp;&emsp;&emsp;" + QuestionToHTMLStrStudent(assessment, i) + "</td></tr></table>";
    }
    //insert stats here
    {
        htmlStr += "<p> Rank percentile of the student: " + assessment.GetRankPercentile();
        htmlStr += "<p> Median for this assessment: " + assessment.GetMedian();
        htmlStr += "<p> Standard deviation: " + assessment.GetStandardDeviation();
   }//insert stats here

    return htmlStr;
}
function GenerateGradeSystem(){
    var GPA ="<table><caption><h3 style='color: #912338'>Grade System</h3></caption><tr><th>Letter Grade</th><th>GPA </th></tr><tr><td>A+</td><td>4.3</td></tr><tr><td>A</td><td>4.0</td> </tr><tr><td>A-</td><td>3.7</td> </tr><tr><td>B+</td><td>3.3</td> </tr><tr><td>B</td><td>3.0</td> </tr><tr><td>B-</td><td>2.7</td> </tr><tr><td>C+</td><td>2.3</td> </tr><tr><td>C</td><td>2.0</td> </tr><tr><td>C-</td><td>1.7</td> </tr><tr><td>D+</td><td>1.3</td> </tr> <tr><td>D</td><td>1.0</td> </tr><tr><td>D-</td><td>0.7</td> </tr><tr><td>F</td><td>0</td> </tr></table>"
    return GPA
}
function GenerateStudentPageHead()
{
    return "<head>"+ GenerateStyle()+"</head>";
}
function GenerateStyle()
{
    return "<style> table, th, td {border:1px solid black;border-radius: 10px;width:200px;font-weight: bold;} u{color: #912338}  </style>"
}
function GenerateStudentBody(user)
{
    let body = "<body style='position:absolute;width:100%;overflow-x: hidden;height:100%;top:0;left:0;'>";
    body += GenerateHeader();
    let assessments = user.GetAssessmentsStudent();
    assessments.forEach(function (assessment)
    {
        body += AssessmentToHTMLStrStudent(assessment);
    });

    body +=  "<table><tr><td> Student ID: &emsp;" +user.GetID();
    body += "<table><tr><td> Letter Grade: " + user.GetLetterGrade() ; 
    body += "</table>";
    body += "<p style=';background-color:#912338; width: 250px; padding:3px; margin:2px;top:-30px; border-radius:10px;border:2px solid black;'>Total: &emsp;&emsp;&emsp;&emsp;" + user.GetFinalGrade().toFixed(2) + "/100</p>";
    body += GenerateFooter();
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

