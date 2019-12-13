import React, { useState, useEffect } from 'react'
import axios from 'axios';
import baseURL from '../.../../../../../../../../res/baseuri';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Table, Message, Header } from 'semantic-ui-react'


const ItemContent = (props) => {


    const { match, location, history } = props

    const [didMount, setDidMount] = useState(false);
    const [classList, setClassList] = useState([]);

    useEffect(() => {

        setDidMount(true);
        let xa = true;

        const fetchData = async() => {

            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                console.log('class_id: ', props.class_id)
                const result = await axios.get(`${baseURL}/api/class/student/${props.class_id}`,header);

                if(xa){
                    setClassList(result.data.data)
                    console.log('Class List: ', result.data.data)
                }

            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }

        fetchData();

        return () => (xa=false)

    }, []);

    if(!didMount){
        return null;
    }

    // MEssage if you dont have Any Students in a class
    const MessageExampleWarning =   () => (
        <div>
            <Message warning>
                <Message.Header>You don't have students for this subject</Message.Header>
                <p>0 Results</p>
            </Message>
        </div>   
    )

    // Table List of Students
    const TableClassIssueStudents = () => (
       <React.Fragment>

             <Button.Group floated='right' style={{marginBottom:'15px'}}>
                <Button onClick={()=>bulkOnRemarksClick('RESOLVED')} positive>Pass All</Button>
                <Button onClick={()=>bulkOnRemarksClick('PENDING')} negative>Not All</Button>
            </Button.Group>
       
            <Table selectable compact>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>UID</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Remarks</Table.HeaderCell>
                            <Table.HeaderCell>Uploaded</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {classList.map((it,ix)=>{
                            return(

                                <Table.Row key={it.id}>
                                    
                                    <Table.Cell>
                                        {it.student_username}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {
                                            `${it.studlname}, ${it.studfname} ${it.studmname}`
                                        }
                                    </Table.Cell>

                                    <Table.Cell>

                                        <Button
                                            onClick={()=>onRemarksClick([it.id], it.status === 'PENDING'? 'RESOLVED' : 'PENDING')}

                                            negative={ it.status === 'PENDING' ? true: false }

                                            positive={ it.status !== 'PENDING' ?true: false}
                                        >
                                            { it.status === 'PENDING' ? 'Not' : 'Pass' }
                                        </Button>

                                    </Table.Cell>

                                    <Table.Cell>
                                        {
                                            it.is_upload                                    
                                        }
                                    </Table.Cell>

                                    {/* <Table.Cell>{JSON.stringify(it)}</Table.Cell> */}
                                </Table.Row>                                
                            )
                        })}
                    </Table.Body>
                </Table>

        </React.Fragment>
    )

    // Title of Class
    const SubjectClassTitle = () => {
        let subjectTitle = '';
        let subjMetaData = '';

        if(classList.length > 0 && classList){

            const {cls_name, yearlevel, course, section, ay_name, sem_name, el_name, educ_level_id} = classList[0];
            
            // set subjtitle
            subjectTitle = cls_name

            // set Deatials of Subject
            subjMetaData = `${educ_level_id === 1 || educ_level_id === 2? '' : course} ${yearlevel} ${section} ${ay_name} ${educ_level_id === 1 || educ_level_id === 2? '' : sem_name}`
           
        }
        
        return(
            <Header as='h2'>
                {subjectTitle}

                <Header.Subheader>
                    {subjMetaData}
                </Header.Subheader>
            </Header>      
        )
    }

    // Functions ------

    // Update Remarks by single ID
    const onRemarksClick = async(class_issue_ids, remarks) => {

        try{            
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            };

            await axios.post(`${baseURL}/api/class/student/${props.class_id}/issue/${remarks}`, {class_issue_ids}, header);

            refreshDisplay()
        } catch(err) {
            // localStorage.removeItem('x')
            console.log(err)
            history.push('/')
        }
    }

    const bulkOnRemarksClick = async(remarks) => {
        try{            
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            };

            let class_issue_ids ;


            class_issue_ids = classList.map((it, ix) => {
                return(it.id)
            })

            await axios.post(`${baseURL}/api/class/student/${props.class_id}/issue/${remarks}`, {class_issue_ids}, header);

            refreshDisplay()
        } catch(err) {
            // localStorage.removeItem('x')
            console.log(err)
            history.push('/')
        }
    }

    // refresh list of student if changes show
    const refreshDisplay = async() => {
        try{
            
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            };

            const result = await axios.get(`${baseURL}/api/class/student/${props.class_id}`,header);

            setClassList(result.data.data)
          
        } catch(err) {
            // localStorage.removeItem('x')
            console.log(err)
            history.push('/')
        }
    }

    return(
        <React.Fragment>
            <Modal.Header>
                <SubjectClassTitle/>
            </Modal.Header>

            <Modal.Content>            
                {
                    classList.length === 0 ? // if no students in a class
                        MessageExampleWarning() : // then this
                        TableClassIssueStudents() // else do this
                }
            </Modal.Content>

        </React.Fragment>   
    )
}

export default withRouter(ItemContent)