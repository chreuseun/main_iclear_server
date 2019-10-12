import React, { Component } from 'react'
import axios from 'axios';


// COmponents 
import Loader from '../../../reuse/loader';

// Navbar for ADMIN
import NavbarAdmin from '../../../reuse/navbar/mainmenu/NavbarAdmin';
import NavbarUser from '../../../reuse/navbar/mainmenu/NavbarUser';

export default class Menu extends Component {
    _isMounted = false;
    
    state={
        isLoading: true,
        userDetails: {}
    }

    componentDidMount() {
        this._isMounted = true;

        try {
            let response;

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            const init = async() =>{
                try {
                    response = await axios.post('http://localhost:4040/api/auth',{} ,header)

                    if(response.data.msg !== 'auth' || !response) {
                        localStorage.clear();
                        this.props.history.push("/");
                    }
                    
                    if(this._isMounted) {
                        this.setState({
                            isLoading:false,
                            userDetails: response.data.user_details
                        })
                    }                  
                } catch(err){
                }  
            }

            init();
        } catch(err) {
            localStorage.clear();
            this.props.history.push("/");
        } 
    }

    componentWillUnmount() {
        this._isMounted = false;
     }

    //just logout...
    clickLogout = () =>{
        localStorage.removeItem('x')
        this.props.history.push("/")
    }

    render() {
        console.log(this.state.userDetails)

        if(!this.state.isLoading) {
            if(this.state.userDetails.user_type_id === 'ADMIN'){
                return <NavbarAdmin userDetails={this.state.userDetails}/>
            }

            if(this.state.userDetails.user_type_id === 'USER'){
                return <NavbarUser userDetails={this.state.userDetails}/>
            }
            
        } else {
            return <Loader loadText={'Loading...'}/>
        }
    }
}