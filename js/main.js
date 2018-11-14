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
