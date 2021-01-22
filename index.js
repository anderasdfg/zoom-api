//include required modules
const axios = require("axios").default;
const jwt = require("jsonwebtoken");
const config = require("./config");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

var email, userid, resp, topic, datemeeting, password, duration;

app.set("port", process.env.PORT || 3000);

//Use the ApiKey and APISecret from config.js
const payload = {
    iss: config.APIKey,
    exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, config.APISecret);
console.log(token);

//get the form
app.get("/", (req, res) => res.send(req.body));
//api para crear reuniones
app.post(
    "/crear/:correo/:topic/:datemeeting/:password/:key/:secret/",
    (req, res) => {
        topic = req.params.topic;
        datemeeting = req.params.datemeeting;
        password = req.params.password;
        medicoalternativo = req.params.medico;
        key = req.params.key;
        secret = req.params.secret;

        //usamos el api key y api secret obtenidos por parametros para la creación del token para poder usar las APIs
        const payload = {
            iss: key,
            exp: new Date().getTime() + 5000,
        };
        const apitoken = jwt.sign(payload, secret);

        const headers = {
            "content-type": "application/json",
            Authorization: "bearer " + apitoken,
        };

        const body = {
            topic: topic,
            type: 1,
            start_time: datemeeting,
            duration: 120,
            timezone: "America/Lima",
            password: password,
            agenda: "CITA VIRTUAL",
            recurrence: {
                type: 1,
            },
            settings: {
                host_video: true,
                participant_video: true,
                cn_meeting: false,
                in_meeting: false,
                join_before_host: true,
                mute_upon_entry: false,
                watermark: false,
                use_pmi: false,
                approval_type: 2,
                registration_type: 0,
                auto_recording: "cloud",
                enforce_login: false,
                global_dial_in_countries: [],
                registrants_email_notification: false,
            },
        };

        axios
            .post(
                `https://api.zoom.us/v2/users/${req.params.correo}/meetings`,
                body, {
                    headers: headers,
                }
            )
            .then((response) => {
                console.log("respuesta del api owo");
                console.log(response.data);
                console.log(response.data.id);
                var start_url = response.data.start_url;
                var join_url = response.data.join_url;
                console.log(response.data.password);

                var result = {
                    error: {
                        errorcode: "",
                        errordescription: ""
                    },
                    start_url: start_url,
                    join_url: join_url
                }
                res.send(result);
            })
            .catch((err) => {
                console.log("Ocurrió un error");
                if (err.response) {
                    console.log("Obteniendo resultados del error");
                    console.log(err.response);
                    console.log(err.response.data.code);
                    console.log(err.response.data.message);
                    var result = {
                        error: {
                            errorcode: err.response.data.code,
                            errordescription: err.response.data.message
                        },
                        start_url: "",
                        join_url: ""
                    }
                    res.send(result);
                }
            });
    }
);

app.listen(app.get("port"), () =>
    console.log(`Zoom-api listening on port ${app.get("port")}!`)
);

// const jwt = require('jsonwebtoken');
// const config = require('./config');
// const rp = require('request-promise');

// const express = require('express');
// const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.use(express.json());
// var email, userid, resp, topic, datemeeting, password, duration;
// //const port = 3000;

// app.set('port', process.env.PORT || 3000)


// //Use the ApiKey and APISecret from config.js
// const payload = {
//     iss: config.APIKey,
//     exp: ((new Date()).getTime() + 5000)
// };
// const token = jwt.sign(payload, config.APISecret);
// console.log(token);

// //get the form 
// app.get('/', (req, res) => res.send(req.body));

