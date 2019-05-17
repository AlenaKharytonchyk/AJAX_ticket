const card = `<li class="card" id="{{id}}">
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
      <li class="overview"><span>storyline:</span>{{overview}}<a id="open-button" data-modal="{{id}}" href="{{url}}">=></a></li>
      <li class="budget"><span>budget:</span>$ {{budget}}</li>
    </ul>
  </div>     

    </li>`;
const modalWindow = `
<div class="modal-guts">

<button class="class-button" id="close-button">Закрыть</button>
  <li class="card" id="{{id}}">
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
  </li>
</div>  
<div class="modal-overlay" id="modal-overlay"></div>
`;
class Movie {
  constructor(config) {
    this.baseUrl = 'http://react-cdp-api.herokuapp.com/movies';
    this.template = config.template;
    this.container = config.container;
    this.searchBy = 'title';
    this.pagination = {
      offset: 0,
      limit: 0,
      total: 0
    };
  }

  get url() {
    return `${this.baseUrl}?searchBy=${this.searchBy}&search=${this.movieSearch || ''}&offset=${this.pagination.offset}&id=${this.id}`;
  }

  render() {
    this.initSearch();
    this.paginationRendering();
    this.fetch();
    this.attachmodalWindow();
  }

  attachTemplate() {
    let cards = [];
    cards = this.movieList.map((movies) => {
      let template = this.template;
      Object.keys(movies).forEach((key) => {
        let temp = new RegExp('{{' + key + '}}', 'g');
        template = template.replace(temp, movies[key]);
      });
      return template;
    });
    this.container.innerHTML = cards.join('');
    this.mediaQuery();
  }

  fetch(resetPagination) {
    if (resetPagination) {
      this.pagination = {
        offset: 0,
        limit: 0,
        total: 0
      };
    }
    fetch(this.url)
      .then(response => response.json())
      .then(data => {
        this.movieList = data.data;
        this.pagination = {
          offset: data.offset,
          limit: data.limit,
          total: data.total
        };
        this.attachTemplate();
        this.updatePagination();
      })
      .catch(error => { console.warn(error); });
  }

  paginationRendering() {
    const pagination = `<div class="pagination">
      <button class="left"><</button>
      <span class="page-left">0</span>
      <span>of</span>
      <span class="page-right">0</span>
      <button class="right">></button>`;
    const paginationContainer = document.querySelector('.pagination-container');
    paginationContainer.insertAdjacentHTML('beforeend', pagination);
    paginationContainer.addEventListener('click', (e) => {
      const { offset, limit, total } = this.pagination;
      const isStart = offset === 0;
      const isEnd = offset + limit >= total;
      if (e.target && e.target.matches('button.left') && !isStart) {
        this.pagination.offset -= limit;
        this.fetch();
      }
      if (e.target && e.target.matches('button.right') && !isEnd) {
        this.pagination.offset += limit;
        this.fetch();
      }
    });
  }

  updatePagination() {
    const { offset, limit, total } = this.pagination;
    const currentPage = (offset / limit) + 1;
    const allPages = Math.ceil(total / limit);
    document.querySelector('.page-left').innerHTML = currentPage;
    document.querySelector('.page-right').innerHTML = allPages;
  }

  initSearch() {
    const search = `<form><label for='movie-search'>
      Search the movie:</label>
      <span class="search-field">
      <select id="search-by">
        <option value="title">title</option>
        <option value="genres">genres</option>
      </select>
      <input type='search' id='movie-search' placeholder="Search...">
      <button type="submit" class="search-btn">Let's go!</button>
      </span></form>`;
    const searchContainer = document.querySelector('.search');
    searchContainer.insertAdjacentHTML('beforeend', search);
    searchContainer.addEventListener('change', (e) => {
      if (e.target && e.target.matches('select#search-by')) {
        this.searchBy = e.target.value;
      } else if (e.target && e.target.matches('input#movie-search')) {
        this.movieSearch = e.target.value;
      }
      e.stopPropagation();
    });
    document.querySelector('.search-btn').addEventListener('click', (e) => {
      e.preventDefault();
      return this.fetch(true);
    });
  }

  mediaQuery() {
    document.querySelectorAll('.card').forEach(elem => {
      elem.addEventListener('click', (e)=>{
        console.log(e.target, elem.id);
        let film = this.movieList.find(movieInfo => movieInfo.id === +elem.id);
        console.log(film);
      });
    });
  }

  attachmodalWindow() {
    const modal = document.querySelector('#modal');


    const modalOverlay = document.querySelector('#modal-overlay');


    const closeButton = document.querySelector('#close-button');


    const openButton = document.querySelector('#open-button');

    closeButton.addEventListner('click', function () {
      modal.classList.toggle('closed');
      modalOverlay.classList.toggle('closed');
    });

    openButton.addEventListner('click', function () {
      modal.classList.toggle('closed');
      modalOverlay.classList.toggle('closed');
    });
  }
}

const config = {
  template: card,
  container: document.getElementsByClassName('movies')[0]
};
const movieApp = new Movie(config);

document.onreadystatechange = function funcComplete() {
  if (document.readyState === 'complete') {
    movieApp.render();
  }
};
