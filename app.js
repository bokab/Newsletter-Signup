// *** Constant Require Section:

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

// *** Body Parser ***
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static("public"));
// app.use("/public", express.static(path.join(__dirname, "public")));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

//* Sing Up rutina */
app.post("/", function (req, res) {
    // ! Sa req.body.fName saljemo zahtijev html-u u body.
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // *** Construct Requesting data ***
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    
    const jsonData = JSON.stringify(data);

    
    const url = "https://us21.api.mailchimp.com/3.0/lists/29cb3d2c49";

    const options = {
        method: "POST",
        auth: "text or bojan1:f3bed6471180b00e33e9ed9b948e159f-us21"
    };

    
    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();


});

app.post("/failure", function (req, res) {
    res.redirect("/")
})


app.post("/success", function (req, res) {
    res.redirect("/")
});

app.listen(3000, function () {
    console.log("Server started on port: 3000!");
});

/*
bojan1:f3bed6471180b00e33e9ed9b948e159f-us21"
/ API ID :f3bed6471180b00e33e9ed9b948e159f-us21
// list id or audience id : 29cb3d2c49
const url = "https://us21.api.mailchimp.com/3.0/lists/29cb3d2c49"
*/




