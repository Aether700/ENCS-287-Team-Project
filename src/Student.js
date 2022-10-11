const http = require("http");
const core = require("../src/Core.js");

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

function LoadStudentPage(account)
{
    /*
    document.write("loading student page");//temp for debug
    core.database.GetAssessments().forEach(function (assessment)
    {
        document.getElementById("body").innerHTML += AssessmentToHTMLStrStudent(assessment);
    });
    */
   //temp implementation:
   return "<!DOCTYPE html><html><head></head><body><p>Student View</p></body></html>";
}


module.exports = { LoadStudentPage };

