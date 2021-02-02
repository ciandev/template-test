const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const errorMsgContainer = document.getElementById('error-message-container');

const errorLimit = 5;
let errorCount = 0;

// Show Loading Spinner
function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
    errorMsgContainer.hidden = true;
}

// Hide Loading Spinner
function removeLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}
//Get quote from API
async function getQuote() {
    showLoadingSpinner();
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        // If Author is blank, add 'Unkonw'
        if (data.quoteAuthor === '') {
            authorText.innerText = 'Unkonw';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        //Reduce font size for long quotes
        if (data.quoteText.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;
        // Stop Loader
        removeLoadingSpinner();
        
    } catch (error) {
        if (errorCount < errorLimit) {
            errorCount++;
            getQuote();
        } else {
            loader.hidden = true;
            quoteContainer.hidden = true;
            errorMsgContainer.hidden = false;
            
        }
    }
}

//Tweet Quote
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

//Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

//On load
getQuote();
