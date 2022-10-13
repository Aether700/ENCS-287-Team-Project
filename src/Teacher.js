const util = require("../src/Util.js");

function LoadTeacherPage(account)
{
    return util.ReadFile("../src/teacher.html"); 
    //return "<!DOCTYPE html><html><head></head><body><p>Teacher View</p></body></html>";
}

module.exports = { LoadTeacherPage };
