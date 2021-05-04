const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Clima',
        name: 'Thiago Assi'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Sobre Mim',
        name: 'Thiago Assi'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Texto de ajuda.',
        title: 'Ajuda',
        name: 'Thiago Assi'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Você deve digitar um endereço!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, search: location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, { weatherDesc, temp, apparentTemp } = {}) => {
            if (error) {
                return res.send({ error })
            }
            let forecastData = `Atualmente com ${temp}°C, e sensação de ${apparentTemp}°C.`
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'Você deve indicar um termo para pesquisar'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Erro 404',
        name: 'Thiago Assi',
        errorMessage: 'Artigo de ajuda não encontrado.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Erro 404',
        name: 'Thiago Assi',
        errorMessage: 'Página não encontrada.'
    })
})

app.listen(port, () => {
    console.log(`Servidor na porta ${port}.`)
})