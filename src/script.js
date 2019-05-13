function movieFunc() {
  const card = `<li class="card">
  <div class="media">     
    <img src="{{poster_path}}" alt="{{title}}">
    <span class="vote">{{vote_average}}</span> 

  </div>
  <div class="content">
    <h1>{{title}}</h1>
    <ul>
      <li class="genres"><span>genres:</span>{{genres}}</li>
      <li class="tagline"><span>tagline:</span>{{tagline}}</li>
      <li class="release"><span>release date:</span>{{release_date}}</li>
      <li class="runtime"><span>runtime:</span>{{runtime}}</li>
      <li class="overview"><span>storyline:</span>{{overview}}</li>
      <li class="budget"><span>budget:</span>$ {{budget}}</li>
    </ul>
  </div>      
    </li>`;
  const movie = {
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
      const cards = [];
      $.map(this.movieList, (e) => {
        let cardHtml = this.template;
        Object.keys(e).forEach((key) => {
          let temp = new RegExp('{{' + key + '}}', 'g');
          cardHtml = cardHtml.replace(temp, e[key]);
        });
        cards.push(cardHtml);
      });
      this.container.html(cards.join(''));
    },
    fetch: function fetch() {
      const self = this;
      function updateCards(data) {
        self.movieList = data.data;
        self.pagination = {
          offset: data.offset,
          limit: data.limit,
          total: data.total
        };
        self.attachTemplate();
        self.updatePagination();
      }
      function onError(jqXHR) {
        if (jqXHR.status && jqXHR.status !== 200) {
          alert(jqXHR.responseText);
        } else {
          alert('Something went wrong');
        }
      }
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: `${this.url}?searchBy=${this.searchBy}&search=${this.movieSearch || ''}&offset=${this.pagination.offset}`,
        data: '',
        success: updateCards,
        error: onError
      });
    },
    paginationRendering: function paginationRendering() {
      const pagination = `<div class="pagination">
      <button class="left"><</button>
      <span class="page-left">0</span>
      <span>of</span>
      <span class="page-right">0</span>
      <button class="right">></button>`;
      $('.pagination-container').append(pagination);
      let self = this;
      $('.pagination-container').on('click', function onClick(event) {
        const isStart = self.pagination.offset === 0;
        const isEnd = self.pagination.offset + self.pagination.limit >= self.pagination.total;
        if ($(event.target).hasClass('left') && !isStart) {
          self.pagination.offset -= self.pagination.limit;
          self.fetch();
        }
        if ($(event.target).hasClass('right') && !isEnd) {
          self.pagination.offset += self.pagination.limit;
          self.fetch();
        }
      });
      this.pagination = {
        offset: 0,
        limit: 0,
        total: 0
      };
    },
    updatePagination: function updatePagination() {
      const currentPage = (this.pagination.offset / this.pagination.limit) + 1;
      const allPages = Math.ceil(this.pagination.total / this.pagination.limit);

      $('.page-left').text(currentPage);
      $('.page-right').text(allPages);
    },
    initSearch: function initSearch() {
      const search = `<label for='movie-search'>
        Search the movie:</label>
        <span class="search-field">
        <select id="search-by">
          <option value="title">title</option>
          <option value="genres">genres</option>
        </select>
        <input type='search' id='movie-search' placeholder="Search...">
        <button class="search-btn">Let's go!</button>
        </span>`;
      $('.search').append(search);
      let self = this;
      $('.search').on('change', function onChange(event) {
        if (event.target.id === 'search-by') {
          self.searchBy = event.target.value;
        } else if (event.target.id === 'movie-search') {
          self.movieSearch = event.target.value;
        }
        event.stopPropagation();
      });
      $('.search-btn').click(() => {
        this.fetch();
      });
    }
  };
  movie.init({
    template: card,
    container: $('ul.movies')
  });
}

document.onreadystatechange = function funcComplete() {
  if (document.readyState === 'complete') {
    movieFunc();
  }
};
