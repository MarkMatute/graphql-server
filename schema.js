const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/customers/${args.id}`)
                .then((response) => {
                  return response.data;
                })
                .catch((err) => {
                  console.log(err);
                  return [];
                });
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/customers`)
                .then((response) => {
                  return response.data;
                });
      }
    }
  } 
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        email: { 
          type: new GraphQLNonNull(GraphQLString)
        },
        age: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(parentValue, args) {
        return axios.post('http://localhost:3000/customers', {
          name: args.name,
          email: args.email,
          age: args.age
        }).then((response) => {
          return response.data;
        });
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parentValue, args) {
        return axios.delete('http://localhost:3000/customers/' + args.id)
                .then((response) => {
                  return response.data;
                });
      }
    },
    updateCustomer: {
      type: CustomerType,
      args:{
        id: {
          type: GraphQLNonNull(GraphQLString)
        },
        name: {
          type: GraphQLString
        },
        email: {
          type: GraphQLString
        },
        age: {
          type: GraphQLInt
        }
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/customers/${args.id}`, {
          name: args.name,
          email: args.email,
          age: args.age
        })
        .then((result) => {
          return result.data;
        });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
