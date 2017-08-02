/*
##################################
 *  import dependency packages
##################################
*/
const graphql   = require('graphql')
const _         = require('lodash')
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
 -  hardcode users
##################################
*/
const users = [
    { id: '01', firstName: 'Tomas', age: 22, },
    { id: '02', firstName: 'Caitlin', age: 38, },
    { id: '03', firstName: 'Maire', age: 43, },
]

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
            resolve: function(parentValue, args) {
                return _.find( users, { id: args.id } )
            },
        },
    },
})

module.exports = new GraphQLSchema({
    query: RootQuery
})