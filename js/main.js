/* globals APIKEY */

const movieDataBaseURL = "https://api.themoviedb.org/3/";
let imageURL = null;
let imagesizes = [];

let searchString = "";
let Showlist = null;

let pages = [];
let imageURLKey = "imageURL";
let imageSizeKey = "imageSize";
let timeKey = "timeKey";
let modeKey = "modeKey";
let TVmode = "TVmodeKey";
let staleDataTimeOut = "3600";
let modes = null;

document.addEventListener("DOMContentLoaded", init);

function init() {

    pages = document.querySelectorAll(".page");
    console.log(pages);

    // console.log(APIKEY);
    addEventListeners();
    getDataFromLocalStorage();
    getPosterURLAndSizes();
}

function addEventListeners() {


    let searchButton = document.querySelector(".magnifyDiv");
    searchButton.addEventListener("click", startSearch);


    //    document.querySelector("#search-input").addEventListener("onkeydown", startSearch);
    document.querySelector(".searchButtonDiv").addEventListener("click", showoverlay);

    document.querySelector(".btncancel").addEventListener("click", hideoverlay);

    document.querySelector(".Backbutton").addEventListener("click", PageBack);
    document.querySelector(".btnsave").addEventListener("click", function (e) {
        let TVshow = document.getElementsByName("show");
        for (let i = 0; i < TVshow.length; i++) {
            if (TVshow[i].checked) {
                Showlist = TVshow[i].value;
                break;
            }
        }
        let p = document.querySelector(".list");
        p.innerHTML = "";
        let h1 = document.createElement("h1");
        h1.innerHTML = Showlist + " Reccomdation";
        console.log("Saved mode in local Storage");
        localStorage.setItem(modeKey, JSON.stringify(Showlist.value));
        console.log(Showlist);
        h1.style.fontFamily = "serif";
        p.appendChild(h1);
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


function saveDateToLocalStorage() {

    console.log("Saving current Date to Local Storage");
    let now = new Date();
    localStorage.setItem(timeKey, now);
}

function getDataFromLocalStorage() {
    // Check if secure base url and sizes array are saved in Local Storage, if not call getPosterURLAndSIzes()

    //    if (localStorage.getItem(imageURLKey) && localStorage.getItem(imageSizeKey)) {
    //        console.log("Data retrieved from local Storage");
    //        imageURL = localStorage.getItem(modeKey);
    //        imagesizes = localStorage.getItem(imageSizeKey);
    //
    //        console.log(imageURL);
    //        console.log(imagesizes);
    //    } else {
    //        console.log("Data is not saved on local Storage");
    //    }

    if (localStorage.getItem(modeKey)) {
        console.log("Mode Data Retrieved from local Storage");
        Showlist = localStorage.getItem(modeKey);
        console.log(Showlist.value);
    }
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
            getPosterURLAndSizes();
        }
    } else {
        getPosterURLAndSizes();
    }
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

            localStorage.setItem(imageURLKey, JSON.stringify(imageURL.value));
            localStorage.setItem(imageSizeKey, JSON.stringify(imagesizes));
            console.log("Data saved in local Storage");
            console.log(imageURL);
            console.log(imagesizes);
        })
        .catch(function (error) {
            console.log(error);
        })
}

function startSearch() {

    let search = document.getElementById("search-input");
    search.style.width = "800px";
    let main = document.querySelector("main");
    main.style.transform = "translateY(-250px)";
    main.style.transition = "transform 1s";
    console.log("start search");
    //    if (Event.keyCode == 'Enter') {
    //        console.log("Hi");
    //    }
    modes = Showlist;
    console.log(modes);
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

                createPages(data, "#search-results");

            })
            .catch((error) => alert(error));
    }

}

