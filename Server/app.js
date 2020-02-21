// ExpressJs Application API - EndPoint
const express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors');
const path = require('path');

const ipAdd = {
    workable:`172.51.1.64`, 
    malis:`192.168.254.179`,
    marick:`192.168.100.10`,
    localhost: `127.0.0.1`,
    maam_tejada: `192.168.43.15`,
    thesis:`192.168.43.68`
}

const ip_v4 = ipAdd.maam_tejada;

var error = {message: "error"}

// APP
const app = express();


// var htmlpath = path.join(__dirname, '/public');

// console.log(htmlpath)

app.use('/static' , express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }))
,
app.use(bodyParser.json());
app.use(cors());


const endPointWebApp = '/api';
const mobile = '/api/mobile';

// ROUTES
app.use(endPointWebApp, require('./routes/users/login'));  // USERS
app.use(endPointWebApp, require('./routes/menu/menu')); // MENU
app.use(endPointWebApp, require('./routes/educ_level/educ_level')) // EDUC_LEVEL
app.use(endPointWebApp, require('./routes/departments/departments'))  // DEPARTMENTS
app.use(endPointWebApp, require('./routes/violation/violation'))// VIOLATIONS
app.use(endPointWebApp, require('./routes/activity/activty'))// ACTIVITY
app.use(endPointWebApp,require('./routes/acad_year/acad_year')) // ACAD_YEAR
app.use(endPointWebApp,require('./routes/semester/semester')) // SEMESTER
app.use(endPointWebApp, require('./routes/students/students')) // STUDENTS
app.use(endPointWebApp, require('./routes/clearance/clearance')); // CLEARANCE
app.use(endPointWebApp, require('./routes/class/class')); // CLASS OLD
app.use(endPointWebApp,require('./routes/filter_student/filter_student')); //FILTER STUDENT
app.use(endPointWebApp, require('./routes/subjectClass/subjectClass')); // Registrar new adding

// app.use(endPountWebApp, require('./'))

// ROUTES - MOBILE APPLICATION :)
app.use(mobile, require('./routes/mobile/student/mob_student'));
app.use(mobile, require('./routes/mobile/clearance/mob_clearance'));

app.use('/',require('./routes/test/test')) // TEST FOR TESTING  

app.listen(4040,ip_v4);
//10.83.19.175

console.log(`Server is Running in ${ip_v4}`);
