let searchForm = document.querySelector("#search-form");
let nextSearch = "";
let winheight, docheight, trackLength, throttlescroll
let initialWindowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

let imagesObject,
    imageLoadnumber,
    imageLoaded = 0;

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let textValue = document.querySelector('#search-bar').value;
    loadAPI(`https://api.pexels.com/v1/search?query=${ textValue }&per_page=3`, true);
})

window.addEventListener("scroll", function(){
    clearTimeout(throttlescroll)
        throttlescroll = setTimeout(function(){ // throttle code inside scroll to once every 50 milliseconds
        getmeasurements();
        amountscrolled();
    }, 50)
}, false)

function getDocHeight() {
    return Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, window.screen.availHeight
    )
}

function getmeasurements(){
    winheight= window.innerHeight || (document.documentElement || document.body).clientHeight;
    docheight = getDocHeight();
    trackLength = docheight - winheight
}
 
function amountscrolled(){
    var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
    var pctScrolled = Math.floor(scrollTop/trackLength * 100) // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
    if (pctScrolled >= 99) {
        loadAPI(nextSearch, false);
    }
}

function incrementimageLoaded() {
    imageLoaded++;
    if ( imageLoaded === imageLoadnumber ) {
        if (initialWindowHeight > document.body.clientHeight) {
            loadAPI(nextSearch, false);
        } else {

        }
    }
}




function loadAPI(searchText, clearForm){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            imageLoaded = 0;
        // Typical action to be performed when the document is ready:
            let response = JSON.parse(xhttp.responseText);
            let pictureData = response.photos;
            let containerColumn = [
                document.querySelector('#picture-column-1'),
                document.querySelector('#picture-column-2'),
                document.querySelector('#picture-column-3')
            ];

            nextSearch = response.next_page;
            if (clearForm) {
                for (let container of containerColumn) {
                    container.innerHTML = '';
                }
            }
            let columnIndex = 0;
            pictureData.forEach(function(picture) {
                let pictureDiv = document.createElement('div');
                pictureDiv.classList.add('pexel-picture');
                pictureDiv.innerHTML = `
                    <img src=${picture.src.original}>  
                    <p class ="photographer">${picture.photographer}</p>

                `;
                containerColumn[ columnIndex ].appendChild(pictureDiv);
                if (columnIndex < 2){
                    columnIndex++;
                } else {
                    columnIndex = 0
                    imagesObject = document.images;
                    imageLoadnumber = imagesObject.length;                       
                    [].forEach.call( imagesObject, function( imageObject ) {
                        if(imageObject.complete)
                        incrementimageLoaded();
                        else
                            imageObject.addEventListener( 'load', incrementimageLoaded, false );
                    } );
                        
                };           
            });
        };
    };

    xhttp.open("GET", searchText, true);
    xhttp.setRequestHeader('Authorization', "563492ad6f917000010000013d37e89fb42c4ad3a27740d44f7e90bd");
    xhttp.send();
}

