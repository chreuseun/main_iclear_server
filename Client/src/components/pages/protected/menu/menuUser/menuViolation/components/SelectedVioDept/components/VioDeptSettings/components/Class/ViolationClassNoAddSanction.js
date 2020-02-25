import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Message } from 'semantic-ui-react';
import { withRouter,} from 'react-router-dom';
import axios from 'axios';
import baseURL from '../../../../../../../../../../../../res/baseuri';

const ClassList = (props) => {

    const { location ,match, history } = props

    const [didMount, setDidMount] = useState(false);
    const [classList, setClassList] = useState([]);

    useEffect(() => {

        setDidMount(true);
        let UpdateHook = true;
        console.log('history  ', history)
        console.log('match  ', match)
        console.log('location  ', location)

        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };
                
                const violationDept = await axios.get(`${baseURL}/api/violation/user/${location.state.dept}/class`, header)
                console.log(violationDept.data.data  || '')
                if(UpdateHook){
                    setClassList( violationDept.data.data || [])
                }

            } catch(err) {
                console.log(err)
                history.push('/')
            }
        }

        fetchData();

        return () => (UpdateHook=false)

    },[])
    
    if(!didMount){
        return null;
    }

    const editOnClick =  (class_id) => {
        console.log(class_id)
    }

    return(
        <React.Fragment>

            {/* Table of class list*/}
            <Table compact='very'>

                {/* Column header for the table */}
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                {/* Rows of the table */}
                <Table.Body>
                    { classList.map(( it, ix ) => {
                        return(
                            <ClassRow {...props} key={it.id} 
                                rowData={it}
                                editOnClick={editOnClick}   
                             /> 
                        )
                    })}
                </Table.Body>
                
            </Table>

        </React.Fragment>
    )
}

// Row Component of the table
const ClassRow = (props) => {
    return(
        <Table.Row>

            {/* Class name */}
            <Table.Cell>{props.rowData.name}</Table.Cell>

            {/* Modal for Editing the class */}
            <Table.Cell>
                <Modal closeIcon 
                    size='fullscreen' 
                    trigger={
                        <Button
                            name={`${props.rowData.id}`}  
                            onClick={props.editOnClick.bind(this, props.rowData.id)}
                            secondary
                        >Offence level</Button>
                    }
                >
                    <Modal.Header>Sanctions: {props.rowData.name}</Modal.Header>
                    <Modal.Content>
                        <SanctionList {...props}/>
                    </Modal.Content>
                </Modal>
            </Table.Cell>
        </Table.Row> 
    )
}

// when modal is clicked then show this records
const SanctionList = (props) => {
    
    
    const { location ,match, history } = props
    const [list, setList] = useState([]);

    const [didMount, setDidMount] = useState(false);

    useEffect(() => {

        setDidMount(true);
        let UpdateHook = true;
        console.log('history  ', history)
        console.log('match  ', match)
        console.log('location  ', location)

        console.log('rowData', props.rowData)

        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                const classSanction = await axios.get(`${baseURL}/api/violation/user/${location.state.dept}/violations/sanction/${props.rowData.id}`, header)
      
                console.log(classSanction.data.data  || '')
                
                if(UpdateHook){
                    setList(classSanction.data.data || [])
                }

            } catch(err) {
                console.log(err)
                history.push('/')
            }
        }

        fetchData();

        return () => (UpdateHook=false)

    },[])

    const DataTable = () => {
        return(
            <Table selectable compact='very'>

            {/* Column header for the table */}
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Offence Level</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            {/* Rows of the table */}
            <Table.Body>
                {

                    list.map((it, ix)=> {
                        return(
                        <Table.Row key={it.vs_id}>

                            <Table.Cell>{it.offence_level}</Table.Cell>
                            <Table.Cell>{it.description}</Table.Cell>
                        </Table.Row>
                        )
                    })
                    
                }
            </Table.Body>

        </Table>
        
        )
    }
    
    return(
        <React.Fragment>

            {list && list.length > 0 ? 
                <DataTable/>:
                <MessageEmpty/>
            }

            {/* Table of sanction of the class */}

            
        </React.Fragment>
    )
}

const MessageEmpty =  () => {
    return(
        <Message warning>
            <Message.Header>Sorry, no departments is assigned to you.</Message.Header>
            <p>0 Results found, Visit our Admin/IT for your eligibility of dept. assignment</p>
        </Message>
    )
}

export default withRouter(ClassList)
