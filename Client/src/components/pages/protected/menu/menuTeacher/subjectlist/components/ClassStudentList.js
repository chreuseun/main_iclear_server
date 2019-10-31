import React, { useEffect, useState } from 'react'
import axios  from 'axios';
import baseURL from '../../../../../../../res/baseuri';
import { Card, Grid, Header,Modal, Button, Icon } from 'semantic-ui-react';
import {withRouter} from 'react-router-dom'


import ItemContent from './ClassStudentListContent';

const ClassSubjectList = (props) => {

    const {id, name, ay_name, sem_name, el_name, yearlevel, course, section} = props.it  || {}

    useEffect(() => {
        console.log('useEffect in ClassStudentList')
    }, [])


    return(
        <Modal size='fullscreen' trigger={
            <Grid.Row  key={id || ''}>
                <Grid.Column>                        
                    <Card fluid color={'blue'}>
                        <Card.Content>
                            <Card.Header>{name || ''}</Card.Header>
                            <Card.Meta>{ay_name || ''} {sem_name || ''} - {el_name || ''}</Card.Meta>
                            <Card.Description>
                                {yearlevel|| ''} - {course === 'NONE'? '' : course || ''}  {section || ''}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid.Row>
        }>

            <ItemContent  class_id={id} userDetails={props.userDetails}/>

        </Modal>    
    )
}


export default withRouter(ClassSubjectList);