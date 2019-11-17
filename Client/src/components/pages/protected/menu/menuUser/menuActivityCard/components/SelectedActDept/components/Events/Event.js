import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Menu, Message, Segment, Modal, Divider } from 'semantic-ui-react';
import { withRouter, Link} from 'react-router-dom';
import baseURL from '../../../../../../../../../../res/baseuri';
import axios from 'axios';

// Show ModalAddEvent
import ModalAddEvent from './components/ModalAddEvent/ModalAddEvent';

const Event = (props) => {

    console.log('Event.js prop: ', props )

    return(
        <React.Fragment>
            <Header
                as='h3'
                content='Manage Events'
                subheader='Manage your events details'
            />

            <Menu secondary>

                <Menu.Menu position='right'>
                    <Menu.Item>
                        <ModalAddEvent {...props}/>
                    </Menu.Item>
                </Menu.Menu>

            </Menu>

        </React.Fragment>
    )
}

export default Event;