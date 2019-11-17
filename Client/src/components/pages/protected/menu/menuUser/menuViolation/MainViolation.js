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
            try{               
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                const result = await axios.get(`${baseURL}/api/violation/user`, header);
                
                if(UpdateHooks)
                {
                    console.log(result.data.data)
                    if(result.data.data){
                        setMyVioDeptList(result.data.data);
                    }    
                }
            } catch(err) {
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
            <MyVioDeptItem location={location} deptArray={myVioDeptList}/>
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

    return (
        <React.Fragment>
            {
                props.deptArray.map((it, ix)=>{
                    return(
                        <Grid.Column key={ix}>
                            
                            <Button  
                                as={Link}
                                to={props.location.pathname + `/${it.d_id}`}
                                onClick={()=>{console.log(it.d_id, it)}}
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

