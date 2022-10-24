const util = require("../src/Util.js");
const database = require("../src/Database.js");

function QuestionToHTMLStrTeacher(assessment, question, index)
{
    return "On " + question.GetMaxGrade() + "\tAverage: " + assessment.GetQuestionAverage(index);
}

function AssessmentToHTMLStrTeacher(assessment)
{
    let htmlStr = "<p>" + assessment.GetName() + "</p>";
    htmlStr += "<p>Weight: " + assessment.GetWeight() + " Class Average: " 
        + assessment.GetAverage() + "</p><ul>";
    let questions = assessment.GetQuestions();
    for (let i = 0; i < questions.length; i++)
    {
        htmlStr += "<li>" + QuestionToHTMLStrTeacher(assessment, questions[i], i) + "</li>";
    }
    
    htmlStr += "</ul>";
    return htmlStr;
}

function GenerateTeacherPageHead()
{
    return "<head></head>";
}

function GenerateTeacherBody(user)
{
    let body = "<body>";
    let assessments = user.GetAssessmentsTeacher();
    assessments.forEach(function (assessment)
    {
        body += AssessmentToHTMLStrTeacher(assessment);
    });
    body += "</body>";
    return body;
}

function LoadTeacherHomePage(user)
{
    console.log("loading /teacher/home/" + user.GetID());
    let teacherPage = util.GenerateHTMLHeader();
    teacherPage += GenerateTeacherPageHead();
    teacherPage += GenerateTeacherBody(user);
    teacherPage += util.GenerateHTMLFooter();
    return teacherPage; 
}

module.exports = { LoadTeacherHomePage };