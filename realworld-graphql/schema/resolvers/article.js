const { UserInputError } = require('apollo-server-express')
const Jwt = require("jsonwebtoken")
const { jwtSecret } = require("../../config/config.default")
const md5 = require('../../util/md5')
// 2. 定义 resolver
const resolvers = {
    Query: {
        foo(parent, args, context, info) {
            return 'Hello'
        },
        async articles(parent, { offset, limit }, { dataSources }, info) {
            // const [articles, articlesCount] = await Promise.all([
            //     dataSources.articles.getArticles(offset,limit),
            //     dataSources.articles.getCount()
            // ])
            // console.log(articles)
            // return {
            //     articles,
            //     articlesCount
            // }

            // 这里使用了resolver链提高查询性能，因为有可能只查articles，或是只查articlesCount
            return {

            }
        },
    },
    Mutation: {
        // 创建文章
        async createArticle(parent, { article }, { dataSources, user }) {
            article.author = user._id
            console.log("article", article)
            const ret = await dataSources.articles.createArticle(article)
            console.log("ret", ret)
            return {
                article: ret.toObject()
            }
        },
        // 更新文章
        async updateArticle(parent, { article }, { dataSources, user }) {
            article.author = user._id
            const ret = await dataSources.articles.createArticle(article)
            return {
                article: ret.toObject()
            }
        }
    },
    // 返回article下的author（嵌套的数据结构）
    Article: {
        async author(parent, args, { dataSources }) {
            const user = await dataSources.users.findById(parent.author)
            return user
        }
    },
    // ArticlesPayload是schema定义的返回类型。可以作resolver链
    ArticlesPayload: {
        async articles(parent, { offset, limit }, { dataSources }) {
            console.log(111)
            const articles = await dataSources.articles.getArticles(offset, limit)
            return articles
        },
        async articlesCount(parent, args, { dataSources }) {
            console.log(222)
            const articlesCount = await dataSources.articles.getCount()
            return articlesCount
        }
    }
}

module.exports = resolvers