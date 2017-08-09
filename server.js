// statics
const PORT_NUMBER = 4000;

// import packaged dependencies
const expressGraphQL    = require('express-graphql')

// import local dependencies
const schema            = require('./schema')

// create application
const app = require('express')()



// bind middlewares
app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true,
}))

// start listening for server requests
app.listen(PORT_NUMBER, () => {
    console.log(`express.js server is listening on port ${PORT_NUMBER}...`)
})