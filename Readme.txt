============================================================
=================== Installation guide =====================
============================================================

To launch the server:
- if you are on windows click and run the StartupWindows.bat script
- if you are on mac click and run the StartupMac.sh script.
- if you are on linux click and run the StartupLinux.sh script

if none of the above worked open up your command line terminal and 
navigate to the Nodejs folder and then go into the folder of your 
platform (ex: on windows go to Nodejs/Windows), then enter one of the two commands following: 

"node ../../src/Core.js" 
"./node ../../src/Core.js" 

to start the server. Note that you might have to download Node.js for your 
platform if you do not already have it installed 

Once the server is running, to connect to the website
open your browser and connect to "localhost:3000"


============================================================
==================== User Guide ============================
============================================================

Once you have opened the website in your browser (instructions on how to 
reach this stage above), you will see a login form requesting for a username 
and a password on the left of the page. To the right of the same webpage you 
will see another form to create an account however this form does not provide 
any functionality as of deliverable 1.

You can enter the following credentials to login and see the rest of the website:

username: student
password: student

username: teacher
password: teacher

The student account will lead you to the student view where you can see the different 
grades of the student for the different assessments. Note that for the first deliverable 
this page is static and only contains dummy grades that do not reflect the contents of the database.
The actual grades will be displayed dynamically for each student in the next deliverables.

The teacher account will lead you to the teacher view where you will start at the dashboard where 
the names and email addresses of TAs are displayed. To the left of the page there is a menu 
which allows you to display the grades of the students or add an assessment for a student.
Note that none of the functionalities of these pages work as they are simple html files 
used as template for future html code generation. As such, the grades displayed or 
the assessments added will not change the database of the server as of deliverable 1.

If you were to enter an invalid username/password combination the website will load a new 
webpage indicating as such and will display the username/password entered. You can simply 
click the back button of your browser to return to the previous webpage.

Note that the design and style of the webpages are subject to change and that the 
webpages displayed will be modified as in the future all webpages will be generated dynamically 
through javascript.