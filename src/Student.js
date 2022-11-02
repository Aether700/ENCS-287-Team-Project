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

    htmlStr += "<p>Mark:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" + assessment.GetGrade() + "/" + assessment.GetMaxGrade() + "</p>";
    for (let i = 0; i < assessment.GetNumQuestions(); i++)
    {
        htmlStr += "&emsp;Question " + (i+1) + "&emsp;&emsp;&emsp;" + QuestionToHTMLStrStudent(assessment, i) + "<br>";
    }

    var totalWeight = (Math.round((assessment.GetGrade()*assessment.GetWeight())/assessment.GetMaxGrade()*100)/100).toFixed(2);
    htmlStr +=  "<p>Weight: &emsp;&emsp;&emsp;&emsp;&emsp;" + totalWeight + "/" + assessment.GetWeight() + "</p><br>";

    //insert stats here

    return htmlStr;
}

function GenerateStudentPageHead()
{
    return "<head></head>";
}

function GenerateStudentBody(user)
{
    let body = "<body>";
    //temp////
    body += "<input type = \"button\" onclick = \"window.location.href=\'"
        + "/student/test/" + user.GetID() +  "\'\" value = \"Go to Test Page\">";
    //////////

    let assessments = user.GetAssessmentsStudent();
    assessments.forEach(function (assessment)
    {
        body += AssessmentToHTMLStrStudent(assessment);
    });
    body += "</body>";

    //insert cumulative grade
    body += "<p>Total: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" + "/100</p>"; 

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

