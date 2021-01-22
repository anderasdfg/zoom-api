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
                    // var result =
                    //     "<meeting>" +
                    //     "<start_url>" +
                    //     start_url +
                    //     "</start_url>" +
                    //     "<linktojoin>" +
                    //     join_url +
                    //     "</linktojoin>" +
                    //     "</meeting>";
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