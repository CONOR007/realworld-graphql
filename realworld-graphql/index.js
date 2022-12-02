const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const dataSources = require('./data-sources')
const schema = require('./schema')

const app = express()

const server = new ApolloServer({
  schema,
  dataSources,
  // 所有的GraphQL 查询都会经过这里
  context({ req }) {
    return {
      token:req.headers.authorization
    }
  }
})

// 将 Apollo-server 和 express 集合到一起
server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
