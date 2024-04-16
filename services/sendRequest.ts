
import axios from 'axios';

async function sendRequest(url, method = 'GET', token = '', body = []) {
  var  result
    const headers = {
        'Content-Type': 'application/json',
        "accept": "*/*",
        "Authorization": `Bearer ${token}`
    };
    if (method == "GET") {
        result = await  axios.get(url, { headers }) 
    } else {
        const postData = [body];

        result = await axios.post(url, postData, { headers }) 
    }
 
    return result.data
}

// async function sendRequest(url, method = 'GET', token = '', body = []) {
//     var headers = {
//         'Content-Type': 'application/json',
//         "accept": "*/*",
//         "Authorization": `Bearer ${token}`
//     }

//    var data ={
//         method: method,
//         headers: headers
//     }
//     if (method == "POST") {

//         data['body']=[JSON.stringify(body)]
//     }
  
//     const response = await fetch(url, data);

//     const result = await response.json();

//     return result
// }

export default sendRequest