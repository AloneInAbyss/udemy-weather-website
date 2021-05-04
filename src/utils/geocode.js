const request = require('request')

function geocode(query, callback, language='en') {
  let accessKey = 'access_token=pk.eyJ1IjoiYWxvbmVpbmFieXNzIiwiYSI6ImNrbmFwOG94bTFrMTIyeHFwbmNraGI3aHMifQ.HQ0gyO1T-SdP9M-1aD0VpA'
  query = encodeURIComponent(query) + '.json'
  language = encodeURIComponent(language)
  let options = `language=${language}`
  let url = `http://api.mapbox.com/geocoding/v5/mapbox.places/${query}?${accessKey}&${options}`
  
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to map service!', undefined)
    } else if (body.message) {
      callback('A problem has occured', undefined)
    } else if (body.features.length === 0) {
      callback('Unable to find location', undefined)
    } else {
      const search = body.features[0].place_name
      const latitude = body.features[0].center[1]
      const longitude = body.features[0].center[0]

      callback(undefined, {
        latitude,
        longitude,
        search
      })
    }
  })
}

module.exports = geocode