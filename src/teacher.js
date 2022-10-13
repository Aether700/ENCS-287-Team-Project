
function submit() {
    var fName='Student Grade'
    var in1 = document.getElementById("in1").value;
    var in2 = document.getElementById("in2").value;
    var in3 = document.getElementById("in3").value;
    var in4 = document.getElementById("in4").value;
    var in5 = document.getElementById("in5").value;
    var in6 = document.getElementById("in6").value;
    var in7 = document.getElementById("in7").value;

    var inData = "Student Information\n\n" + in1 + "\n" + in2 + "\n" + in3 + "\n" + in4 + "\n" + in5 + "\n" + in6 + "\n" + in7 + "\n"
        
    var data2Blob = new File([inData], fName, {type: "text/plain"});
        
    var blob2URL = window.URL.createObjectURL(data2Blob);
        
     /* Create a HTML anchor tag via JavaScript, and force download */
        
    var anchorTag = document.createElement("a");
        
    anchorTag.href = blob2URL;
        
    anchorTag.download = fName;
        
    anchorTag.click();
 }
