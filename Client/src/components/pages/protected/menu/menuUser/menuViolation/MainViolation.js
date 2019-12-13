import React, {useState, useEffect} from 'react';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios'
import {  Grid, Button, Header, Message } from 'semantic-ui-react';
import baseURL from '../../../../../../res/baseuri';

const MyViolations = (props) => {

    const { location, history } = props
 
    const [didMount, setDidMount] = useState(false);
    const [myVioDeptList, setMyVioDeptList] = useState([]);

    useEffect(()=>{
        setDidMount(true);
        let UpdateHooks = true;

        const axiosAPI = async()=>{
            console.log('MainViolation.js useEffect() START')
            try{               
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                
                const result = await axios.get(`${baseURL}/api/violation/user`, header);
                
                if(UpdateHooks)
                {
                    if(result.data.data){
                        setMyVioDeptList(result.data.data);
                    } 
                    console.log('MainViolation.js useEffect() END')   
                }
            } catch(err) {
                console.log('MainViolation.js useEffect() ERROR')
                localStorage.clear();
                history.push('/')
            }        
        }

        axiosAPI();

        return () => (UpdateHooks=false)
    },[])

    if(!didMount) {
        return null
    }

    const GridMyVioDeptList = () => (
        <Grid stackable columns={2}>            
            <MyVioDeptItem pushToLink={props.pushToLink} location={location} deptArray={myVioDeptList}/>
        </Grid>
    ) 

    return(
        <React.Fragment>

            <div>
                <Header as='h2'>
                    Manage Violation System
                    <Header.Subheader>
                        Manage our student violation records
                    </Header.Subheader>
                </Header>
                            
            </div>

            <hr></hr>

            {
                myVioDeptList && myVioDeptList.length > 0 ?
                <GridMyVioDeptList/> :
                <MessageEmpty/>
            }
            
        </React.Fragment>
    )   
}

const MyVioDeptItem = (props) => {

    // to next page
    const pushTo = (path) => {
              
        var pushData = {
            pathname: `/menu/viol/${path}`,
            state: { dept: path }
        }

        // console.log('MainVIolation.js - '  ,pushData)
        // history.push(pushData)

        props.pushToLink(pushData);
    }

    return (
        <React.Fragment>
            {
                props.deptArray.map((it, ix)=>{
                    return(
                        <Grid.Column key={ix}>
                            
                            <Button 
                                onClick={()=>pushTo(it.d_id)}
                                key={it.d_id} 
                                inverted 
                                primary
                                size='huge'
                                fluid>{it.d_name}</Button>
                                                                
                        </Grid.Column>          
                 )})
            }
        </React.Fragment>
    )
}

const MessageEmpty =  () => {
    return(
        <Message warning>
            <Message.Header>Sorry, no departments is assigned to you.</Message.Header>
            <p>0 Results found, Visit our Admin/IT for your eligibility of dept. assignment</p>
        </Message>
    )
}

export default withRouter(MyViolations);

