
(function movieFunc() {
  var card = '<li class="card"><div class="media"><img src="{{poster_path}}" alt="{{title}}"><span class="vote">{{vote_average}}</span></div><div class="content"> <h1>{{title}}</h1> <ul> <li class="genres"><span>genres:</span>{{genres}}</li><li class="tagline"><span>tagline:</span>{{tagline}}</li><li class="release"><span>release date:</span>{{release_date}}</li><li class="runtime"><span>runtime:</span>{{runtime}}</li><li class="overview"><span>storyline:</span>{{overview}}</li><li class="budget"><span>budget:</span>{{budget}}</li></ul></div></li>';
  var movie = {
    init: function init(config) {
      this.url = 'http://react-cdp-api.herokuapp.com/movies';
      this.template = config.template;
      this.container = config.container;
      this.searchBy = 'title';
      this.fetch();
    },
    attachTemplate: function a(e) {
      var self = this;
      // Changing Jquery map to array map
      var cards = this.movieList.map(function m(movies) {
        var template = self.template;
        let cardHtml = template;
        Object.keys(movies).forEach(function k(key) {
          var temp = new RegExp('{{' + key + '}}', 'g');
          template = cardHtml.replace(temp, e[key]);
        });
        return template;
      });
      this.container.innerHTML = cards.join('');
    },
    fetch: function f() {
      var self = this;
      var url = 'http://react-cdp-api.herokuapp.com/movies/';
      fetch(url)
        .then(function r(response) {
          response.json()
            .then(function d(data) {
              self.movieList = data.data;
              self.pagination = {
                offset: data.offset,
                limit: data.limit,
                total: data.total
              };
              self.attachTemplate();
              self.updatePagination();
            });
        });
    }
  };
  movie.init({
    template: card,
    container: document.getElementsByClassName('movies')[0] // $('ul.movies')
  });
}());
