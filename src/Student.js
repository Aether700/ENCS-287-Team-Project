var http = require("http");
const {database} = require("Core.js");

function QuestionToHTMLStrStudent(question)
{
    return question.GetGrade() + "/" + question.GetMaxGrade();
}

function AssessmentToHTMLStrStudent(assessment)
{
    var htmlStr = "<p>" + assessment.GetName() + "</p><ul>";
    assessment.GetQuestions().forEach(function(question)
    {
        htmlStr += "<li>"+ QuestionToHTMLStudent(question) + "</li>";
    });

    htmlStr += "</ul>";
    return htmlStr;
}

function LoadStudentPage()
{
    document.write("loading student page");//temp for debug
    database.GetAssessments().forEach(function (assessment)
    {
        document.getElementById("body").innerHTML += AssessmentToHTMLStrStudent(assessment);
    });
}

