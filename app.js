// *** Constant Require Section:

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

// *** Body Parser ***
app.use(bodyParser.urlencoded({ extended: true }));

// *** Staticke datoteke su datoteke koje klijenti preuzimaju sa servera onako kako jesu. Sa ovim "public", ce svi staticki podaci biti javni. ***
// ** Na osnovu ovog "public" sam dobio sliku sa login in ili sing up **
app.use(express.static("public"));
// app.use("/public", express.static(path.join(__dirname, "public")));

// *** Pracenje Html fajla ***
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
    // ** Sa jsonData stringify unsoimo podatke u https i konstruisemo zahtijev "data", gde pravimo objekat i dodajemo vrednost **
    const jsonData = JSON.stringify(data);

    // *** Unosimo url sa sajta gde ga prepravljamo nakon https://us21. jer kada kopiramo API id, zadnja 4 slova i broja kopiramo i nakon kose crte unosimo ***
    const url = "https://us21.api.mailchimp.com/3.0/lists/29cb3d2c49";

    const options = {
        method: "POST",
        auth: "text or bojan1:f3bed6471180b00e33e9ed9b948e159f-us21"
    };

    // *** Saljemo nase zahtijeve u mailchimp website gde mozemo videti ko se pokusao sing up ili sing in ***
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
// ** Koristimo ovo app.post i res.redirect('/') da bismo vratili back button na pocetnu stranicu ** 
// u html signup.html moramo uneti kod action="/failure". takozvano "Home-Route"
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




