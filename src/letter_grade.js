function HTMLStrLetterGrade()
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
    <div ><h2>SOEN 287 Section Q </h2> </div>
    <div><h3>Assign letter grade for the students</h3></div>
    <div><h4>ID &emsp;&emsp;&emsp;&emsp; Letter Grade</h4></div>

    <style> 
    input {
        type: text;
        width: 8%;
        margin: 10px 30px;
        text-transform: uppercase;
    }
    ::placeholder {
        text-transform: none;
    ]

    .input:hover {color: #912338; background: rgb(227, 227, 227);}
    .input:focus {color: rgb(0, 0, 0); background: rgb(255, 255, 255);}
    </style>

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