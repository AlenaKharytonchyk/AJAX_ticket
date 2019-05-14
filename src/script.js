
function movieFunc() {
  var card = '<li class="card"><div class="media"><img src="{{poster_path}}" alt="{{title}}"><span class="vote">{{vote_average}}</span></div><div class="content"> <h1>{{title}}</h1> <ul> <li class="genres"><span>genres:</span>{{genres}}</li><li class="tagline"><span>tagline:</span>{{tagline}}</li><li class="release"><span>release date:</span>{{release_date}}</li><li class="runtime"><span>runtime:</span>{{runtime}}</li><li class="overview"><span>storyline:</span>{{overview}}</li><li class="budget"><span>budget:</span>{{budget}}</li></ul></div></li>';
  var movie = {
    init: function init(config) {
      this.url = 'http://react-cdp-api.herokuapp.com/movies';
      this.template = config.template;
      this.container = config.container;
      this.searchBy = 'title';
      this.initSearch();
      this.paginationRendering();
      this.fetch();
    },
    attachTemplate: function aT() {
      var self = this;
      var cards = [];
      cards = self.movieList.map(function m(movies) {
        var template = self.template;
        // var cardHtml = template;
        Object.keys(movies).forEach(function k(key) {
          var temp = new RegExp('{{' + key + '}}', 'g');
          template = template.replace(temp, movies[key]);
        });
        return template;
      });
      this.container.innerHTML = cards.join('');
    },
    fetch: function fetch() {
      var self = this;
      var url = self.url + '?searchBy=' + self.searchBy + '&search=' + (self.movieSearch || '') + '&offset=' + self.pagination.offset;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.onreadystatechange = function request() {
        if (xhr.readyState === 4) {
          self.movieList = xhr.response.data;
          self.pagination = {
            offset: xhr.response.offset,
            limit: xhr.response.limit,
            total: xhr.response.total
          };
          self.attachTemplate();
          self.updatePagination();
        }
        if (xhr.status !== 200) {
          alert(xhr.status + ': ' + xhr.statusText);
        }
      };
      xhr.send();
    },
    paginationRendering: function paginationRendering() {
      var pagination = '<div class="pagination"> <button class="left"><</button> <span class="page-left"></span> <span>of</span> <span class="page-right"></span> <button class="right">></button>';
      var paginationContainer = document.querySelector('.pagination-container');
      var self = this;
      paginationContainer.insertAdjacentHTML('beforeend', pagination);
      paginationContainer.addEventListener('click', function onClick(e) {
        var isStart = self.pagination.offset === 0;
        var isEnd = self.pagination.offset + self.pagination.limit >= self.pagination.total;
        if (e.target && e.target.matches('button.left') && !isStart) {
          self.pagination.offset -= self.pagination.limit;
          self.fetch();
        }
        if (e.target && e.target.matches('button.right') && !isEnd) {
          self.pagination.offset += self.pagination.limit;
          self.fetch();
        }
      });
      self.pagination = {
        offset: 0,
        limit: 0,
        total: 0
      };
    },
    updatePagination: function updatePagination() {
      var currentPage = (this.pagination.offset / this.pagination.limit) + 1;
      var allPages = Math.ceil(this.pagination.total / this.pagination.limit);
      document.querySelector('.page-left').innerHTML = currentPage;
      document.querySelector('.page-right').innerHTML = allPages;
    },
    initSearch: function initSearch() {
      var search = '<label for="movie-search"> Search the movie:</label> <span class="search-field"> <select id="search-by"> <option value="title">title</option> <option value="genres">genres</option> </select> <input type="search" id="movie-search" placeholder="Search..."> <button class="search-btn">Let\'s go!</button> </span>';
      var searchContainer = document.querySelector('.search');
      var self = this;
      searchContainer.insertAdjacentHTML('beforeend', search);
      searchContainer.addEventListener('change', function onChange(e) {
        if (e.target && e.target.matches('select#search-by')) {
          self.searchBy = e.target.value;
        } else if (e.target && e.target.matches('input#movie-search')) {
          self.movieSearch = e.target.value;
        }
        e.stopPropagation();
      });
      document.querySelector('.search-btn').addEventListener('click', function onClick() {
        return self.fetch();
      });
    }
  };
  movie.init({
    template: card,
    container: document.getElementsByClassName('movies')[0]
  });
}

document.onreadystatechange = function funcComplete() {
  if (document.readyState === 'complete') {
    movieFunc();
  }
};
