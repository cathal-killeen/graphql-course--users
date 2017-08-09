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
} = graphql;

/*
##################################
 #  define custom Types
##################################
*/

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        city: { type: GraphQLString },
    }
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
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
        }
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
                    .get(`${API_ROOT}/users/${args.id}`)
                    .then(response => {
                        //console.log('got resource', response)
                        return response.data
                    })
            },
        },
    },
})

module.exports = new GraphQLSchema({
    query: RootQuery
})