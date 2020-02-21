import React, { useEffect, useState } from 'react';
import { withRouter, BrowserRouter, Link, useHistory} from "react-router-dom";
import { Menu,  Container, Dropdown, Header, Table, Checkbox, Button } from 'semantic-ui-react';
import Axios from 'axios';
import baseuri from '../../../../../../../res/baseuri';


const NavbarUser = (props) => {
    
    const { match, location, history } = props
    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({});

    useEffect(()=>{
        
        let UpdateHooks = true;

        const getUserDetails = () => {

            const fetchData = async() => {

                try{
                
                    const header = {
                        headers: {
                            authorization : localStorage.getItem('x')
                        }
                    };

                    const result = await await Axios.post(`${baseuri}/api/auth` ,{} ,header);

                    if(result.data.msg !== 'auth' || !result || result.data.user_details.user_type_id !== 'USER') {
                        // localStorage.clear();
                        // history.push("/");
                    }
                    
                    if(UpdateHooks) {        
                        setUserDetails(result.data.user_details);
                        setIsLoading(false);
                    }   
                } catch(err) {
                    // localStorage.clear();
                    // history.push("/");
                }
            };

            fetchData();

            return () => (UpdateHooks=false);
        };

        getUserDetails();

        return () => (UpdateHooks=false);
    },[]);

    const PushToTestLink =  () => {
        history.push({
            pathname: '/menu/subject/133'
        })
    }

    if(isLoading){
        return(null)
    }

    return(
        <React.Fragment>

            <BrowserRouter>
                <Menu color='blue' style={{}} stackable inverted  fixed='top'>
                    <Container>

                        <Link to="/menu">
                            <Menu.Item>
                                HOME 
                            </Menu.Item>
                        </Link>

                        <Menu.Menu position='right'>                            
                            <Dropdown item text={'Welcome, ' + userDetails.username}>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>{localStorage.clear();history.push('/')}} >Sign-Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Menu>
                    </Container>  
                </Menu>

                <Container style={{marginTop:"100px",background:'#F8F8F8',padding:'20px'}}>

                    <SubjectStudentList match={match}/>

                </Container>
            </BrowserRouter>
                
                

        </React.Fragment>
    );
}

const SubjectStudentList = (props) => {

  

    return(
        <React.Fragment>
            {/* With Header And tableStudentList */}
            <TableStudentList match={props.match}/>
        </React.Fragment>
    )
}

const PageHeader = (props) => {

    return(
        <Header as='h2'>

            {props.title.subdet_name || ""}{"-"} {props.title.subdet_code || ""} {'-'} {props.title.yearlevel || ""} { props.title.course === 'NONE'? "": ` - ${props.title.course}` || "" } {"-"} {props.title.section || ""}

            <Header.Subheader>
                {props.title.el_name}{` - `}{ `${props.title.ay_name}  ${props.title.sem_name}` }
            </Header.Subheader>
        </Header>
    )
}

const TableStudentList = (props) => {

    const history = useHistory();

    const [ studentList, setStudentList ] = useState([]);

    const effect = async(updateHook) => {

        try{

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            let fetchStudentList =  await Axios.get(`${baseuri}/api/subjclass/${props.match.params.subject_id}/student`, header);

            if(updateHook){
                setStudentList(fetchStudentList.data.data);
            }

        }catch(err){
            history.push('/')
        }

    }

    useEffect(() => {
        let updateHook = true;

        effect(updateHook);

        return () => {
            updateHook = false;
        };
    }, [])
    
    // function for Axios POST to update SubjectClearance
    const onUpdateSubjectClearanceUpdate = async({ remarks, subject_clearance_ids }) => {

        try{    
            
            let header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            let body = {
                subject_clearance_ids
            }

            let PostUpdateRemarks = await Axios.post(`${baseuri}/api/subjclass/56/${remarks}`,  body, header);

            effect(true);

        }catch(err){
            alert('Update remarks failed...')
        }

    }

    const onBulkStudentRemarksUpdate = (remarks) => {

        let SubjectIds = studentList.map((itm, idx) => {
            return(
                itm.substd_id
            )
        })


        onUpdateSubjectClearanceUpdate({remarks, subject_clearance_ids:SubjectIds  })

    }

    const TableBody = () => {
        return(
            <React.Fragment>
                {
                    studentList.map((itm, idx) => {
                        return(
                            <Table.Row key={itm.substd_id}>

                                <Table.Cell>{(itm.s_fullname)}</Table.Cell>

                                <Table.Cell>
                                    <Checkbox
                                        onClick={()=>{

                                            let remarks = itm.remarks === 'PASS' ? 'FAIL' : 'PASS'
                                            let subject_clearance_ids = itm.substd_id

                                            onUpdateSubjectClearanceUpdate({ remarks, subject_clearance_ids })
                                        }}
                                        checked={itm.remarks === 'PASS' ? true : false } toggle    />
                                </Table.Cell>

                            </Table.Row>
                        )
                    })
                }
            </React.Fragment>
        )
    }

    return(
        <React.Fragment>
            <PageHeader title = {studentList[0] || {}}/>

            <hr/>
            <br/>


            <div>
                <Button content='Pass all' primary 
                    onClick={() => {
                        onBulkStudentRemarksUpdate('PASS');
                    }}
                />
                <Button content='Fail all' secondary 
                    onClick={() => {
                        onBulkStudentRemarksUpdate('FAIL');
                    }}
                />
            </div>

            <Header size='medium'>Assign Subject Class</Header>

            <Table singleLine>

                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Remarks</Table.HeaderCell>
                   
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <TableBody/>
                </Table.Body>

            </Table>

      </React.Fragment>
    )
}

export default withRouter(NavbarUser);