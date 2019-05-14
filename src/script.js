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
      // this.initSearch();
      // this.paginationRendering();
      this.fetch();
    },
    attachTemplate: function aT() {
      let self = this;
      let cards = [];
      cards = self.movieList.map(function m(movies) {
        let template = self.template;
        Object.keys(movies).forEach(function k(key) {
          let temp = new RegExp('{{' + key + '}}', 'g');
          template = template.replace(temp, movies[key]);
        });
        return template;
      });
      this.container.innerHTML = cards.join('');
    },
    fetch: function fnFetch() {
      let self = this;
      let url = 'http://react-cdp-api.herokuapp.com/movies';
      fetch(url)
        .then(response => response.json())
        .then(data => {
          self.movieList = data.data;
          self.pagination = {
            offset: data.offset,
            limit: data.limit,
            total: data.total
          };
          self.attachTemplate();
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
