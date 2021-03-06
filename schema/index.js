/*
##################################
 *  import dependency packages
##################################
*/
const graphql   = require('graphql')
const _         = require('lodash')
const axios     = require('axios')


const API_ROOT  = 'http://localhost:3000';

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
    GraphQLNonNull,
} = graphql;

/*
##################################
 #  define custom Types
##################################
*/

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id:     { type: GraphQLString },
        name:   { type: GraphQLString },
        city:   { type: GraphQLString },
        users:  { type: new GraphQLList(UserType),
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
        id:         { type: GraphQLString },
        firstName:  { type: GraphQLString },
        age:        { type: GraphQLInt },
        company:    { type: CompanyType,
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
                return axios.get(`${API_ROOT}/users/${args.id}`)
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
                return axios.get(`${API_ROOT}/companies/${args.id}`)
                    .then(response => response.data)
            }
        },
    },
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName:  { type: new GraphQLNonNull(GraphQLString) },
                age:        { type: new GraphQLNonNull(GraphQLInt) },
                companyId:  { type: GraphQLString }
            },
            resolve(parentValue, { firstName, age, companyId }) {
                return axios.post(`${API_ROOT}/users`, { firstName, age })
                    .then(response => response.data)
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue, { id }) {
                return axios.delete(`${API_ROOT}/users/${id}`)
                    .then(response => response.data)
            }
        },
        editUser: {
            type: UserType,
            args: {
                id:         { type: new GraphQLNonNull(GraphQLString) },
                firstName:  { type: GraphQLString },
                age:        { type: GraphQLInt },
                companyId:  { type: GraphQLString }
            },
            resolve(parentValue, args) {
                return axios.patch(`${API_ROOT}/users/${args.id}`, args)
                    .then(response => response.data)
            }
        },
    },
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})