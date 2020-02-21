import React, { useEffect, useState } from 'react';
import { Header, Button, Table, Menu, Message, Segment, Modal, Divider, Label, Icon } from 'semantic-ui-react';
import { withRouter} from 'react-router-dom';
import baseURL from '../../../../../../../../../../res/baseuri';
import axios from 'axios';

const Records = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const effect = async(updateHook) => {
        
        try{

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            };

            let fetchAttendanceRecordsMain = await axios.get(`${baseURL}/api/activity/event/attendance/records`, header);

            if(updateHook){
                setAttendanceRecords(fetchAttendanceRecordsMain.data.data);
                setIsLoading(false);
            }

        }catch(err){
            alert('effect Error');
        }

    }

    useEffect(() => {

        let updateHook = true;

        effect(updateHook);

        return () => {
            updateHook = false
        };
    }, [])

    if(isLoading){
        return(
            null
        )
    }

    return(
        <React.Fragment>
            <RecordSubmenuHeader/>
            <hr/>
            <TableListAttendanceRecords attendanceRecords={attendanceRecords}/>
        </React.Fragment>

    )
}

const RecordSubmenuHeader = () => {
    return(
        <React.Fragment>
            <Header
                as='h3'
                content='Manage Records'
                subheader='Manage your attendance records'
            />



        </React.Fragment>
    )
}

const TableListAttendanceRecords = (props) => {
    return(
        <Table >

            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Event</Table.HeaderCell>
                    <Table.HeaderCell>Attnc. Code</Table.HeaderCell>
                    <Table.HeaderCell>Dept.</Table.HeaderCell>
                    <Table.HeaderCell>Student</Table.HeaderCell>
                    <Table.HeaderCell>TimeIn</Table.HeaderCell>
                    <Table.HeaderCell>TimeOut</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Acad. Yr.</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>

                {props.attendanceRecords.map((itm,idx) => {
                    
                    return(
                        <Table.Row key={itm.id} negative={itm.status === 'COMPLETED' ? false : true}>
                            <Table.Cell>{itm.event_name}</Table.Cell>
                            <Table.Cell>{itm.unique_key}</Table.Cell>
                            <Table.Cell>{itm.student_department}</Table.Cell>
                            <Table.Cell>{itm.studlname}{', '}{itm.studfname}{' '}{itm.studfname}</Table.Cell>
                            <Table.Cell>{itm.TimeIn}</Table.Cell>
                            <Table.Cell>{itm.TimeOut}</Table.Cell>
                            <Table.Cell>{itm.status}</Table.Cell>
                            <Table.Cell>{itm.sem_name}{'/'}{itm.ay_name}</Table.Cell>
                        </Table.Row>
                    )

                }) }

                



            </Table.Body>

        </Table>
    )
}

export default withRouter(Records);