import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Menu, Message, Segment, Modal, Form, Loader, Dimmer } from 'semantic-ui-react';
import { withRouter, Link} from 'react-router-dom';
import baseURL from '../../../../../../../../../../../../res/baseuri';
import axios from 'axios';

const LaunchScanner = (props) => {
    console.log('LaunchScanner')
    return(
        <div>
            <Button primary>

            </Button>
        </div>
    )
}

export default withRouter(LaunchScanner);