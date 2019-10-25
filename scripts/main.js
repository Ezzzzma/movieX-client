const addMovieModel = document.getElementById("add-movie-model");
async function getMoviesFromAPI() {
  // Fetch sends a GET request by defaultm first parameter is the url
  const response = await fetch("https://lit-waters-49720.herokuapp.com/movies");
  //When response is received, we only get the response body with .json() method
  const movies = await response.json();
  //Looping over each movie object
  movies.forEach(movie => {
    //We create an html template for each movie
    let markup = ` <div class="card bg-dark p-2">
      <img src= ${movie.movieUrl} class="card-img-top" alt="...">
      <div class="card-body bg-dark">
        <h4 class="card-title px-2 py-1 text-center font-weight-bold">${
          movie.name
        } </h4>
        <p class="card-text font-weight-light">
          ${movie.description}
        </p>  
        <button class="btn btn-danger w-100 delete-movie" data-movieid="${
          movie._id
        }"> Delete Movie </button>
        <div class="card-footer d-flex justify-content-start pb-1 w-100"> ${movie.genre
          .map(
            genre =>
              `<span class="badge badge-primary mx-1" style="font">${genre}</span>`
          )
          .join("")}
         </div>
         </div>`;
    // Create a node that contains the template markup
    let card = document.createElement("div");
    card.classList.add("card", "text-white", "bg-dark", "mb-3"); // Add "card" class to card node
    card.style.width = "30%"; // Add styles to card node
    card.innerHTML = markup; // Fill card node with the template markup
    document.getElementById("movies").appendChild(card); // appendChild diyince div ile olusturulmus bir element gerekli append deseydik text de olabilirdi.
  });
}

async function postMovieToAPI(event) {
  event.preventDefault();

  //Get values of the form inputs
  const movieName = document.getElementById("movie-name").value;
  const movieDescription = document.getElementById("movie-description").value;
  const movieReleased = document.getElementById("movie-released").value;
  const movieGenres = document.getElementById("movie-genres").value;
  const movieImage = document.getElementById("movie-image").value;

  //Split genres by"," then trim to avoid whitespaces
  const genreArray = movieGenres.split(",").map(genre => genre.trim());
  //Prepare the body of the request
  const requestBody = {
    name: movieName,
    description: movieDescription,
    released: movieReleased,
    genre: genreArray,
    movieUrl: movieImage
  };

  //Give options to fetch (default of fetch is get not post)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  };
  //Send the request and await for response
  const response = await fetch(
    "https://lit-waters-49720.herokuapp.com/movies",
    options
  );
  const responseJson = await response.json();

  $("#add-movie-model").modal("toggle"); //Toggle modal
  $("#movies").html(""); //Reset the content of the div with id movies
  getMoviesFromAPI(); //Fetch all movies again
}
async function deleteMovieFromAPI() {
  const movieId = $(this).data("movieid");
  await fetch(`https://lit-waters-49720.herokuapp.com/movies/${movieId}`, {
    method: "DELETE"
  });
  $("#movies").html(""); //Reset the content of the div with id movies
  getMoviesFromAPI(); // Fetch all movies again
}

getMoviesFromAPI(); // Fetch all movies when a user first enters the website

const addMovieForm = document.getElementById("add-movie-form");

//Add event listener for the form, when a user submit a call postMovieToAPI function
addMovieForm.addEventListener("submit", postMovieToAPI);

//Add event listener for the classes of delete-movie inside movies container when any of the buttons clicked call deleteMovieFromAPI function
$("#movies").on("click", ".delete-movie", deleteMovieFromAPI);
