// function responsible for hashing provided passwords
function HashPassword(password)
{
    let hash = 0;
    for (let i = 0; i < password.length; i++)
    {
        hash = (hash + Math.pow(password.charCodeAt(i), i + 1)) % 4093;
    }
    return hash;
}

// enum like const object used to differentiate between student accounts and teacher accounts
const AccountType = 
{
    Student: 0,
    Teacher: 1
};

class Account
{
    #username;
    #passwordhash; //for security reasons only store the password hash and not the password itself
    #usertype; // keeps track of if the user is a teacher or a student

    constructor(username, passwordhash, usertype)
    {
        this.#username = username;
        this.#passwordhash = passwordhash;
        this.#usertype = usertype;
    }

    GetUserType() { return this.#usertype; }

    Validate(username, hashedPassword)
    {
        return username === this.#username && this.#passwordhash === hashedPassword;
    }
}

var accounts = new Array();


function InitializeDefaultStaticAccounts()
{
    accounts.push(new Account("teacher", HashPassword("teacher"), AccountType.Teacher));
    accounts.push(new Account("student", HashPassword("student"), AccountType.Student));
}

function InitializeAccounts()
{
    InitializeDefaultStaticAccounts(); // temporary function, will read from file in the future
}

function OnLogin(form)
{
    let username = form.username;
    let passwordHash = HashPassword(form.password);
    let accountToLogin = accounts.find(function (account)
    {
        return account.Validate(username, passwordHash)
    });

    console.log(accountToLogin);
    return accountToLogin;
    /*
    let accountToLogin = accounts.find(function (account)
    {
        return account.Validate(username, passwordHash)
    });

    if (accountToLogin != undefined)
    {
        switch(accountToLogin.GetUserType())
        {
            case AccountType.Teacher:
                location.href = "teacher.html";
                break;

            case AccountType.Student:
                location.href = "student.html";
                break;

            default:
                alert("Unknown Account Type detected");
                break;
        }
    }
    else
    {
        alert("invalid username and/or password");
    }
    */
}

//window.onload = InitializeAccounts;

//export { OnLogin, Account, AccountType };
module.exports = { OnLogin, Account, AccountType, InitializeAccounts };