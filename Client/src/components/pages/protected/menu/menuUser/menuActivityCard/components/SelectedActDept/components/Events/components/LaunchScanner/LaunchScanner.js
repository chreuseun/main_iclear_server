import React, { useState, useEffect } from 'react'
import { Container,Comment, Button, Image, Checkbox,Header, Grid, Dimmer, Input } from 'semantic-ui-react'
import {withRouter, useRouteMatch, useLocation, useHistory} from 'react-router-dom'
import queryString from 'querystring';
import baseURL from '../../../../../../../../../../../../res/baseuri';
import axios from 'axios';

const ModalScrollingExample = (props) => {

    const location = useLocation();

    const [loading, setLoading] = useState(true);

    const [eventDetails, setEventDetails] = useState({});
    const [timeMode, setTimeMode] = useState('');
    const [showScanner, setShowScanner] = useState(false);


    useEffect( () => {

        let updateHook = true;

        let parseEventId = queryString.parse((location.search).replace('?', ''));

        const FetchEventId = async()=>{
            try{

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                //parseEventId http://127.0.0.1:4040/api/activity/event/71 - GET
                const fetchEventDetailsByEventId = await axios.get(`${baseURL}/api/activity/event/${parseEventId.event_id}`, header)

                if(updateHook)
                {   
                    setLoading(false);
                    setEventDetails(fetchEventDetailsByEventId.data.data[0]);
                } 

            } catch(err) {
                alert('Error')
                // history.push('/')
            }
        }

        FetchEventId();

        return () => (updateHook=false)

    }, []);

    if(loading){
        return(null);
    }

    // SetTime Mode Function
    const setTimeModeConfig = (timeMode) => {
        setTimeMode(timeMode);
        setShowScanner(true);
    }

    // Cancell Scanning
    const cancelScanningButton = () => {
        setTimeMode('');
        setShowScanner(false);
    }

    return(
        <Container style={{marginTop: '50px'}}>

            <h2>Mode: {timeMode}</h2>
            
            <Header as='h2'>
                {eventDetails.name || ''}{' ('}{eventDetails.evt_name}{')'}
                
                <Header.Subheader>
                    Department: {eventDetails.student_department}
                </Header.Subheader>

                <Header.Subheader>
                    Academic Calendar: {eventDetails.sem_name}{'/'}{eventDetails.ay_name} 
                </Header.Subheader>

            </Header>

            <Grid columns={2} divided>

                <Grid.Row>

                    {showScanner && <ScannerComponent eventDetails={eventDetails} timeMode={timeMode} cancelScanningButton={cancelScanningButton}/>}

                    {!showScanner && <TimeModeSelection setTimeModeConfig={setTimeModeConfig}/>}

                </Grid.Row>

            </Grid>

            </Container>
    )
}

// SUB COMPONENTS
const ScannerComponent = (props) => {

    const [barcode, setBarcode] = useState('');
    const [scanMsg, setScanMsg] = useState({});
    const [scanHistory, setScanHistory] = useState([]);

    const onEnterKeyPress = (e) => {
        if(e.key === 'Enter'){
            onBarcoding()
        }
    }

    const onBarcoding = async() => {

        let timeMode_ ;
        if(props.timeMode==='TimeIn'){
            timeMode_ = 1
        }else {
            timeMode_ = 0
        }

        try{
            
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            let fetchActivity = await axios.post(`${baseURL}/api/activity/event/${props.eventDetails.id}/${timeMode_}/${barcode}`, {}, header);
            let fetchAttendanceRecords = await axios.get(`${baseURL}/api/activity/event/${props.eventDetails.id}/attendance`, header)

            setScanMsg(fetchActivity.data.data);
            setScanHistory(fetchAttendanceRecords.data.data);
            setBarcode('');

        }catch(err){
        }

    }

    return(
        <Grid.Column >

            <div>

                <div>

                    <Button
                        onClick={() => {props.cancelScanningButton()}} 
                        floated={'right'}>
                        Cancel
                    </Button>
                </div>

                <div>
                    <Input
                        onChange={(e)=>{
                            setBarcode(e.target.value)
                        }}
                        value={barcode}
                        onKeyPress={onEnterKeyPress}
                        placeholder={'Barcode'}
                        
                    />
                </div>

                <div style={{marginTop:'10px', marginBottom:'10px'}}>
                    <h2>{scanMsg.msg || ''}</h2>
                </div>

                <ScanHistory scanHistory={scanHistory}/>

            </div>

        </Grid.Column>
    )
}

// Time Mode Selector
const TimeModeSelection = (props) => {

    return(
        <Grid.Column >

            <div>
                <h4>Mode Selector:</h4>

                <div>
                    <Button
                        onClick={()=> props.setTimeModeConfig('TimeIn')}
                        secondary>Time In</Button> 
                </div>

                <div style={{marginTop:'10px'}}>
                    <Button
                        onClick={()=> props.setTimeModeConfig('TimeOut')}
                        secondary>Time Out</Button> 
                </div>

            </div>

            <hr/>

        </Grid.Column>
    )
}

const ScanHistory = (props) => {

    const ListScanHistory = () => {

        return(

            <React.Fragment>

            {
                props.scanHistory.map((itm, idx) => {
                return(
                        <Comment key={itm.id}>
                            <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />

                            <Comment.Content>

                                <Comment.Author>{itm.studlname}{', '}{itm.studfname}{' '}{itm.studmname}</Comment.Author>

                                <Comment.Metadata>
                                    <div>{itm.unique_key}</div>
                                </Comment.Metadata>

                                <Comment.Text>Time In : {itm.TimeIn}</Comment.Text>
                                <Comment.Text>TIme Out : {itm.TimeOut}</Comment.Text>

                            </Comment.Content>

                        </Comment>
                    )
                })
            }

            </React.Fragment>

        )
    }

    return(
        <Comment.Group>
        
            <Header as='h3' dividing>
                Scan History:
            </Header>

            <ListScanHistory/>

        </Comment.Group>
    )
}

export default withRouter(ModalScrollingExample)