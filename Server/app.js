// ExpressJs Application API - EndPoint
const express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors');

const ipAdd = require('./config/ipaddress');

const ip_v4 = ipAdd;

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
app.use(mobile, require('./routes/mobile/violation/violation'));
app.use(mobile, require('./routes/mobile/violationClass/violationClass'));

app.use('/',require('./routes/test/test')) // TEST FOR TESTING  

app.listen(4040,ip_v4);
//10.83.19.175

console.log(`Server is Running in ${ip_v4}`);
