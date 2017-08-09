/*
##################################
 *  import dependency packages
##################################
*/
const graphql   = require('graphql')
const _         = require('lodash')
const axios     = require('axios')

/*
##################################
 *  initialize graphql
##################################
*/
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
} = graphql;

/*
##################################
 #  define custom Types
##################################
*/
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
    },
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios
                    .get(`http://localhost:3000/users/${args.id}`)
                    .then(response => {
                        console.log('got resource', response)
                        return response.data
                    })
            },
        },
    },
})

module.exports = new GraphQLSchema({
    query: RootQuery
})