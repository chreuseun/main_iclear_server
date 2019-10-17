import axios from 'axios';
import baseURL from '../../res/baseuri'

function isLogged({cb=()=>{}, cbf=()=>{}}) {
    
    const header = {
        headers: {
            authorization : localStorage.getItem('x')
        }
    }
    
    axios.post(`${baseURL}/api/auth`,{} ,header)
    .then((response)=> {
        if(response.data.msg === 'auth') {
            cb()
        } else {
            cbf()
        }
    })
    .catch(()=>{
        cbf()
    })
}


export default  isLogged

