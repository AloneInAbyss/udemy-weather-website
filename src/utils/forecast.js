const request = require('request')

function forecast (lat, lon, callback) {
  let accessKey = 'access_key=619691dabba549cdd79824ef2722206b'
  let query = `query=${lat},${lon}`
  let url = `http://api.weatherstack.com/current?${accessKey}&${query}`
  
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service!', undefined)
    } else if (body.error) {
      callback('Unable to find location', undefined)
    } else {
      // const temp = response.body.current.temperature
      // const apparentTemp = response.body.current.feelslike
      // const weatherDesc = response.body.current.weather_descriptions[0]
      let { temperature:temp, feelslike:apparentTemp, weather_descriptions:weatherDesc } = body.current
      weatherDesc = weatherDesc[0]
      
      callback(undefined, {
        weatherDesc,
        temp,
        apparentTemp
      })
    }
  })
}

module.exports = forecast