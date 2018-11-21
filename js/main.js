/* globals APIKEY */

const movieDataBaseURL = "https://api.themoviedb.org/3/";
let imageURL = null;
let imagesizes = [];

let searchString = "";

document.addEventListener("DOMContentLoaded", init);

function init() {
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

    //in save in localstorage and < 60 minutes old, load and use from local storage

    getPosterURLAndSizes();
}

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
    }

    // this is a new search so you should reset any existing page data

    getSearchResults();
}

function getSearchResults() {

    let url = `${movieDataBaseURL}search/movie?api_key=${APIKEY}&query=${searchString}`;
    fetch(url)
        .then((response) => response.json())
        .then(function (data) {
            console.log(data);
            data = data.results;
            console.log(data);
            for (let i = 0; i < 20; i++) {
                let image=data[i].poster_path;
                console.log(image);
                let title = data[i].original_title;
                console.log(title);
                let releaseDate = data[i].release_date;
                console.log(releaseDate);
                let vote = data[i].vote_average;
                console.log(vote);
                let overview=data[i].overview;
                console.log(overview);
            }
            
        })
        .catch((error) => alert(error));
}
