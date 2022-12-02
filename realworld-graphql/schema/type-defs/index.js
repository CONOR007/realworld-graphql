const { gql } = require('apollo-server-express')

// 1. 定义 schema
const typeDefs = gql`
  # 自定义指令 @upper 如果是字符串全部转大写
  directive @upper on FIELD_DEFINITION
  # 自定义指令 @auth 提供身份认证功能
  directive @auth on FIELD_DEFINITION
  type Query {
    #foo:String @upper
    foo:String @auth
    currentUser:User @auth
    articles(offset:Int = 0,limit:Int = 2):ArticlesPayload
  }
  type ArticlesPayload {
    articles: [Article!]
    articlesCount: Int!
  }
  input LoginInput {
    email: String!
    password: String!
  }
  type User {
    email: String!
    #username: String! @deprecated(reason: "请使用 newUsername")
    #newUsername:String
    username:String!
    bio: String
    image: String
    token: String
    following: Boolean
  }
  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }
  type UserPayload {
    user: User
  }
  input UpdateUserInput {
    email: String
    username:String
    bio: String
    image: String
    password: Boolean!
  }
  input CreateArticleInput {
    title:String
    description:String
    body:String
    tagList:[String]
  }
  type Article {
    _id: String!
    title: String!
    description: String!
    body: String!
    tagList: [String!]
    createdAt: String!
    updatedAt: String!
    favorited: Boolean
    favoritesCount: Int
    author: User
  }
  type ArticlePayload {
    article:Article
  }
  type Mutation {
    # User
    login(user: LoginInput): UserPayload
    createUser(user: CreateUserInput): UserPayload
    updateUser(user: UpdateUserInput): UserPayload @auth
    # Article
    createArticle(article: CreateArticleInput): ArticlePayload @auth
    updateArticle(article: CreateArticleInput): ArticlePayload @auth
  }
`

module.exports = typeDefs