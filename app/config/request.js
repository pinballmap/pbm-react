import "../config/globals.js" 

export const postData = (uri, body) => {
    return fetch(global.api_url + uri, {
      method: 'post', 
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(response => response.json())
}