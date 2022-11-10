const http = require("http");
const database = require("../src/Database.js");
const util = require("../src/Util.js");

function QuestionToHTMLStrStudent(assessment, index)
{
    return assessment.GetQuestionGrade(index) + "/" + assessment.GetQuestionMaxGrade(index);
}

function AssessmentToHTMLStrStudent(assessment)
{
    var htmlStr = "<p>" + assessment.GetName() +  "</p>"; 
    htmlStr += "<p>Mark:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" + assessment.GetGrade() + "/" + assessment.GetMaxGrade() + "</p>";
    htmlStr +=  "<p>Weight: &emsp;&emsp;&emsp;&emsp;&emsp;" + ((assessment.GetWeightedGrade()*100)/100).toFixed(2) + "/" + assessment.GetWeight() + "</p>";
    for (let i = 0; i < assessment.GetNumQuestions(); i++)
    {
        htmlStr += "&emsp;Question " + (i+1) + "&emsp;&emsp;&emsp;" + QuestionToHTMLStrStudent(assessment, i) + "<br>";
    }
    //insert stats here

    // temporary for testing/demo purposes:
    htmlStr += "<p>Median: " + assessment.GetMedian() + " standard deviation: " 
        + assessment.GetStandardDeviation() + "</p>";
    ///////////////////////////////////////////

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
    
    body += "<p>Total: &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" + user.GetFinalGrade() + "/100</p>";
    body += "<p>Letter Grade:&emsp;&emsp;&emsp;" + user.GetLetterGrade() + "</p>"; 

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

