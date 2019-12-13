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

const Menu = (props) => {

    const { match, location, history } = props

    const [didMount, setDidMount] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({});

    const uri = {
        auth:`${baseURL}/api/auth`
    }

    useEffect(()=>{

        setDidMount(true);
        let UpdateHooks = true;

        const login = () => {
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
                            history.push("/");
                        }
                        
                        if(UpdateHooks) {        
                            localStorage.setItem('user_details',  JSON.stringify(response.data.user_details))
                            setIsLoading(false);
                            setUserDetails(response.data.user_details);
                            
                            localStorage.setItem('user_details', );                            
                        }                  
                    } catch(err){

                    }  
                }

                init();

            } catch(err) {
                localStorage.clear();
                history.push("/");
            }
        }

        login()
            
        return () => (UpdateHooks=false)
    },[]);

    if(!didMount) {
        return null;
    }
 
    if(!isLoading) {

        //  Logged as admin
        if(userDetails.user_type_id === 'ADMIN'){
            return <NavbarAdmin userDetails={userDetails}/>
        }

        // logged as user = {dpeartment, violation, activity}
        else if(userDetails.user_type_id === 'USER'){
            return <NavbarUser userDetails={userDetails}/>
        }

        // logged as subject
        else{
            return <NavbarSubject userDetails={userDetails}/>
        }

    } else {
        return <Loader loadText={'Loading menu...'}/>
    }

}

export default withRouter(Menu)