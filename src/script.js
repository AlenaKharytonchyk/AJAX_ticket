(function movieFunc() {
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
      <li class="runtime><span>runtime:</span>{{runtime}}</li>
      <li class="overview"><span>storyline:</span>{{overview}}</li>
      <li class="budget"><span>budget:</span>$ {{budget}}</li>
    </ul>
  </div>      
    </li>`;
  const movie = {
    init: function init(config) {
      this.url = 'http://react-cdp-api.herokuapp.com/movies/';
      this.template = config.template;
      this.container = config.container;
      this.fetch();
    },
    attachTemplate: function aT() {
      const cards = [];
      console.log(this.movieList);
      $.map(this.movieList, (e) => {
        let cardHtml = this.template;
        Object.keys(e).forEach((key)=>{
          let temp = new RegExp('{{' + key + '}}', 'g');
          cardHtml = cardHtml.replace(temp, e[key]);
        });
        cards.push(cardHtml);
      });
      this.container.html(cards.join(''));
    },
    fetch: function fetch() {
      const self = this;
      $.getJSON(this.url, function (data) {
        self.movieList = data.data;
        console.log(data);

        self.attachTemplate();
      });
    }

  };
  movie.init({
    template: card,
    container: $('ul.movies')
  });
}());
