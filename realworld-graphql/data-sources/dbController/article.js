const { MongoDataSource } = require('apollo-datasource-mongodb')

class Articles extends MongoDataSource {
  createArticle (data) {
    const article = new this.model(data)
    // 返回article下的author（嵌套的数据结构） 让mongooes去查用户数据然后把它映射到article的author
    // article.populate('author').execPopulate()
    console.log('article',article)
    return article.save()
  }

  getArticles (offset,limit) {
    // 分页
    return this.model.find().skip(offset).limit(limit)
  }

  getCount () {
    return this.model.countDocuments()
  }
}

module.exports = Articles
