'use strict';
var app = app || {};

(function (module) {

  function Article(rawDataObj) {
    console.log('article constructor');
    // REVIEW: In Lab 8, we explored a lot of new functionality going on here. Let's re-examine the concept of context. Normally, "this" inside of a constructor function refers to the newly instantiated object. However, in the function we're passing to forEach, "this" would normally refer to "undefined" in strict mode. As a result, we had to pass a second argument to forEach to make sure our "this" was still referring to our instantiated object. One of the primary purposes of lexical arrow functions, besides cleaning up syntax to use fewer lines of code, is to also preserve context. That means that when you declare a function using lexical arrows, "this" inside the function will still be the same "this" as it was outside the function. As a result, we no longer have to pass in the optional "this" argument to forEach!
    Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
  }

  Article.all = [];

  Article.prototype.toHtml = function () {
    console.log('article.tohtml');
    var template = Handlebars.compile($('#article-template').text());

    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn)) / 60 / 60 / 24 / 1000);
    this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
    this.body = marked(this.body);

    return template(this);
  };

  Article.loadAll = rawData => {
    console.log('article.loadall');
    rawData.sort((a, b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)));
    Article.all = rawData.map(articleObject => new Article(articleObject));
    // OLD forEach():
    // rawData.forEach(articleObject => Article.all.push(new Article(articleObject)));
  };

  Article.fetchAll = callback => {
    console.log('article.fetchall');
    $.get('/articles')
      .then(results => {
        Article.loadAll(results);
        callback();
      })
  };

  Article.numWordsAll = () => {
    console.log('article.numwordsall');
    return Article.all.map(idx =>{
      idx.body.split(' ');
      console.log(idx.body.length);
      return idx.body.length;
    }).reduce((acc, cur) => {
      return cur+= acc;
    });
  };

  Article.allAuthors = () => {
    console.log('article.allauthors');
    return Article.all.map().reduce();
  };

  Article.numWordsByAuthor = () => {
    console.log('article.numwordsbyauthor');
    // return {
    //   author: `${author}`,
    //   wordCount: Article.allAuthors().map(author => { }),
    // } //
  };
  // let newArr = people.reduce((acc, curr) => {
  //   if (curr.id > 10) {
  //     acc.push({
  //       id: curr.id,
  //       name: curr.name.split(' '),
  //       diffBornAndGrad: curr.graduated - curr.born
  //     })
  //   }
  //   return acc
  // }, [])

  Article.truncateTable = callback => {
    console.log('article.truncatetable');
    $.ajax({
      url: '/articles',
      method: 'DELETE',
    })
      .then(console.log)
      // REVIEW: Check out this clean syntax for just passing 'assumed' data into a named function! The reason we can do this has to do with the way Promise.prototype.then() works. It's a little outside the scope of 301 material, but feel free to research!
      .then(callback);
  };

  Article.prototype.insertRecord = function (callback) {
    console.log('article.prototype.insertrecord');
    // REVIEW: Why can't we use an arrow function here for .insertRecord()?
    $.post('/articles', { author: this.author, authorUrl: this.authorUrl, body: this.body, category: this.category, publishedOn: this.publishedOn, title: this.title })
      .then(console.log)
      .then(callback);
  };

  Article.prototype.deleteRecord = function (callback) {
    console.log('article.prototype.deleterecord');
    $.ajax({
      url: `/articles/${this.article_id}`,
      method: 'DELETE'
    })
      .then(console.log)
      .then(callback);
  };

  Article.prototype.updateRecord = function (callback) {
    console.log('article.prototype.updaterecord');
    $.ajax({
      url: `/articles/${this.article_id}`,
      method: 'PUT',
      data: {
        author: this.author,
        authorUrl: this.authorUrl,
        body: this.body,
        category: this.category,
        publishedOn: this.publishedOn,
        title: this.title,
        author_id: this.author_id
      }
    })
      .then(console.log)
      .then(callback);
  };

  module.Article = Article;
})(app);