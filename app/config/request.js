import "../config/globals.js"
import { IFPA_API_KEY } from '../config/keys'
import * as Location from 'expo-location'

export const postData = (uri, body) => {
    return fetch(global.api_url + uri, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(async response => {
            try {
                const data = await response.json()

                if (data.errors) {
                    throw data.errors
                }

                if (data.error) {
                    throw data.error
                }

                if (response.ok)
                    return data

            }
            catch (e) {
                throw e
            }
        })
        .catch(err => {
            const errorText = typeof err === 'object' ? err.toString() : err
            return Promise.reject(errorText)
        })
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
        .then(async response => {
            try {
                const data = await response.json()

                if (data.errors) {
                    throw data.errors
                }

                if (data.error) {
                    throw data.error
                }

                if (response.ok)
                    return data

            }
            catch (e) {
                throw e
            }
        })
        .catch(err => {
            const errorText = typeof err === 'object' ? err.toString() : err
            return Promise.reject(errorText)
        })
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

export const getIfpaData = (address, radius) => {
    return fetch(`https://api.ifpapinball.com/v1/calendar/search?api_key=${IFPA_API_KEY}&address=${address}&m=${radius}`)
        .then(response => {
            if(response.status === 200)
                return response.json()

            throw new Error('IFPA API response was not ok')
        })
        .catch(err => err)
}

export const deleteData = (uri, body)  => {
    return fetch(global.api_url + uri, {
        method: 'delete',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(async response => {
            try {
                const data = await response.json()
                if (response.ok)
                    return data
            }
            catch (e) {
                throw 'Something went wrong.'
            }
        })
        .catch(err => Promise.reject(err))
}

export const getCurrentLocation = () => {
    Location.installWebGeolocationPolyfill()
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
