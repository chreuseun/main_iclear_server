const express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors');
const ip_v4 = '192.168.254.154';
// JUST ERROR MESSAGE
var error = {message: "error"}

// APP
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
app.use(cors())


// ROUTES
app.use('/api',require('./routes/users/login'));  // USERS
app.use('/api', require('./routes/menu/menu')); // MENU
app.use('/api', require('./routes/educ_level/educ_level')) // EDUC_LEVEL
app.use('/api', require('./routes/departments/departments'))  // DEPARTMENTS
app.use('/api',require('./routes/acad_year/acad_year')) // ACAD_YEAR
app.use('/api',require('./routes/semester/semester')) // SEMESTER
app.use('/api', require('./routes/students/students')) // STUDENTS
app.use('/api', require('./routes/clearance/clearance'));

app.use('/',require('./routes/test/test')) // TEST FOR TESTING


app.listen(4040,ip_v4);
//10.83.19.175

console.log('Server is Running')