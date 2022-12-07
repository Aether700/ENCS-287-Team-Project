============================================================
=================== Installation guide =====================
============================================================

To launch the server:
- if you are on windows click and run the StartupWindows.bat script
- if you are on mac click and run the StartupMac.sh script.
- if you are on linux click and run the StartupLinux.sh script

Note that if you are on Mac, you will need to have both bash (which usually comes with your macOS) 
and node.js installed. You can then run the scripts. On Linux and Mac you might have to allow the 
file to be executed using the chmod command. 

If you need to use the chmod command you can navigate to the folder containing the script and execute
"chmod 555 <script name>". For example, if you are on mac you would do "chmod 555 StartupMac.sh".

if none of the above worked open up your command line terminal and 
navigate to the Nodejs folder and then go into the folder of your 
platform (ex: on windows go to Nodejs/Windows). On Mac you can simply navigate 
into the Linux folder as there is no Mac folder inside the Nodejs folder. 
Once you have navigated to the proper folder you can enter one of the two commands following: 

"node ../../src/Core.js" 
"./node ../../src/Core.js" 

to start the server. Note that you might have to download Node.js for your 
platform if you do not already have it installed.

Once the server is running, to connect to the website
open your browser and connect to "localhost:3000"


============================================================
==================== User Guide ============================
============================================================

Once you have opened the website in your browser (instructions on how to 
reach this stage above), you will see a login form requesting for a username 
and a password on the left of the page. To the right of the same webpage you 
will see another form to create an account which can be used to create a new 
account for either a student or a teacher. Note that as of deliverable 3 there 
is no support for multiple teachers and if you do create a teacher account the 
new account will have a duplicate view of any existing teacher accounts when logging in.

By default, you can enter the following credentials to login and see the rest of the website:

username: student
password: student

username: student2
password: student2

username: teacher
password: teacher

Any student accounts will lead you to the student view with where you can see the grades and statistics 
of that student. If you go back to the login screen (using the back button of your browser) and login with 
the other student account you will notice that the grades displayed will change as they reflect the 
grades of the student who logged in. Note that if you have created a new student account, all exist 
assessment which have a grade of 0 for the new student.

The teacher account will lead you to the teacher view where you will see different statistics of the class 
such as the average of the students for each assessment and the distribution of the grades per assessment.
There is also a form near the top of the screen which allows the teacher to input the name, weight and 
number of questions of an assessment. Once a name, a valid weight and a valid number of question have 
been provided, clicking the create assessment button will generate a new table below the form with 
one row for the maximum grade of each question and a row per student. The number of columns in the 
table is the number of questions for the assessment. The teacher can then enter the maximum grade for 
each question of the assessment and then proceed to enter the grade for each question for each 
individual student by pressing the tab key to switch to the next field in the table. Leaving a field empty 
will mark it as 0 internally.

At the bottom of te teacher page there is a button labeled "Assign letter grades" which if clicked will 
bring you to a new page with a table of student ids and of letter grades of the students. The table will 
contain the currently assigned letter grade for each student and can be edited by the teacher to modify 
what letter grade is assigned to each student. Leaving a field empty will mark the letter grade as not yet 
assigned. The changes made to the letter grades are sent to the server to be saved in the database when 
clicking the submit button below the table.

If you were to enter an invalid username/password combination the website will load a new 
webpage indicating as such and will display the username/password entered. You can simply 
click the back button of your browser to return to the previous webpage.