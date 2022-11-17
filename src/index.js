function SendFormPost(form)
{
    let request = new XMLHttpRequest();
    let urlPairs = [];
    let tempDebugString = "";
    for (let [name, value] of Object.entries(form))
    {
        tempDebugString += name + ": " + value;
        urlPairs.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
    }

    let urlEncodedData = urlPairs.join('&').replace(/%20/, '+');
    
    request.addEventListener("load", function(event)
    {
        console.log("temp: loading successful");
    });

    request.addEventListener("error", function(error)
    {
        alert("An error occured");
    });
    
    request.open('POST', '127.0.0.1:3000');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(urlEncodedData);
}

function HandleAccountCreation()
{
    let form = document.getElementById("createAccountForm");
    let object = {
        formType: form.formType.value,
        userType: form.userType.value,
        username: form.username.value,
        password: form.password.value,
        passwordReEntered: form.passwordReEntered.value
    };
    SendFormPost(object);
}

