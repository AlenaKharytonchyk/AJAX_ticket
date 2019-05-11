// fetch('http://react-cdp-api.herokuapp.com/movies/')
//   .then(response => response.json()
//     .then(data => {
//       let movieList = data.data;
//       console.log(movieList);
//     })
//     .catch(error => console.log(`Failed to convert response body to json: ${error}`)))
//   .catch(error => console.log(`Failed to get response: ${error}`));

fetch('http://react-cdp-api.herokuapp.com/movies/')
  .then(function resp(response) {
    return response.json()
      .then(function dataResp(data) {
        var movieList = data.data;
        console.log(movieList);
      })
      .catch(function errFunc(error) {
        return console.log('Failed to convert response body to json: '.concat(error));
      });
  })
  .catch(function errorFunc(error) {
    return console.log('Failed to get response: '.concat(error));
  });
