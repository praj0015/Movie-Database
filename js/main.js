/* globals APIKEY */

const movieDataBaseURL = "https://api.themoviedb.org/3/";
let imageURL = null;
let imagesizes = [];

let searchString = "";

let pages = [];
let imagesURL = "imageURKey";
let imagesize = "imageSizeKey";
let timeKey = "timeKey";
let mode = "modeKey";
let staleDataTimeOut = "3600";
let modes = null;

document.addEventListener("DOMContentLoaded", init);

function init() {

    pages = document.querySelectorAll(".page");
    console.log(pages);
    // console.log(APIKEY);
    addEventListeners();
    getDataFromLocalStorage();
}

function addEventListeners() {


    let searchButton = document.querySelector(".magnifyDiv");
    searchButton.addEventListener("click", startSearch);

    document.querySelector(".searchButtonDiv").addEventListener("click", showoverlay);

    document.querySelector(".btncancel").addEventListener("click", hideoverlay);

    document.querySelector(".btnsave").addEventListener("click", function (e) {
        let TVshow = document.getElementsByName("show");
        let Showlist = null;
        for (let i = 0; i < TVshow.length; i++) {
            if (TVshow[i].checked) {
                Showlist = TVshow[i].value;
                break;
            }
        }
        let p = document.querySelector(".list");
        p.innerHTML = "";
        let h1 = document.createElement("h1");
        h1.innerHTML = Showlist + " Reccomdations";
        p.appendChild(h1);
        console.log(Showlist);
        hideoverlay(e);
    });
}

function showoverlay(e) {
    e.preventDefault();
    let overlay = document.querySelector(".overlay");
    overlay.classList.add("show");
    overlay.classList.remove("hide");
    showmodal(e);
}

function showmodal(e) {

    e.preventDefault();
    let modal = document.querySelector(".modal");
    modal.classList.add("on");
    modal.classList.remove("off");
}

function hideoverlay(e) {
    e.preventDefault();
    let overlay = document.querySelector(".overlay");
    overlay.classList.add("hide");
    overlay.classList.remove("show");
    hidemodal(e);
}

function hidemodal(e) {
    e.preventDefault();
    e.stopPropagation(); // do not allow click to pass through
    let modal = document.querySelector(".modal");
    modal.classList.add("off");
    modal.classList.remove("on");
}

function getDataFromLocalStorage() {
    // Check if secure base url and sizes array are saved in Local Storage, if not call getPosterURLAndSIzes()

    // If in local Storage check if saved over 60 minutes ago, if true call getPosterURLAndSizes
    if (localStorage.getItem(timeKey)) {
        console.log("Retrieved saved store date from local Storage");
        let savedDate = localStorage.getItem(timeKey);
        savedDate = new Date(savedDate);

        console.log(savedDate);

        let seconds = calculateElapseTime(savedDate);
        if (seconds > staleDataTimeOut) {
            console.log("Local Storage Data is stale");
            saveDateToLocalStorage();
        }
    } else {
        getPosterURLAndSizes();
    }


}

function saveDateToLocalStorage() {

    console.log("Saving current Date to Local Storage");
    let now = new Date();
    localStorage.setItem(timeKey, now);
}

//in save in localstorage and < 60 minutes old, load and use from local storage



function getPosterURLAndSizes() {
    //https://api.themoviedb.org/3/configuration?api_key=<<api_key>>

    let url = `${movieDataBaseURL}configuration?api_key=${APIKEY}`;


    //fetch

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            imageURL = data.images.secure_base_url;
            imagesizes = data.images.poster_sizes;

            console.log(imageURL);
            console.log(imagesizes);
        })
        .catch(function (error) {
            console.log(error);
        })
}

