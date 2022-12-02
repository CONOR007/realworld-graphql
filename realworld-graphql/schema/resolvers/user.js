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
        currentUser(parent, args, context, info) {
            console.log(context.user)
            return context.user
        }
    },
    Mutation: {
        // 创建用户
        async createUser(parent, args, { dataSources }) {
            const { username, email, password } = args.user
            // 判断用户是否存在
            const name = await dataSources.users.findByUsername(username)
            if (name) {
                // UserInputError处理用户信息输入错误
                throw new UserInputError('用户名已存在')
            }
            // 判断邮箱是否存在
            const emai = await dataSources.users.findByEmail(email)
            if (emai) {
                throw new UserInputError('邮箱已存在')
            }
            // 保存用户
            const data = await dataSources.users.saveUser(args.user)
            console.log(data)
            // 生成token发送给客户端,它由用户名，秘钥和过期时间组成
            // 生成的token由三部分组成，用点号分割 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Mzg5NmY0ZTFjYmUwZTRlZTBlOTU1NmIiLCJpYXQiOjE2Njk5NTEzMTAsImV4cCI6MTY3MDAzNzcxMH0.VzvlKQyM-p6DID8INjDNTM4vuzUBBjP7mhQMzwnifX8
            // 对第一部分和第二部分进行解码后，都是一个 Json 串。是对第一部分加第二部分内容的一个签名。
            // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  =>第一部分表示签名算法,base64解码之后是这个=>{"alg":"HS256","typ":"JWT"}
            // eyJ1c2VySWQiOiI2Mzg5NmY0ZTFjYmUwZTRlZTBlOTU1NmIiLCJpYXQiOjE2Njk5NTEzMTAsImV4cCI6MTY3MDAzNzcxMH0.=>第二部分表示用户名或用户ID还有过期时间之内的，base64解码之后=>{"userId":"63896f4e1cbe0e4ee0e9556b","iat":1669951310,"exp":1670037710}
            // VzvlKQyM-p6DID8INjDNTM4vuzUBBjP7mhQMzwnifX8 => 第三行还是签名，只不过不能被base64解码
            const token = Jwt.sign({
                userId: data._id
            }, jwtSecret, {
                expiresIn: 60 * 60 * 24
            })
            return {
                user: {
                    ...data.toObject(),
                    token
                }
            }
        },
        // 用户登录
        async login(parent, args, { dataSources }) {
            const { email, password } = args.user
            // 判断用户是否存在
            const data = await dataSources.users.findByEmail(email)
            if (data && md5(password) === data.password) {
                const token = Jwt.sign({
                    userId: data._id
                }, jwtSecret, {
                    expiresIn: 60 * 60 * 24
                })
                return {
                    user: {
                        ...data.toObject(),
                        token
                    }
                }
            } else {
                throw new UserInputError('邮箱或密码错误')
            }
        },
        // 更新用户
        async updateUser(parent, { user: userInput }, { dataSources, user }) {
            if (userInput.password) {
                userInput.password = md5(userInput.password)
            }
            const ret = await dataSources.users.updateUser(user._id, userInput)
            return {
                user: ret.toObject()
            }
        }
    }
}

module.exports = resolvers