/*
##################################
 *  import dependency packages
##################################
*/
const graphql   = require('graphql')
const _         = require('lodash')
const axios     = require('axios')


const API_ROOT = 'http://localhost:3000';

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
    GraphQLList,
} = graphql;

/*
##################################
 #  define custom Types
##################################
*/

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        city: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`${API_ROOT}/companies/${parentValue.id}/users`)
                    .then(response => response.data)
            }
        },
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                console.log(parentValue, args);
                return axios.get(`${API_ROOT}/companies/${parentValue.companyId}`)
                    .then(response => response.data)
            }
        },
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios
                    .get(`${API_ROOT}/users/${args.id}`)
                    .then(response => {
                        //console.log('got resource', response)
                        return response.data
                    })
            },
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios
                    .get(`${API_ROOT}/companies/${args.id}`)
                    .then(response => response.data)
            },
        },
    },
})

module.exports = new GraphQLSchema({
    query: RootQuery
})