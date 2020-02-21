const router = require('express').Router();
const url = require('url');

// USER ACTIVTY tab is clicked list all ACTIVITY departments os the logged user
router.get('/activity/user', (req, res) => {

    const GetViolationDeptByIdd = require('./functions/getActDeptByAccId')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
        ]
    }

    GetViolationDeptByIdd(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
})

// Get Activity Dept Types
router.get('/activity/types', (req, res) => {

    const GetActivityType = require('./functions/getActivityType')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
        ]
    }

    GetActivityType(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
})

// Get Events By Dept Idt
router.get('/activity/:deptId/events', (req, res) => {

    console.log(req.url)

    var q =url.parse(req.url, true);
    console.log(q.query)

    const GetAllEventByDeptId = require('./functions/getAllEventByDeptId')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
            req.params.deptId
        ]
    }

    GetAllEventByDeptId(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
})

// POST Activity Insert New Event 
router.post('/activity/event/add', (req, res) => {

    const AddNewEvent = require('./functions/addNewEvent')

    let token = req.headers.authorization

    console.log(req.body);
//     { name: 'event name',
//   type: 1,
//   department: 'CCS',
//   dep_id: '121',
//   acc_id: 121 } 


    const { name, type, department, dep_id, acc_id} = req.body

    args = {
        res, 
        token ,
        params:[
            dep_id,
            type,
            name,
            department,
            acc_id
        ]
    }

    AddNewEvent(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
})

// GET ONE event details by Id 
router.get('/activity/event/:event_id', async(req, res) => {

    const GetEventDetailsByEventId = require('./functions/getEventDetailsByEventId')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:{
            event_id: req.params.event_id
        }
    }

    GetEventDetailsByEventId(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
});

// INSERT ATTENDANCE IN AN EVENT VIA BARCODE
router.post('/activity/event/:event_id/:time_mode/:barcode', async(req, res) => {

    const AddAttendanceEvent = require('./functions/addAttendanceEvent')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:{
            event_id: req.params.event_id,
            time_mode:req.params.time_mode,
            barcode: req.params.barcode
        }
    }

    AddAttendanceEvent(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
})

// Get Scanned attendance in event via Barcode
router.get('/activity/event/:event_id/attendance', async(req, res) => {

    const GetAttendanceEventRecords = require('./functions/getAttendanceEventRecords')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:{
            event_id : req.params.event_id
        }
    }

    GetAttendanceEventRecords(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
})

router.get('/activity/event/attendance/records', async(req, res) => {

    const GetAttendanceEventRecordsMain = require('./functions/getAttendanceRecordsMain')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:{
            event_id : req.params.event_id
        }
    }

    GetAttendanceEventRecordsMain(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
})

module.exports = router