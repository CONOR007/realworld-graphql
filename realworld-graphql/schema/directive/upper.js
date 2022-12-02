const { makeExecutableSchema, SchemaDirectiveVisitor } = require('apollo-server-express')
const { defaultFieldResolver } = require('graphql');

class UpperCaseDirective extends SchemaDirectiveVisitor {
    // 覆盖默认的api功能
    visitFieldDefinition(field) {
        // 把字段本身的resolve备份一下
        const { resolve = defaultFieldResolver } = field;
        // 重写resolve
        field.resolve = async function (parent, args, context, info) {
            const result = await resolve(parent, args, context, info);
            if (typeof result === 'string') {
                return result.toUpperCase();
            }
            return result;
        };
    }
}
module.exports = UpperCaseDirective