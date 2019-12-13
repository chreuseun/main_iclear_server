import React, { useState, useEffect } from 'react';
import { Button, Menu, Form } from 'semantic-ui-react';
import { withRouter,} from 'react-router-dom';
import axios from 'axios';
import baseURL from '../../../../../../../../../../../../../res/baseuri';
import { is } from '@babel/types';


const FormUpdateViolations = (props) => {
    const { location ,match, history } = props
    const {rowData} = props;

    const [didMount, setDidMount] = useState(false);
    const [v_name, setV_name] = useState( rowData.v_name || '' ); // v_name
    const [v_class_id, setV_Class_Id] = useState( rowData.violation_class_id || '' ); // violation_class_id
    const [isDeleted, setIsDeleted] = useState( rowData.is_deleted || '' ); // is_deleted
    const [desc, setDesc] = useState( rowData.v_description || '' ); // v_description
    
    const [classList, setClassList] = useState([])

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
                
                const violationDept = await axios.get(`${baseURL}/api/violation/user/${location.state.dept}/class`, header)

                if(UpdateHook){

                    let optionVioDept = violationDept.data.data.map((it, ix) => {
                        return(
                            {
                                text : it.name,
                                key : it.id,
                                value : it.id
                            }
                        )
                    })
                    
                    setClassList( optionVioDept || [] )
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

    const onIsDeletedChange = () => {  
        setIsDeleted(isDeleted==='0' ? '1' : '0')
    }

    const onButtonClicked = () => {

        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                let body = {
                    name : v_name,
                    description:desc ,
                    violation_class_id: v_class_id,
                    is_deleted:isDeleted,
                    id:rowData.v_id
                }

                const violationDept = await axios.post(`${baseURL}/api/violation/user/${location.state.dept}/violations/${rowData.v_id}/update`, body, header)

                if(violationDept){
                    alert('Violation Updated')
                } else {
                    alert('Violation Denied')
                }
            } catch(err) {
                console.log(err)
                history.push('/')
            }
        }

        fetchData()
    }

    const classChange = (e, {value}) => {
        setV_Class_Id(value)
    }

    return (
        <Form>

                <Form.Input fluid label='Violation Name' placeholder='Violation Name'
                    value ={v_name}
                    onChange={(e) => {setV_name(e.target.value)}}
                    style={{maxWidth:'300px'}}
                    maxLength={45}
                />

                <Form.Select
                    fluid
                    label='Class'
                    placeholder='Class'
                    options={classList}
                    value={v_class_id}
                    onChange={classChange}
                    style={{maxWidth:'300px'}}
                />
                    
              <Form.Checkbox
                onClick={onIsDeletedChange}
               toggle label='Enabled'  checked={isDeleted==='1' && isDeleted? false : true}/>

              <Form.TextArea  value={desc} label='Description' placeholder='Tell us more about the violation...'
               onChange={(e) => {setDesc(e.target.value)}}  maxLength={255} />
              
              
                <div>
                    <Menu secondary>
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Button onClick={onButtonClicked} animated='fade' secondary>
                                    <Button.Content visible>{'Save Changes'}</Button.Content>
                                    <Button.Content hidden> {'Save Changes'}</Button.Content>
                                </Button>
                            </Menu.Item>
                            
                        </Menu.Menu>
                    </Menu>
                </div>
            </Form>
    )      
}

export default withRouter(FormUpdateViolations);