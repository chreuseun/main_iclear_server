import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Menu } from 'semantic-ui-react';
import { withRouter} from 'react-router-dom';
import baseURL from '../../../../../../../../../../../../res/baseuri';
import axios from 'axios';


import FormUpdateViolation from './components/FormUpdateViolation';
import FormInsertViolation from './components/FormInsertViolation'

const ViolationList = (props) => {

    const { location ,match, history } = props

    const [didMount, setDidMount] = useState(false);
    const [vioDept, setVioDept] = useState([]);
    const [modalAddOpen, setModalAddOpen] = useState(false);

    useEffect(() => {

        setDidMount(true);
        let UpdateHook = true;

        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };
                
                const violationDept = await axios.get(`${baseURL}/api/violation/user/${location.state.dept}/violations`, header)

                if(UpdateHook){
                    setVioDept(violationDept.data.data || [])
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

    // refresh list for the violation
    const onClose = () => {
        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };
                
                const violationDept = await axios.get(`${baseURL}/api/violation/user/${location.state.dept}/violations`, header)
                    setVioDept(violationDept.data.data || []);
                    setModalAddOpen(false);

            } catch(err) {
                console.log(err)
                history.push('/')
            }
        }

        fetchData();
    }

    const openModalMethod = () => {
        setModalAddOpen(true);
    }

    return(
        <React.Fragment>  
            <div>
                <Menu secondary>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Button primary
                            onClick={ ()=>{openModalMethod()} }
                            >Create Violation</Button>
                            {/* click to display Modal Insert new violation */}
                           { modalAddOpen && <FormInsertViolation onClose={onClose}/> }
                            
                        </Menu.Item>
                        
                    </Menu.Menu>
                </Menu>
            </div>

            <div style={{ overflowX:'scroll'}}>
                <Table selectable   compact='very'>
                    <Table.Header >
                        <Table.Row>
                            <Table.HeaderCell>Violation</Table.HeaderCell>
                            <Table.HeaderCell style={{maxWidth:'300px'}} >Description</Table.HeaderCell>
                            <Table.HeaderCell>Class</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            vioDept.map(( it, ix ) => {
                                return(
                                    <ViolationRow key={it.v_id} 
                                        rowData={it}
                                        onClose={onClose}
                                    /> 
                                )
                            })
                        }
                    </Table.Body>
                </Table>
            </div>
        </React.Fragment>
    )
}

const ViolationRow = (props) => {

    return(
        <Table.Row negative={props.rowData.is_deleted==='0'? false : true} positive={props.rowData.is_deleted==='0'? true : false}>
            <Table.Cell>{props.rowData.v_name || ''}</Table.Cell>
            <Table.Cell  style={{maxWidth:'300px', wordBreak:'break-all'}}>{props.rowData.v_description || ''}</Table.Cell>
            <Table.Cell>{props.rowData.v_class || ''}</Table.Cell>
            <Table.Cell>
                
                <Modal closeIcon onClose={props.onClose}

                    size='fullscreen' 
                    trigger={
                        <Button animated='fade' secondary>
                            <Button.Content visible>{'Edit'}</Button.Content>
                            <Button.Content hidden> {'Edit'}</Button.Content>
                        </Button>
                    }
                >
                    <Modal.Header>{`${props.rowData.v_name}`}</Modal.Header>
                    <Modal.Content>
                    
                        <div>
                            <FormUpdateViolation rowData={props.rowData}/>
                        </div>

                    </Modal.Content>
                </Modal>
            </Table.Cell>
        </Table.Row> 
    )
}

export default withRouter(ViolationList)

