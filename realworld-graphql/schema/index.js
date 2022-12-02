const typeDefs = require('./type-defs')
const article = require('./resolvers/article')
const user = require('./resolvers/user')
const upper = require('./directive/upper')
const auth = require('./directive/auth')
const { makeExecutableSchema } = require('apollo-server-express')

// 3. 合并
module.exports = makeExecutableSchema({
    typeDefs,
    resolvers: [article, user],
    // 自定义指令实现
    schemaDirectives: {
        upper,
        auth
    }
})