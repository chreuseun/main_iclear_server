import axios from 'axios';

function isLogged({cb=()=>{}, cbf=()=>{}}) {
    
    const header = {
        headers: {
            authorization : localStorage.getItem('x')
        }
    }
    
    axios.post('http://localhost:4040/api/auth',{} ,header)
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

