const util = require("../src/Util.js");
const database = require("../src/Database.js");

function QuestionToHTMLStrTeacher(assessment, question, index)
{
    return "On " + question.GetMaxGrade() + "\tAverage: " + assessment.GetQuestionAverage(index);
}

function AssessmentToHTMLStrTeacherGrade()
{
    return `
    <div ><h2>SOEN 287 Section Q</h2> </div>
    <div><h3>Add assessment for a student</h3></div>
    <div class="mainBox">
        <div class="text02Box">		
            <form action="#">
                 <label for="lang">Assessment:</label>
                 <select name="languages" id="lang">
                    <option value="Quiz">Quiz</option>
                    <option value="Reflection Essay">Reflection Essay</option>
                    <option value="Midterm Exam">Midterm Exam</option>
                    <option value="Final Exam">Final Exam</option>
                 </select>
            </form>
            <br>
            <span class="datum" >Weight:</span>
            <input id="in2" type="text"/><span> % </span>
            <br>
            <br>
            <span class="datum">Number of questions:</span>
            <input  id = "in3" type="number"/>
            <br>
            <br>
            <button class="dropbtn">Create Assessment</button>
            <br>
            <table>
                <tr>
                    <th>Max Value For Each Question</th>
                    <td> <input type="number"> </td>
                    <td> <input type="number"> </td>
                    <td> <input type="number"> </td>
                </tr>
                <tr>
                    <td>645258</td>
                    <td> <input type="number"> </td>
                    <td> <input type="number"> </td>
                    <td> <input type="number"> </td>
                </tr>
                <tr>
                    <td>432483</td>
                    <td> <input type="number"> </td>
                    <td> <input type="number"> </td>
                    <td> <input type="number"> </td>
                </tr>
            </table>
           
        </div>
    </div> `
}
function AssessmentToHTMLStrTeacher(assessment)
{
    let htmlStr = "<p>" + assessment.GetName() + "</p>";
    htmlStr += "<p>Weight: " + assessment.GetWeight() + " Class Average: " 
        + assessment.GetAverage() + "</p>";

    htmlStr += "<p>Distribution</p><ul>";
    let distribution = assessment.GetDistribution();
    distribution.forEach(function(numStudents, grade)
    {
        htmlStr += "<li>Grade: " + grade + " Number of Students: " + numStudents + "</li>";
    });

    htmlStr += "</ul><p>Marks:</p><ul>";
    let totals = assessment.GetTotals();
    totals.forEach(function (total, id)
    {
        htmlStr += "<li>ID: " + id + " Total: " + total + "</li>";
    });
    htmlStr += "</ul><p>Questions:</p><ul>";

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

    body += "<p>Letter Grade Distribution: </p><ul>";
    
    let letterGradeDistribution = user.GetLetterGradeDistribution();
    letterGradeDistribution.forEach(function (numStudents, grade)
    {
        body += "<li> Letter Grade: " + grade + " Number of Students: " + numStudents + "</li>";
    });

    body += "</ul>";

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
    teacherPage += AssessmentToHTMLStrTeacherGrade();
    teacherPage += GenerateTeacherBody(user);
    teacherPage += util.GenerateHTMLFooter();
    return teacherPage; 
}

module.exports = { LoadTeacherHomePage };
