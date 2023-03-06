// const express = require('express')
// const app = express()

// app.listen(3000,()=>{
    //     console.log('Listening to port 3000')
    // })

    const { ApolloServer, gql } = require('apollo-server');
    const uuid = require('uuid/v4');
    
    const typeDefs = gql`
      type Quote {
        id: ID!
        phrase: String!
        quotee: String
      }
    
      type Query {
        quotes: [Quote]
      }

      type Mutation {
        addNewQuote(phrase: String!, quotee: String): Quote
        editQuote(id: ID!, phrase: String, quotee: String): Quote
        deleteQuote(id: ID!): DeleteResponse
        editAndGetResult(id:ID!,phrase: String):SelfMade
      }
    
      type DeleteResponse {
        ok: Boolean!
      }  

      type SelfMade{
        id:ID!
        phrase:String!
      } `;
    
    const quotes = {};
    const addQuote = quote => {
      const id = uuid();
      return quotes[id] = { ...quote, id };
    };
    
    addQuote({phrase:"Hi",quotee:"hii"});
    
    const resolvers = {
      Query: {
        quotes: () => Object.values(quotes),
      },

      Mutation: {
        addNewQuote: async (parent, quote) => {
        const saved = addQuote(quote);
        return saved;
        },
        editQuote: async (parent, { id, ...quote }) => {
          if (!quotes[id]) {
            throw new Error("Quote doesn't exist");
          }
    
          quotes[id] = {
            ...quotes[id],
            ...quote,
          };
    
          return quotes[id];
        },
        deleteQuote: async (parent, { id }) => {
          const ok = Boolean(quotes[id]);
          delete quotes[id];
    
          return { ok };
        },
        editAndGetResult:async(parent,{ id }) => {
            quotes[id] = {
                ...quotes[id],
                ...quote,
              };

        }
      },

    };
    
    const server = new ApolloServer({ typeDefs, resolvers });
    
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`); // eslint-disable-line no-console
    });