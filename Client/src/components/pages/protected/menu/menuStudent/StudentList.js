import React,{ useEffect, useState } from 'react';
import { Button, Header, Menu, Input, Table, Form, Select } from 'semantic-ui-react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import baseURL from '../../../../../res/baseuri';
import { IoMdSearch } from "react-icons/io";

const StudentList = (props) => {

    const {match, history, location} = props;

    const [didMount, setDidMount ] = useState(false);
    const [student, setStudent ] = useState([])

    useEffect(()=>{

        let updateHook = true;
        console.log('useEffect ')


        const getUserDetails = async() => {

            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };
                
                // /api/student
                const result = await axios.get(`${baseURL}/api/student` ,header);

                if(updateHook){
                    setStudent(result.data.data || [])
                }

            } catch(err) {
                localStorage.clear();
                history.push("/");
            }
        

        };

        getUserDetails();

        return () => (updateHook=false);


        
    },[])

    const optionSample = [
        {key:'1', value:'1', text:'Hello There'},
        {key:'2', value:'2', text:'Turn it there'},
        {key:'3', value:'3', text:'Make There'}
    ]

    const genderOptions = [
        { key: 'm', text: 'Male', value: 'male' },
        { key: 'f', text: 'Female', value: 'female' },
        { key: 'o', text: 'Other', value: 'other' },
    ]

    const onEnterKeyDown = (e) => {
        if(e.key === 'Enter'){
            console.log(e.key)
        }
    }

    return(
        <div>
            <Header
                as='h2'
                content='Student Records' 
                subheader='List of Studens save on the database.'
            />

            {/* Searching */}
            <div>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Field
                            id='form-input-control-first-name'
                            control={Input}
                            label='Search'
                            onKeyDown={onEnterKeyDown}
                            placeholder='Student Name / Username'
                        
                        />
                        
                        <Form.Field
                            control={Select}
                            options={genderOptions}
                            label='Level'
                            placeholder='Level'
                            search
                            onChange={()=>{console.log('changed here')}}
                            searchInput={{ id: 'form-select-control-gender' }}
                            
                        />

                        <Form.Field
                            control={Select}
                            options={genderOptions}
                            label='Course'
                            placeholder='Course'
                            search
                            onChange={()=>{console.log('changed here')}}
                            searchInput={{ id: 'form-select-control-gender' }}
                            
                        />

                        <Form.Field
                            control={Select}
                            options={genderOptions}
                            label='Yearlevel'
                            placeholder='Year Level'
                            search
                            onChange={()=>{console.log('changed here')}}
                            searchInput={{ id: 'form-select-control-gender' }}
                            
                        />

                      <Form.Field
                            control={Select}
                            options={genderOptions}
                            label='Section'
                            placeholder='Section'
                            search
                            onChange={()=>{console.log('changed here')}}
                            searchInput={{ id: 'form-select-control-gender' }}
                            
                        />
                    
                    </Form.Group>

                    <Form.Group widths='equal'>
                   

                    </Form.Group>    


                </Form>
            </div>

            {/* Table */}
            <div>
                <Table compact>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Username</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Course</Table.HeaderCell>
                        <Table.HeaderCell>Section</Table.HeaderCell>
                        <Table.HeaderCell>Yearlevel</Table.HeaderCell>
                        <Table.HeaderCell>SchoolYear</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>


                        {student.map((it,ix)=>{
                            return(
                                <Table.Row>
                                    <Table.Cell>{it.username}</Table.Cell>
                                    <Table.Cell>{`${it.studlname}, ${it.studfname}, ${it.studmname}`}</Table.Cell>
                                    <Table.Cell>{it.course}</Table.Cell>
                                    <Table.Cell>{it.section}</Table.Cell>
                                    <Table.Cell>{it.yearlevel}</Table.Cell>
                                    <Table.Cell>{`${it.sem_name} | ${it.ay_name}`}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                      
                    </Table.Body>
                </Table>
            </div>

        </div>
    )

};

export default withRouter(StudentList);