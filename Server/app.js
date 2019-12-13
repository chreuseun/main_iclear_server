const express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors');

const ipAdd = {
    workable:`172.51.1.64`, 
    malis:`192.168.254.154`,
    marick:`192.168.100.10`,
    localhost: `127.0.0.1`

}


const ip_v4 = ipAdd.localhost;

// JUST ERROR MESSAGE
var error = {message: "error"}

// APP
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
app.use(cors())

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
app.use(endPointWebApp, require('./routes/class/class')); // CLASS
app.use(endPointWebApp,require('./routes/filter_student/filter_student')); //Filter_student

// ROUTES - MOBILE APPLICATION :)
app.use(mobile, require('./routes/mobile/student/mob_student'))

app.use('/',require('./routes/test/test')) // TEST FOR TESTING

app.listen(4040,ip_v4);
//10.83.19.175

console.log(`Server is Running in ${ip_v4}`)