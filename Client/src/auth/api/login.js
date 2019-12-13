import axios from 'axios';
import baseURL from '../../res/baseuri'

const login = async({us, pw, cb}) => {

    const uri = {
        login:`${baseURL}/api/login`,

    }

    const body = {
        username : us ,
        password : pw
    }

    const header = {
        headers: {
        }
    }

   

    try{
        let result = await axios.post(uri.login, body ,header);

        if(result.data.token){
                localStorage.setItem('x', 'Bearer ' + result.data.token)
                // console.log("Login")
                cb()  // push to '/menu'
        } else {
            result.data.msg === 'account locked' ? alert('User Account Locked') : alert('Invalid Username/Password')

            console.log(result.data.msg === 'account locked' ? result.data.msg : null )

            return(
                new Promise((resolve, reject)=> {
                    resolve(false)
                })
            )

        }

    } catch(err){
        return(
            new Promise((resolve, reject)=> {
                resolve(false)
            })
        )
    }
}

export default login

