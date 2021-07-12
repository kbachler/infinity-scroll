const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let isInitialLoad = true;
let photosArray = [];

// Unsplash API
let initialCount = 5;
const animalId = "Jpg6Kidl-Hk";
const apiKey = 'API_KEY';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}&topics=${animalId}`;

function updateAPIURLWithNewCount(picCount) {
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${picCount}&topics=${animalId}`;
}

// Determine when image is loaded successfully
function imageLoaded() {
    imagesLoaded++;
    if(imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
    for(const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Create elements for links and photos. Add to DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    photosArray.forEach((photo) => {
        // Create anchor element to link to Unsplash API
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });

        // Create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });
        // Event listener, check when each photo is finished loading
        img.addEventListener('load', imageLoaded());

        // Place <img> inside the <a>, then place into imageContainer
        item.appendChild(img);
        imageContainer.appendChild(item);
    })
}

// Get photos from Unsplash API
async function getPhotos() {
    try {
        if (isInitialLoad) {
            updateAPIURLWithNewCount(30);
            isInitialLoad = false;
        }
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
    } catch (error) {
        alert(error);
    }
}

// Load more photos if scrolling near bottom of page
window.addEventListener('scroll', () => {
    if(((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) && ready) {
        getPhotos();
        ready = false;
    }
});

getPhotos();