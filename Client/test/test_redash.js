var axios =  require("axios");

const body = {

};

const API_TOKEN  = `KDhKkGtbMyC2oxz1PAjome5ojyYkw19fHEhwPFFN`

const headers = {
    headers : {
        'Authorization': `Key ${API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    } 
}

const url = `http://dash.growsari.com/api/queries/407/refresh?p_wh=6`

axios.post(url, body, headers)
    .then( (response) => {console.log(response)} )
    .catch( (err) => {console.log(err)} )