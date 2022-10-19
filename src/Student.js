const http = require("http");
const database = require("../../src/Database.js");
const util = require("../../src/Util.js");

function QuestionToHTMLStrStudent(question)
{
    return question.GetGrade() + "/" + question.GetMaxGrade();
}

function AssessmentToHTMLStrStudent(assessment)
{
    var htmlStr = "<p>" + assessment.GetName() + "</p><ul>";
    assessment.GetQuestions().forEach(function(question)
    {
        htmlStr += "<li>"+ QuestionToHTMLStrStudent(question) + "</li>";
    });
    
    htmlStr += "</ul>";
    return htmlStr;
}

function GenerateStudentPageHead()
{
    return "<head></head>";
}

function GenerateStudentBody()
{
    let body = "<body>";
    database.database.GetAssessments().forEach(function (assessment)
    {
        body += AssessmentToHTMLStrStudent(assessment);
    });
    body += "</body>";
    return body;
}

function LoadStudentPage(account)
{
    /*
    console.log("loading student page");
    let studentPage = util.GenerateHTMLHeader();
    studentPage += GenerateStudentPageHead();
    studentPage += GenerateStudentBody();
    studentPage += util.GenerateHTMLFooter();
    return studentPage;
    */
    return util.ReadFile("../src/student.html");
}


module.exports = { LoadStudentPage };

