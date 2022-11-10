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
will see another form to create an account however this form does not provide 
any functionality as of deliverable 2.

You can enter the following credentials to login and see the rest of the website:

username: student
password: student

username: student2
password: student2

username: teacher
password: teacher

Both student accounts will lead you to the student view with where you can see the grades and statistics 
of that student. If you go back to the login screen (using the back button of your browser) and login with 
the other student account you will notice that the grades displayed will change as they reflect the 
grades of the student who logged in.

The teacher account will lead you to the teacher view where you will see different statistics of the class 
such as the average of the students for each assessment and the distribution of the grades per assessment.
There is also a form near the top of the screen which allows the teacher to input the name, weight and 
number of questions of an assessment. As of deliverable 2 the form is not functioning but in the futur 
this form will allow a teacher to create new assessments and input the grades of the students in the 
table that will be generated below. For demo purposes, a sample table for an assessment with 3 questions 
has been provided to provide visual support as to what the interface will look like.

If you were to enter an invalid username/password combination the website will load a new 
webpage indicating as such and will display the username/password entered. You can simply 
click the back button of your browser to return to the previous webpage.

Note that the style of the webpages are subject to change in the future.