function startSearch() {

    //  console.log("start search");
    searchString = document.getElementById("search-input").value;
    if (!searchString) {
        alert("Please enter search data");
        document.getElementById("search-input").focus;
        return;
    } else {

        let url = `${movieDataBaseURL}search/movie?api_key=${APIKEY}&query=${searchString}`;
        fetch(url)
            .then((response) => response.json())
            .then(function (data) {
                console.log(data);

                createPages(data);
                //            createCards(data.results)
                //                for (let i = 0; i < 20; i++) {
                //                    let image = data[i].poster_path;
                //                    console.log(image);
                //                    let title = data[i].original_title;
                //                    console.log(title);
                //                    let releaseDate = data[i].release_date;
                //                    console.log(releaseDate);
                //                    let vote = data[i].vote_average;
                //                    console.log(vote);
                //                    let overview = data[i].overview;
                //                    console.log(overview);
                //
                //                    let main = document.querySelector("#search-results>.content");
                //                    let movieCard = document.createElement("div");
                //                    let section = document.createElement("section");
                //                    let images = document.createElement("img");
                //                    let OriTitle = document.createElement("h3");
                //                    let release_Date = document.createElement("h4");
                //                    let review = document.createElement("p");
                //                    let Overview_new = document.createElement("p");
                //                    images.src = `https://image.tmdb.org/t/p/w185${image}`;
                //
                //                    //                    movieCard.setAttribute("data-title", movie.title);
                //                    //                    movieCard.setAttribute("data-id", movie.id);
                //
                //                    OriTitle.innerHTML = "Title : " + title;
                //                    release_Date.innerHTML = "Release Date : " + releaseDate;
                //                    review.innerHTML = "Review : " + vote;
                //                    Overview_new.innerHTML = "Overview : " + overview;
                //
                //                    movieCard.className = "movieCard";
                //                    section.className = "ImageSection";
                //                    review.className = "p1";
                //                    //                    release_Date.className="p2";
                //
                //
                //                    movieCard.appendChild(OriTitle);
                //                    section.appendChild(images);
                //                    movieCard.appendChild(section);
                //                    movieCard.appendChild(release_Date);
                //                    movieCard.appendChild(review);
                //                    movieCard.appendChild(Overview_new);
                //
                //                    main.appendChild(movieCard);
                //                }
                //                navigate(0);

            })
            .catch((error) => alert(error));
        // this is a new search so you should reset any existing page data

    }

}

function createPages(data) {
    let content = document.querySelector("#search-results>.content");

    let title = document.querySelector("#search-results>.title");

    let message = document.createElement("h2");
    content.appendChild = "";
    title.appendChild = "";

    if (data.total_results == 0) {
        message.innerHTML = `No data Found ${searchString}`;
    } else {
        message.innerHTML = `Total ${data.total_results} results found for ${searchString}`;
    }
    console.log(message);
   // title.appendChild(message);
    let documentFragment = new DocumentFragment();
    documentFragment.appendChild(createCards(data.results));
    
    content.appendChild(documentFragment);

}

function createCards(results) {

    let documnetFragment = new DocumentFragment();

    results.forEach(function(movie) {

        let movieCard = document.createElement("div");
        let section = document.createElement("section");
        let image = document.createElement("img");
        let release_date = document.createElement("p");
        let Title = document.createElement("p");
        let review = document.createElement("p");
        let overview = document.createElement("p");

        Title.textContent = movie.original_title;
        release_date.textContent = movie.release_date;
        review.textContent = movie.vote_average;
        overview.textContent = movie.overview;

        image.src = `https://image.tmdb.org/t/p/w185${movie.poster_path}`;

        movieCard.setAttribute("data-title", movie.title);
        movieCard.setAttribute("data-id", movie.id);

        movieCard.className = "movieCard";
        section.className = "imageSection";

        section.appendChild(image);
        movieCard.appendChild(section);
        movieCard.appendChild(Title);
        movieCard.appendChild(release_date);
        movieCard.appendChild(review);
        movieCard.appendChild(overview);
        
        documnetFragment.appendChild(movieCard);
    });
    
    return documnetFragment;
}

function getReccomendation(data) {


    //  let url = `${movieDataBaseURL}search/movie/data.id/api_key=${APIKEY}`;
    //  https://api.themoviedb.org/3/movie/{movie_id}/recommendations?api_key=<<api_key>>

}

function calculateElapseTime(savedDate) {
    let now = new Date(); // get the current time
    console.log(now);

    // calculate elapsed time
    let elapsedTime = now.getTime() - savedDate.getTime();

    let seconds = Math.ceil(elapsedTime / 1000);
    console.log("Elapsed Time: " + seconds + " seconds");
    return seconds;
}

let navigate = function (page) {
    for (let i = 0; i < pages.length; i++) {
        if (page == i) {
            pages[i].classList.add("active");
        } else {
            pages[i].classList.remove('active');
        }
    }
}