function createPages(data, pageid) {
    let content = document.querySelector(pageid + ">.content");

    let Title = document.querySelector(pageid + ">.title");

    let message = document.createElement("h2");
    content.innerHTML = "";
    Title.innerHTML = "";

    if (data.total_results == 0) {
        message.innerHTML = `No data Found ${searchString}`;
    }
    if (pageid == "#search-results") {
        message.innerHTML = `Total ${data.total_results} results found for ${searchString} <br> Page include 1 to ${data.results.length}`;
        message.style.color = "red";
        message.style.fontSize = "2rem";
        Title.appendChild(message);
        let documentFragment = new DocumentFragment();
        documentFragment.appendChild(createCards(data.results));

        content.appendChild(documentFragment);

    } else if (pageid == "#recommend-results") {
        message.innerHTML = `Total ${data.total_results} results found for ${searchString} <br> 1 to ${data.results.length} Recommendation show below :`;
        message.style.color = "red";
        message.style.fontSize = "2rem";
        Title.appendChild(message);
        let documentFragment = new DocumentFragment();
        documentFragment.appendChild(CreateRecommendationCard(data.results));

        content.appendChild(documentFragment);

    }

    let cardList = document.querySelectorAll(".content>div");
    cardList.forEach(function (item) {
        item.addEventListener("click", getReccomendation);
    });

}

function createCards(results) {

    let documentFragment = new DocumentFragment();

    results.forEach(function (movie) {

        let movieCard = document.createElement("div");
        let section = document.createElement("section");
        let image = document.createElement("img");
        let Title = document.createElement("h3");
        let release_date = document.createElement("h4");
        let review = document.createElement("h5");
        let overview = document.createElement("p");

        Title.textContent = movie.original_title;
        release_date.textContent = movie.release_date;
        review.textContent = movie.vote_average;
        overview.textContent = movie.overview;

        image.src = `${imageURL}${imagesizes[2]}${movie.poster_path}`;

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

        documentFragment.appendChild(movieCard);
        navigate(0);

    });
    return documentFragment;
}

function CreateRecommendationCard(results) {

    let documentFragment = new DocumentFragment();

    results.forEach(function (movie) {

        let movieCard = document.createElement("div");
        let section = document.createElement("section");
        let image = document.createElement("img");
        let Title = document.createElement("h3");
        let release_date = document.createElement("h4");
        let review = document.createElement("h5");
        let overview = document.createElement("p");

        Title.textContent = movie.original_title;
        release_date.textContent = movie.release_date;
        review.textContent = movie.vote_average;
        overview.textContent = movie.overview;

        image.src = `${imageURL}${imagesizes[2]}${movie.poster_path}`;

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

        documentFragment.appendChild(movieCard);
        navigate(1);
        //        let alttext = document.querySelector("#search-results>.content>section>img");
        //        let att = document.createAttribute("alt");
        //        att.value = "Image not found";
        //        alttext.setAttributeNode(att);

    });
    return documentFragment;
}

function getReccomendation() {

    let movieTitle = this.getAttribute("data-title");
    let movieID = this.getAttribute("data-id");
    let url = `${movieDataBaseURL}movie/${movieID}/recommendations?api_key=${APIKEY}`;
    searchString = movieTitle;
    console.log(searchString);
    fetch(url)
        .then((response) => response.json())
        .then(function (data) {
            console.log(data);
            createPages(data, "#recommend-results");
        })
        .catch((error) => alert(error));
}

function calculateElapseTime(savedDate) {
    let now = new Date(); // get the current time
    console.log(now);

    let elapsedTime = now.getTime() - savedDate.getTime();

    let seconds = Math.ceil(elapsedTime / 1000);
    console.log("Elapsed Time: " + seconds + "seconds");
    return seconds;
}

function PageBack() {

    if (navigate(1) == 'active') {
        navigate(0).classList.add('active');
        navigate(1).classList.remove('active');
    } else if(navigate(0) == 'active')
    {
        navigate(0).classList.remove('active');
        navigate(1).classList.remove('active');
    }
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
