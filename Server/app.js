const express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors');

// JUST ERROR MESSAGE
var error = {message: "error"}

// APP
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
app.use(cors({origin: 'http://localhost:3000',
optionsSuccessStatus: 200}))

// ROUTES
app.use('/api',require('./routes/users/login'));  // USERS
app.use('/api', require('./routes/menu/menu')); // MENU
app.use('/api', require('./routes/educ_level/educ_level')) // EDUC_LEVEL
app.use('/api', require('./routes/departments/departments'))  // DEPARTMENTS
// app.use('/api',require('./routes/acad_year/acad_year')) // ACAD_YEAR
// app.use('/api',require('./routes/semester/semester')) // SEMESTER
app.use('/',require('./routes/test/test'))


app.listen(4040, () => {console.log('Server Started on PORT:4040')});