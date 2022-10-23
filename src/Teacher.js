const util = require("../src/Util.js");
const database = require("../src/Database.js");

function QuestionToHTMLStrTeacher(question)
{
    return question.GetGrade() + "/" + question.GetMaxGrade();
}

function AssessmentToHTMLStrTeacher(assessment)
{
    var htmlStr = "<p>" + assessment.GetName() + "</p><ul>";
    assessment.GetQuestions().forEach(function(question)
    {
        htmlStr += "<li>"+ QuestionToHTMLStrTeacher(question) + "</li>";
    });
    
    htmlStr += "</ul>";
    return htmlStr;
}

function GenerateTeacherPageHead()
{
    return "<head></head>";
}

function GenerateTeacherBody()
{
    let body = "<body>";
    database.database.GetAssessments().forEach(function (assessment)
    {
        body += AssessmentToHTMLStrTeacher(assessment);
    });
    body += "</body>";
    return body;
}

function LoadTeacherPage(account)
{
    /*
    console.log("loading teacher page");
    let teacherPage = util.GenerateHTMLHeader();
    teacherPage += GenerateTeacherPageHead();
    teacherPage += GenerateTeacherBody();
    teacherPage += util.GenerateHTMLFooter();
    return teacherPage;
    */
    return util.ReadFile("../../src/teacher.html"); 
}

module.exports = { LoadTeacherPage };