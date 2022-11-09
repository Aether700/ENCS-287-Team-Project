const util = require("../src/Util.js");
const database = require("../src/Database.js");

function QuestionToHTMLStrTeacher(assessment, question, index)
{
    return "Max grade for the question: " + question.GetMaxGrade() + "\t | Average: " + assessment.GetQuestionAverage(index);
}

function AssessmentToHTMLStrTeacher(assessment)
{
    let htmlStr = "<p><b><u>" + assessment.GetName() + "</u></p>";
    
    /*
    htmlStr += "<table><tr><th>Weight</th><th>Class Average</th></tr>" + "<tr><td>" + assessment.GetWeight() + "</td>" 
        + "<td>" + assessment.GetAverage() + "</td></tr>";
    */

    htmlStr += "<p><b>Distribution</p>";
    let distribution = assessment.GetDistribution();
    distribution.forEach(function(numStudents, grade)
    {
        htmlStr += "<table><tr><td><b>Grade: </b>" + grade + "</td>" + "<tr><td>Number of Students: " + numStudents + "</td></tr></table>";
    });

    htmlStr += "<p><b>Marks of each student (ID)</p>";
    let totals = assessment.GetTotals();
    totals.forEach(function (total, id)
    {
        htmlStr += "<table><tr><th>ID: " + id + "</th>" + "<tr><th> Total: " + total + "</th></tr></table>";
    });
    htmlStr += "<p><b>Questions</p>";

    let questions = assessment.GetQuestions();
    for (let i = 0; i < questions.length; i++)
    {
        htmlStr += "<table><tr><td>" + QuestionToHTMLStrTeacher(assessment, questions[i], i) + "</td></tr></table>";
    }
    return htmlStr;
}

function GenerateTeacherPageHead()
{
    return "<head></head>";
}

function GenerateOverviewRow(assessment)
{
    return "<tr><th>" + assessment.GetName() + "</th><td>" + assessment.GetWeight() 
        + "</td><td>" + assessment.GetAverage() + "</td></tr>";
}

function GenerateOverview(assessments)
{
    let htmlStr = "<table><caption><b>Overview</caption><tr><th></th><th>Weight</th><th>Average</th></tr>";
    assessments.forEach(function (assessment)
    {
        htmlStr += GenerateOverviewRow(assessment);
    });
    return htmlStr;
}

function GenerateTeacherBody(user)
{
    let body = "<body>";
    let assessments = user.GetAssessmentsTeacher();
    
    body += GenerateHeader();
    //overview
    //body += GenerateOverview(assessments);

    // specifics
    assessments.forEach(function (assessment)
    {
        body += AssessmentToHTMLStrTeacher(assessment);
    });

    body += GenerateFooter();
    body += "</body>";
    return body;
}

function GenerateStyle()
{
    return "<style> table, th, td {border:1px solid black;} </style>"
}

function GenerateHeader()
{
    return "<h1 style=\"position: relative; padding: 0.1%; bottom: 82%; top: 0%; left: 0%; right: 0%; text-align: center; background: #912338; color: white;\">Concordia University</h1>"
    //<p style = \"position: fixed; padding: 0.1%; bottom: 82%; top: 0%; left: 0%; right: 0%; text-align: center; background: #912338; color: white;\">Marks and Grades assessment for SOEN 287 for Fall 2022</p>"
}
function GenerateFooter()
{
    return "<h6 style=\"position: relative; padding: 1%; bottom: 0%; top: 92%; left: 0%; right: 0%; text-align: center; background: #912338; color: white;\">Website made by Hao Mei, Jamil Hanachian, James Teasdale, Alex Ye, Catherine Pham & Nikita Ciobanu</h6>"
}

function LoadTeacherHomePage(user)
{
    console.log("loading /teacher/home/" + user.GetID());
    let teacherPage = util.GenerateHTMLHeader();
    teacherPage += GenerateTeacherPageHead();
    teacherPage += GenerateStyle();
    teacherPage += GenerateTeacherBody(user);
    //teacherPage += util.GenerateHTMLFooter();
    return teacherPage; 
}

module.exports = { LoadTeacherHomePage };