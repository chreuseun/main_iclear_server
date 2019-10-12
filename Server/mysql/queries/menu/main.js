// SQL QUERIES
const main = {
    // SELECT 1 USER NAME for Login
    select_admin_main_menu : `SELECT 
                                a.id,
                                a.username,
                                a.state,
                                a.is_locked
                                
                            FROM account AS a

                            WHERE
                                a.state = 1
                                AND a.is_locked = 0
                                AND a.user_type_id = 'ADMIN' -- 
                                AND  a.id = ? --
                            LIMIT 1` ,

    select_user_main_menu : `SELECT 
                                a.id AS a_id,
                                a.username,
                                a.user_type_id,
                            
                                d.id AS d_id,
                                d.yearlevel AS d_yearlevel,
                                d.course AS d_course,
                                d.department_type_id as d_type_id,
                                dt.name AS d_type_name,
                                
                                d.educ_level_id as el_id,    
                                el.name AS el_name

                            FROM account AS a
                            JOIN account_departments AS ad ON ad.account_id = a.id
                            JOIN departments AS d ON d.id = ad.departments_id
                            JOIN departments_type AS dt ON dt.id = d.department_type_id
                            JOIN educ_level AS el ON el.id = d.educ_level_id

                            WHERE a.state = 1
                                AND a.is_locked = 0
                                AND el.state = 1
                                AND d.state = 1
                                AND a.id = ?
                                AND a.user_type_id != 'ADMIN'`
}
        

module.exports = main;
