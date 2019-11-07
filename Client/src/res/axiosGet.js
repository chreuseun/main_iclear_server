import axios from 'axios';
import baseURL from './baseuri';

const axiosGetPromise = ({route}) => (
    new Promise(async(resolve, reject) => {
        
        // External Data 
        let route =  `/api/violation/user`  // _route // '/api/departments/user';
        // let sample_token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE5LCJ1c2VybmFtZSI6ImNsX3Zpb1VTRVIiLCJ1c2VyX3R5cGVfaWQiOiJVU0VSIiwiaWF0IjoxNTcyNjYwNTg5LCJleHAiOjE1NzI3NDY5ODl9.FhaXT85LsJ6awngtYc4izHOfY1ueG4-i-C1j36F6e40`

        const header = {
            headers: {
                authorization : localStorage.getItem('x')
            }
        }

        try{
            
            const result = await axios.get(`${baseURL}${route}`, header);
                
            resolve(result);
                
            
        } catch(err) {
            resolve(undefined)
        }
    })
)

export default axiosGetPromise

// let data =async() => {

//    let data = await axiosGetPromise()

//    if(data){
//     console.log(data.data.data)
//    }else{
//     console.log('Not Found')
//    }
// }

// data();

// console.log(reactApp)
