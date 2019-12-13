const router = require('express').Router();

// Insert One/Bulk to 'clearance_issue'.tbl
router.post('/clearance/issue/add', (req, res) => {

    const addClearance = require('./functions/addStudentClearance');


    console.log(req.body.toAdd)
    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : [req.body.addData]
    }

    addClearance(args)

    console.log('> POST - /api/clearance/issue/add')
})

// Get Student Records by student_username & departments_id
router.post(`/clearance/issue/get`, (req, res) => {
    
    // d_id , s_uid

    console.log(
        req.body.d_id,
        req.body.s_uid
    )

    const getStudentClearance = require('./functions/getStudentClearance');

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : [
            req.body.d_id,
            req.body.s_uid
        ]
    }

    getStudentClearance(args)

    console.log('> POST - /api/clearance/issue/get')
}) 

// Update Clearanc Issue By clearanc Issue ID
router.post(`/clearance/issue/update/:id/:remarks`, (req, res) => {
    const getStudentClearance = require('./functions/updateClearanceByID');

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : [
            req.params.remarks,
            req.params.id            
        ]
    }

    getStudentClearance(args)

    console.log('> POST - /api/clearance/issue/update/:id')
}) 

module.exports = router