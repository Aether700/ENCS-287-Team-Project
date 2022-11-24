const util = require("../src/Util.js");
const database = require("../src/Database.js");

function QuestionToHTMLStrTeacher(assessment, question, index)
{
    return "Max grade for the question: " + question.GetMaxGrade() + "\t | Average: " + assessment.GetQuestionAverage(index);
}

function AssessmentToHTMLStrTeacherGrade()
{
    return `
    <div ><h2>SOEN 287 Section Q</h2> </div>
    <div><h3>Add assessment for a student</h3></div>
    <div class="mainBox">
        <div class="text02Box"> 
            <span class="datum">Assessment Name:&emsp;</span>
            <input id = "in3" type="text"/>
    <br>
            <span class="datum" >Weight:&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;</span>
            <input id="in2" type="number"/><span> % </span>
    <br>
    <br>
            <span class="datum">Number of questions:</span>
            <input id = "in3" type="number"/>
    <br>
    <br>
            <button class="dropbtn">Create Assessment</button>
    <br>
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
    </div> `;
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

function LoadTeacherLetterGrade(user)
{
    const studentIds = database.database.GetStudentIDs()
    const numberOfStudents = studentIds.length

    const studentData = studentIds.map((studentId) =>{
        return {
            id: studentId,
            grade: database.database.GetLetterGrade(studentId)
        }
    })
    console.log(studentData[0])
    
    return `
    <input type="button" value="Go back to assessment page">
    <div ><h2>SOEN 287 Section Q </h2> </div>
    <div><h3>Assign letter grade for the students</h3></div>
    <div><h4>ID &emsp;&emsp;&emsp;&emsp; Letter Grade</h4></div>

    <div class="mainBox">
        <form id = "letter_grade">
        </form>
    </div>
   
    <script>
        // Generate a dynamic number of inputs
        var number = ${numberOfStudents};
        // Get the element where the inputs will be added to
        var letter_grade = document.getElementById("letter_grade");
        var studentIds = [${studentIds}]
        const studentData = ${JSON.stringify(studentData)}
        for (i=0;i<number;i++){
            const studentId = studentIds[i];
            letter_grade.appendChild(document.createTextNode(studentId));
            var input = document.createElement("input"); 
            input.type = "text";
            input.placeholder = "Enter letter grade";
            if (typeof studentData[i].grade !== "undefined" ){
                input.value = studentData[i].grade
            }
            input.name = studentId; 
            input.id = studentId;
            letter_grade.appendChild(input);
            letter_grade.appendChild(document.createElement("br"));
        }
        var submit_button = document.createElement("input");
        submit_button.type = "submit";
        submit_button.value = "Submit";
        letter_grade.appendChild(submit_button);
    </script>`;
}

function GenerateTeacherPageHead()
{
    return "<head>" + GenerateStyle() +"</head>";
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
    htmlStr += "</table>";
    return htmlStr;
}

function GenerateTeacherBody(user)
{
    let body = "<body>";
    body += GenerateHeader();
    body += AssessmentToHTMLStrTeacherGrade() + "<br/><br/>";
    let assessments = user.GetAssessmentsTeacher();
    body += GenerateOverview(assessments);

    // specifics
    assessments.forEach(function (assessment)
    {
        body += AssessmentToHTMLStrTeacher(assessment);
    });

    body += "<br><br><input type='button' onclick = \"document.location.href = '/teacher/letterGrade/" 
        + user.GetID() + "';\" value='Assign letter grade' />";

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
    return "<h1 style=\"position: relative; " +
        "padding: 0.1%; bottom: 82%; top: 0%; left: 0%; right: 0%; " +
        "text-align: center; background: #912338; color: white;\">Concordia University</h1>";
        //<p style = \"position: fixed; padding: 0.1%; bottom: 82%; top: 0%; left: 0%; right: 0%; 
        //text-align: center; background: #912338; color: white;\">Marks and Grades assessment for 
        //SOEN 287 for Fall 2022</p>"
}
function GenerateFooter()
{
    return "<h6 style=\"position: relative; padding: 1%; bottom: 0%; top: 92%; left: 0%; " + 
        "right: 0%; text-align: center; background: #912338; color: white;\"> " + 
        "Website made by Hao Mei, Jamil Hanachian, James Teasdale, Alex Ye, Catherine Pham " + 
        "& Nikita Ciobanu</h6>";
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

module.exports = { LoadTeacherHomePage, LoadTeacherLetterGrade };