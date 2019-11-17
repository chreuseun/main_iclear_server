import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Menu, Message, Segment, Modal, Divider } from 'semantic-ui-react';
import { withRouter, Link} from 'react-router-dom';
import baseURL from '../../../../../../../../../../res/baseuri';
import axios from 'axios';

const Records = () => {
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

export default Records;