// //use userinfo from the form and make a post request to /userinfo
// app.post('/userinfo', (req, res) => {
//     //store the email address of the user in the email variable
//     email = req.body.email;
//     //check if the email was stored in the console
//     console.log(email);
//     //Store the options for Zoom API which will be used to make an API call later.
//     var options = {
//         //You can use a different uri if you're making an API call to a different Zoom endpoint.
//         uri: "https://api.zoom.us/v2/users/" + email,
//         qs: {
//             status: 'active'
//         },
//         auth: {
//             'bearer': token
//         },
//         headers: {
//             'User-Agent': 'Zoom-api-Jwt-Request',
//             'content-type': 'application/json'
//         },
//         json: true //Parse the JSON string in the response
//     };

//     //Use request-promise module's .then() method to make request calls.
//     rp(options)
//         .then(function(response) {
//             //printing the response on the console
//             console.log('User has', response);
//             //console.log(typeof response);
//             resp = response
//                 //Adding html to the page
//             var title1 = '<center><h3>Your token: </h3></center>'
//             var result1 = title1 + '<code><pre style="background-color:#aef8f9;">' + token + '</pre></code>';
//             var title = '<center><h3>User\'s information:</h3></center>'
//                 //Prettify the JSON format using pre tag and JSON.stringify
//             var result = title + '<code><pre style="background-color:#aef8f9;">' + JSON.stringify(resp, null, 2) + '</pre></code>'
//             res.send(result1 + '<br>' + result);

//         })
//         .catch(function(err) {
//             // API call failed...
//             console.log('API call failed, reason ', err);
//         });
// });

// //api para crear reuniones
// app.post('/crear/:correo/:topic/:datemeeting/:password/:key/:secret/', (req, res) => {

//     topic = req.params.topic;
//     datemeeting = req.params.datemeeting;
//     password = req.params.password;
//     medicoalternativo = req.params.medico;
//     key = req.params.key;
//     secret = req.params.secret;

//     //usamos el api key y api secret obtenidos por parametros para la creación del token para poder usar las APIs
//     const payload = {
//         iss: key,
//         exp: ((new Date()).getTime() + 5000)
//     };
//     const apitoken = jwt.sign(payload, secret);


//     var options = {
//         method: 'POST',
//         //End point para crear reuniones
//         uri: "https://api.zoom.us/v2/users/" + req.params.correo + "/meetings",
//         headers: {
//             'content-type': 'application/json',
//             'Authorization': 'bearer ' + apitoken
//         },
//         body: {
//             "topic": topic,
//             "type": 1,
//             "start_time": datemeeting,
//             "duration": 120,
//             "timezone": "America/Lima",
//             "password": password,
//             "agenda": "CITA VIRTUAL",
//             "recurrence": {
//                 "type": 1
//             },
//             "settings": {
//                 "host_video": true,
//                 "participant_video": true,
//                 "cn_meeting": false,
//                 "in_meeting": false,
//                 "join_before_host": true,
//                 "mute_upon_entry": false,
//                 "watermark": false,
//                 "use_pmi": false,
//                 "approval_type": 2,
//                 "registration_type": 0,
//                 "auto_recording": "cloud",
//                 "enforce_login": false,
//                 "global_dial_in_countries": [],
//                 "registrants_email_notification": false
//             }
//         },
//         json: true //Parse the JSON string in the response
//     };
//     rp(options)
//         .then(function(response) {

//             resp = response
//             var title = '<center><h3>Datos de la reunión:</h3></center>'

//             var body = JSON.stringify(resp, null, 2);
//             var myjson = JSON.parse(body);

//             var meetingid = myjson["id"];
//             var start_url = myjson["start_url"];

//             var passwordmeeting = myjson["password"];

//             var linktoJoin = "https://zoom.us/wc/join/" + meetingid + "?pwd=" + passwordmeeting;

//             var result = "<meeting>" + "<start_url>" + start_url + "</start_url>" + "<linktojoin>" + linktoJoin + "</linktojoin>" + "</meeting>";
//             res.send(result);
//             console.log(result + body);

//         })
//         .catch(function(err) {
//             console.log('API call failed, reason ', err);
//         });
// });

// app.listen(app.get('port'), () => console.log(`Example app listening on port ${app.get('port')}!`));