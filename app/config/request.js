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
    .then(response => {
      if (response.status === 200)
        return response.json()
      
      throw new Error('API response was not ok.')
    })
    .catch(err => err)
}