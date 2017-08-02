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
app.listen(4000, () => {
    console.log('express.js server is listening...')
})