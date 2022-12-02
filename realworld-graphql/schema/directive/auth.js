const { SchemaDirectiveVisitor,AuthenticationError } = require('apollo-server-express')
const { defaultFieldResolver } = require('graphql');
const jwt = require('../../util/jwt');
const { jwtSecret } = require('../../config/config.default');

class AuthCaseDirective extends SchemaDirectiveVisitor {
    // 覆盖默认的api功能
    visitFieldDefinition(field) {
        // 把字段本身的resolve备份一下
        const { resolve = defaultFieldResolver } = field;
        // 重写resolve
        field.resolve = async function (parent, args, context, info) {
            if(!context.token){
                throw new AuthenticationError('未授权') 
            }
            let tokenInfo
            try {
                tokenInfo =  await jwt.verify(context.token, jwtSecret)
            } catch (error) {
                throw new AuthenticationError('身份认证失败')
            }
            const user = await context.dataSources.users.findById(tokenInfo.userId)
            context.user = user
            const result = await resolve(parent, args, context, info)
            return result
        };
    }
}
module.exports = AuthCaseDirective