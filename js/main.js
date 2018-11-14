/* globals APIKEY */

const movieDataBaseURL = "https://api.themoviedb.org/3/";
let imageURL = null;
let imagesizes = [];

document.addEventListener("DOMContentLoaded", init);

function init() {
    // console.log(APIKEY);
    addEventListeners();
    getDataFromLocalStorage();
}

function addEventListeners() {

    document.querySelector(".search-button").addEventListener("click", showoverlay);

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

    let img = document

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
