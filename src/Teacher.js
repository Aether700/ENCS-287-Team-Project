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
            <input type =  "hidden" name = "formType" value = "createAssessment"/>
            <span class="datum">Assessment Name:&emsp;</span>
            <input id = "assessmentName" type="text"/>
            <br>
            <span class="datum" >Weight:&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;</span>
            <input id="weight" type="number" min = 0.0001 step = any max = 100/><span> % </span>
            <br>
            <br>
            <span class="datum">Number of questions:</span>
            <input id = "numQuestions" type="number" min = 1/>
            <br>
            <br>
            <button type = "button" class="dropbtn" onclick = "GenerateAssessmentGradeTable();">Create Assessment</button>
            <br>
            <br>

            <div id = "questionTable">
            </div>
    
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
    });
    
    return `
    <input type="button" onclick = "document.location.href = '/teacher/home/` + user.GetID() 
        + `'" value="Go back to assessment page">
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
        + user.GetID() + "';\" value='Assign letter grades' />";

    body += GenerateFooter();
    body += "<script src=\"/teacher/TeacherClientSide.js/" + user.GetID() + "\"></script>";
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

function LoadTeacherClientSideJs(user, studentIDs, hostname, port)
{
    console.log("loading /teacher/TeacherClientSide.js/" + user.GetID());
    let srcCode = "const studentIDs = [" + studentIDs.join() + "];\n";
    srcCode += util.GenerateClientSideFunctionSendPostForm(hostname, port) + "\n\n";
    srcCode += 
        `function GenerateMaxGradeRow(numQuestions)
        {
            let htmlStr = "";
            htmlStr += "<tr><th>Max Grade For Each Question</th>";
            for (let i = 0; i < numQuestions; i++)
            {
                htmlStr += "<td><input type = \\"number\\" name = \\"cells\\"/></td>";
            }
            htmlStr += "</tr>";
            return htmlStr;
        }
    
        function GenerateStudentRows(numQuestions)
        {
            let htmlStr = "";
            studentIDs.forEach(function (id)
            {
                htmlStr += "<tr><th>" + id + "</th>";
    
                for (let i = 0; i < numQuestions; i++)
                {
                    htmlStr += "<td><input type = \\"number\\" name = \\"cells\\"/></td>";
                }
    
                htmlStr += "</tr>";
            });
            return htmlStr;
        }
    
        function ValidateInput(tableDiv, numQuestions)
        {
            let assessmentName = document.getElementById("assessmentName").value;
            let assessmentWeight = document.getElementById("weight").value;

            if (assessmentName == "" || assessmentName == undefined)
            {
                tableDiv.innerHTML = "<p>Please fill in the name field for the assessement</p>";
                return false;
            }

            if (assessmentWeight == "" || assessmentWeight == undefined || assessmentWeight <= 0)
            {
                tableDiv.innerHTML = "<p>Please give a positive non zero weight for the assessement</p>";
                return false;
            }

            if (assessmentWeight > 100)
            {
                tableDiv.innerHTML = "<p>The assessment weight cannot exceed 100%</p>";
                return false;
            }

            if (numQuestions == undefined || numQuestions == "" || numQuestions == 0)
            {
                tableDiv.innerHTML = "<p>Please specify the number of questions for the assessement</p>";
                return false;
            }

            return true;
        }

        function GenerateAssessmentGradeTable()
        {
            let numQuestions = document.getElementById("numQuestions").value;
            let tableDiv = document.getElementById("questionTable");

            if (!ValidateInput(tableDiv, numQuestions))
            {
                return;
            }
    
            let divStr = "<table>";
            divStr += GenerateMaxGradeRow(numQuestions);
            divStr += GenerateStudentRows(numQuestions);
            divStr += "</table>";
            divStr += "<br/><button type = \\"button\\" onclick = \\"SubmitCreateAssessmentForm();\\">` 
                + `Save Assessment</button>";
            tableDiv.innerHTML = divStr;
        }
        
        function SubmitCreateAssessmentForm()
        {
            let formData = 
            {
                name: document.getElementById("assessmentName").value,
                weight: document.getElementById("weight").value,
                numQuestions: document.getElementById("numQuestions").value,
                formType: "assessmentCreation",
                id: `+ user.GetID() +`,
                gradesTable: "["
            };

            let table = document.getElementsByName("cells");
            let grades = new Array();

            table.forEach(function (item, key)
            {
                if (item.value == "" || item.value == undefined)
                {
                    grades.push(0);
                }
                else
                {
                    grades.push(item.value);
                }
            });

            console.log(grades.join());

            let maxGrade = new Array();
            for (let i = 0; i < formData.numQuestions; i++)
            {
                maxGrade.push(grades.at(i));
            }
            formData.gradesTable += "{\\\"key\\\": \\\"maxGrade\\\", \\\"value\\\": [" + maxGrade.join() + "]},";

            let index = 0;
            while (index < studentIDs.length)
            {
                let studentGrades = new Array();
                for (let i = 0; i < formData.numQuestions; i++)
                {
                    studentGrades.push(grades.at(i + ((index + 1) * formData.numQuestions)));
                }
                formData.gradesTable += "{\\\"key\\\":" + studentIDs.at(index) 
                    + ", \\\"value\\\":[" + studentGrades.join() + "]}";
                if (index != studentIDs.length - 1)
                {
                    formData.gradesTable += ",";
                }
                index++;
            }
            formData.gradesTable += "]";

            SendFormPost(formData, function(event)
            {
                document.getElementById("gradeTable").innerHtml = "<p>Assessment Created</p>";
            });
        }`;
    return srcCode;
}

module.exports = { LoadTeacherHomePage, LoadTeacherClientSideJs, LoadTeacherLetterGrade };
