import axios from 'axios';
 
const header = {
    headers: {
        authorization : localStorage.getItem('x')
    }
}

const isLogged = async(cb) => {
    let response
    console.log('1')
    try{
        response = await axios.post('http://localhost:4040/api/auth',{} ,header)
        
    } catch(err) {
        localStorage.clear()
        cb()
    }
    
    if(response.data.msg === 'denied' || !response) {
        localStorage.clear()
        cb()
    }

    console.log(response)
} 



export default  isLogged;

