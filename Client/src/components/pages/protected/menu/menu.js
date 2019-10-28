import React, { useState, useEffect } from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';


// COmponents 
import Loader from '../../../reuse/loader';

// Navbar for ADMIN
import NavbarAdmin from '../../../reuse/navbar/mainmenu/NavbarAdmin'; //ADMIN
import NavbarUser from '../../../reuse/navbar/mainmenu/NavbarUser';   // USER
import NavbarSubject from '../../../reuse/navbar/mainmenu/NavbarSubject';   // USER
import baseURL from '../../../../res/baseuri';

const Menu_ = (props) => {

    const { match, location, history } = props

    const [didMount, setDidMount] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({});

    const uri = {
        auth:`${baseURL}/api/auth`
    }

    useEffect((props)=>{

        setDidMount(true);
        let _isMounted = true;

        try {
            let response;

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            const init = async() =>{
                try {
                    response = await axios.post(uri.auth,{} ,header)

                    if(response.data.msg !== 'auth' || !response) {
                        localStorage.clear();
                        props.history.push("/");
                    }
                    
                    if(_isMounted) {        
                        setIsLoading(false);
                        setUserDetails(response.data.user_details);
                    }                  
                } catch(err){
                }  
            }

            init();
        } catch(err) {
            localStorage.clear();
            props.history.push("/");
        } 
    },[])

    if(!didMount) {
        return null
    }
  
    if(!isLoading) {
        if(userDetails.user_type_id === 'ADMIN'){
            return <NavbarAdmin userDetails={userDetails}/>
        }

        else if(userDetails.user_type_id === 'USER'){
            return <NavbarUser userDetails={userDetails}/>
        }

        else {
            return <NavbarSubject userDetails={userDetails}/>
        }

    } else {
        return <Loader loadText={'Loading...'}/>
    }

}

export default withRouter(Menu_)