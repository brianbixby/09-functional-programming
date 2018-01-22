'use strict';
var app = app || {};

(function (module) {

  var articleView = {};

  articleView.populateFilters = () => {
    console.log('articleview.populatefilters');
    $('article').each(function () {
      if (!$(this).hasClass('template')) {
        var val = $(this).find('address a').text();
        var optionTag = `<option value="${val}">${val}</option>`;
        if ($(`#author-filter option[value="${val}"]`).length === 0) {
          $('#author-filter').append(optionTag);
        }

        val = $(this).attr('data-category');
        optionTag = `<option value="${val}">${val}</option>`;
        if ($(`#category-filter option[value="${val}"]`).length === 0) {
          $('#category-filter').append(optionTag);
        }
      }
    });
  };

  articleView.handleAuthorFilter = () => {
    console.log('articleview.handleauthorfilters');
    $('#author-filter').on('change', function () {
      if ($(this).val()) {
        $('article').hide();
        $(`article[data-author="${$(this).val()}"]`).fadeIn();
      } else {
        $('article').fadeIn();
        $('article.template').hide();
      }
      $('#category-filter').val('');
    });
  };

  articleView.handleCategoryFilter = () => {
    console.log('articleview.handlecategoryfilter');
    $('#category-filter').on('change', function () {
      if ($(this).val()) {
        $('article').hide();
        $(`article[data-category="${$(this).val()}"]`).fadeIn();
      } else {
        $('article').fadeIn();
        $('article.template').hide();
      }
      $('#author-filter').val('');
    });
  };

  articleView.handleMainNav = () => {
    console.log('articleview.handlemainnav');
    $('.main-nav').on('click', '.tab', function () {
      $('.tab-content').hide();
      $(`#${$(this).data('content')}`).fadeIn();
    });

    $('.main-nav .tab:first').click();
  };

  articleView.setTeasers = () => {
    console.log('articleview.setteasers');
    $('.article-body *:nth-of-type(n+2)').hide();
    $('article').on('click', 'a.read-on', function (e) {
      e.preventDefault();
      if ($(this).text() === 'Read on →') {
        $(this).parent().find('*').fadeIn();
        $(this).html('Show Less &larr;');
      } else {
        $('body').animate({
          scrollTop: ($(this).parent().offset().top)
        }, 200);
        $(this).html('Read on &rarr;');
        $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
      }
    });
  };

  articleView.initNewArticlePage = () => {
    console.log('articleview.initarticlepage');
    $('.tab-content').show();
    $('#export-field').hide();
    $('#article-json').on('focus', function () {
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', articleView.create);
    $('#new-form').on('submit', articleView.submit);
  };

  articleView.create = () => {
    console.log('articleview.create');
    var article;
    $('#articles').empty();

    article = new app.Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      authorUrl: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      publishedOn: new Date().toISOString()
    });

    $('#articles').append(article.toHtml());
    $('pre code').each((i, block) => hljs.highlightBlock(block));
  };

  articleView.submit = event => {
    console.log('articleview.submit');
    event.preventDefault();
    let article = new app.Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      authorUrl: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      publishedOn: new Date().toISOString()
    });

    article.insertRecord();

    // REVIEW: The following line of code redirects the user back to the home page after submitting the form.
    window.location = '../';
  }

  articleView.initIndexPage = () => {
    console.log('articleview.initindexpage');
    app.Article.all.forEach(a => $('#articles').append(a.toHtml()));

    articleView.populateFilters();
    articleView.handleCategoryFilter();
    articleView.handleAuthorFilter();
    articleView.handleMainNav();
    articleView.setTeasers();
    $('pre code').each((i, block) => hljs.highlightBlock(block));
  };


  articleView.initAdminPage = () => {
    console.log('articleview.initadminpage');
    // REVIEW: We use .forEach() here because we are relying on the side-effects of the callback function: appending to the DOM. The callback is not required to return anything.
    let template = Handlebars.compile($('#author-stats-template').html());
    // app.Article.numWordsByAuthor().forEach(stat => $('.author-stats').append(template(stat)));

    // REVIEW: Simply write the correct values to the page:
    $('#blog-stats .articles').text(app.Article.all.length);
    $('#blog-stats .words').text(app.Article.numWordsAll());
    return template(this);

  };

  module.articleView = articleView;
})(app);