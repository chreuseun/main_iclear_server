var axios = require('axios')

const accessRedash = async () => {

    const API_TOKEN = 'VDbLXXXK5FIv6xJwMO2RQqw6q1sEkIQccnPMEPoi';
    const url = 'https://dash.growsari.com/api/queries/407/refresh?p_id=3' ;

    const body = {
    }

    const headers = {
        headers : {
            'Authorization': `Key ` + API_TOKEN,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    try {
        var res = await axios.post(url, body, headers)
    } catch (err) {
        console.log('Error')
    }
    
    let response =  res.data.job.id;

    if (!response) {
        throw new Error('No response')
    }

    let _url = 'https://dash.growsari.com/api/jobs/' + response;

    res = await axios.get(_url, headers)

    try {
        response = res.data.job.query_result_id    
    } catch(err) {
        throw new Error('No response')
    }

    if (!response) {
        throw new Error('No response')
    }

    _url = 'https://dash.growsari.com/api/queries/407/results/' + response + '.json';
    res = await axios.get(_url, headers)
    console.log(res.data.query_result.data.rows)
    console.log(response)
    
}


accessRedash()
