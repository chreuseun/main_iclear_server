import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Menu } from 'semantic-ui-react';
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
                
                const violationDept = await axios.get(`${baseURL}/api/violation/user/${match.params.dept}/class`, header)
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

            <div>
                <Menu secondary>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Button animated='fade' primary>
                                <Button.Content visible>{'Create Violation'}</Button.Content>
                                <Button.Content hidden> {'Create Violation'}</Button.Content>
                            </Button>
                        </Menu.Item>
                        
                    </Menu.Menu>
                </Menu>
            </div>  

            <Table compact='very'>

                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        classList.map(( it, ix ) => {
                            return(
                                <ViolationRow key={it.id} 
                                    rowData={it}
                                    editOnClick={editOnClick}   
                                /> 
                            )
                        })
                    } 
                </Table.Body>
                
            </Table>

        </React.Fragment>
    )
}

const ViolationRow = (props) => {
    return(
        <Table.Row>
            <Table.Cell>{props.rowData.name}</Table.Cell>

            <Table.Cell>
                <Modal closeIcon 
                    size='fullscreen' 
                    trigger={
                        <Button
                            name={`${props.rowData.id}`}  
                            onClick={props.editOnClick.bind(this, props.rowData.id)}
                            secondary
                        >Edit</Button>
                    }
                >
                    <Modal.Header>Sanctions: {props.rowData.name}</Modal.Header>
                    <Modal.Content>
                    
                    
                    </Modal.Content>
                </Modal>
            </Table.Cell>
        </Table.Row> 
    )
}


export default withRouter(ClassList)
