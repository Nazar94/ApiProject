const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/apiproject')

const app = express()

// Routes
const users = require('./routes/users')


//Middlewares

app.use(logger('dev'))
app.use(bodyParser.json())
//Routes
app.use('/users', users)

//test



//Catch 404 Errors and forward then to error handler

app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// Error handler function

app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    //Respond client
    res.status(status).json({
        error: {
            message: error.message
        }
    })

    //Respond to ourselves
    console.error(err)
})

// Start the server

const port = app.get('port') || 3000

app.listen(port, () => console.log('Server is listening on port 3000'))

