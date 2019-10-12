import axios from 'axios';

function login({us, pw, cb}) {
    
    const body = {
        username : us ,
        password : pw
    }

    const header = {

       
        headers: {
        }
    }
    
    axios.post('http://localhost:4040/api/login',body ,header)
    .then((response)=> {
        if(response.data.token) {
            localStorage.setItem('x', 'Bearer ' + response.data.token)
            // console.log("Login")
            cb() 
        } else {

            response.data.msg === 'account locked' ? alert('User Account Locked') : alert('Invalid Username/Password')

            
            console.log(response.data.msg === 'account locked' ? response.data.msg : null )
        }
    })
    .catch((err)=>{})
}


export default login

