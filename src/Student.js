const http = require("http");
const database = require("../src/Database.js");
const util = require("../src/Util.js");

function QuestionToHTMLStrStudent(assessment, index)
{
    return assessment.GetQuestionGrade(index) + "/" + assessment.GetQuestionMaxGrade(index);
}

function AssessmentToHTMLStrStudent(assessment)
{
    var htmlStr = "<p>" + assessment.GetName() + "</p>";
    htmlStr += "<p>Weight: " + assessment.GetWeight() + "%  Mark: " + assessment.GetGrade() + "/" + assessment.GetMaxGrade() + "</p><ul>";
    for (let i = 0; i < assessment.GetNumQuestions(); i++)
    {
        htmlStr += "<li>" + QuestionToHTMLStrStudent(assessment, i) + "</li>";
    }
    htmlStr += "</ul>";
    return htmlStr;
}

function GenerateStudentPageHead()
{
    return "<head></head>";
}

function GenerateStudentBody(user)
{
    let body = "<body>";
    let assessments = user.GetAssessmentsStudent();
    assessments.forEach(function (assessment)
    {
        body += AssessmentToHTMLStrStudent(assessment);
    });
    body += "</body>";
    return body;
}

function LoadStudentPage(user)
{
    console.log("loading student page");
    let studentPage = util.GenerateHTMLHeader();
    studentPage += GenerateStudentPageHead();
    studentPage += GenerateStudentBody(user);
    studentPage += util.GenerateHTMLFooter();
    return studentPage;
}


module.exports = { LoadStudentPage };

