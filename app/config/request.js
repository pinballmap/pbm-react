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

export const putData = (uri, body) => {
    return fetch(global.api_url + uri, {
        method: 'put', 
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

export const getData = uri => {
    return fetch(global.api_url + uri)
        .then(response => {
            if(response.status === 200)
                return response.json()
    
            throw new Error('API response was not ok')
        })
        .catch(err => err)
}

export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => {
                if (error.message === 'Permission to access location not granted. User must now enable it manually in settings') { 
                    reject('Location services are not enabled')
                } else {
                    reject(error.message)
                }
            } 
        )
    })
}