*** SUBJECT TEACHER ***

1. Create Clearance for student
    Inputs:
        1. student_id
        2. teacher_acc_id
        3. department_id / Subject_id
        4. department_name
        5. educ_level_id
        6. department_type('SUBJECT')
        7. course(!-ALL || NONE)
        8. yrlevel(!-ALL && !NONE)
        9. section(NO NULL)
    Procedures:
        1. Insert record in `departments`
        2. Insert lastInsertId of `departments` to `department_account` with the account_id of the Subject teacher
        3. Then Okay.

2. Create Subject/Departments 
    Procedure:
        1. Set educ_level_id
        2. Set department_type_id('SUBJECT')
        3. Set name/subjectName
        4. Set course( [1,2] = 'NONE', [3,4] = <COURSE || STRAND> )
        5  Set YrLevel
        6. Set Section
        7. Set Head Officer('Name of teacher')
        8. Set acad_year(ACTIVE)
        9  Set semester(ACTIVE)
        10. If Supplied then
        11. 
