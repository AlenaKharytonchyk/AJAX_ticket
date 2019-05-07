(function movieFunc() {
  const movie = {
    init: function init() {
      this.url = 'http://react-cdp-api.herokuapp.com/movies/';
      this.fetch();
    },
    fetch: function fetch() {
      const self = this;
      self.movieList = $.getJSON(this.url, function (data) {
        console.log(data);
      });
    }
  };
  movie.init();
}());
