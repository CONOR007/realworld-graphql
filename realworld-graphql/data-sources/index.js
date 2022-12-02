const dbModel = require('./dbModel')
const Users = require('./dbController/user')
const Articles = require('./dbController/article')

module.exports = () => {
  return {
    users: new Users(dbModel.User),
    articles: new Articles(dbModel.Article)
  }
}
