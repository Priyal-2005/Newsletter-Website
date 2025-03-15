const apiKey = `cac3f2da3dfc46c4a70820671ce33d60`
const baseUrl = `https://newsapi.org/v2`

const contentWrapper = document.getElementById("contentWrapper");
const newsSearch = document.getElementById("newsSearchInput");
const messageText = document.getElementById("messageText");


async function getNews(){
    // When news is loading, show the message
    showMessage("Loading...");
    try{
        const getNewsDataApi = await fetch (`${baseUrl}/top-headlines?country=us&apiKey=${apiKey}`)
        const data = await getNewsDataApi.json()
        return data;
    }
    catch (error){
        console.log(error)
    }
}

getNews().then(data => renderNews(data.articles));

function showMessage(message) {
    messageText.style.display = "flex";
    messageText.textContent = message;
}

function renderNews(newsData) {
    newsData.forEach(news => {
        const defualtImage = `https://picsum.photos/600`
        const data = {
            // ?? means that when the data is null, it becomes defualtImage instead
            urlImage: news.urlToImage  ?? defualtImage,
            date: news.publishedAt,
            title: news.title,
            description: news.description ?? "",
            url: news.url
        }

        const card = `
        <div class="card">
                <div class="card-image-wrapper">
                    <img src="${data.urlImage}">
                </div>
                <div class="card-content">
                    <span class="card-date">${data.date}</span>
                    <h2 class="card-title">
                        <a href="${data.url}">${data.title}</a>
                    </h2>
                    <p class="card-description">${data.description}</p>
                </div>
            </div>
        `

        // Append the card to the content wrapper
        contentWrapper.insertAdjacentHTML('beforeend', card)
    });

    // Remove the message when the news has loaded 
    messageText.style.display = "none";
}


async function getSearchNews(query){
    showMessage("Loading...");
    try{
        const getNewsDataApi = await fetch (`${baseUrl}/everything?q=${query}/&apiKey=${apiKey}`)
        const data = await getNewsDataApi.json()
        return data;
    }
    catch (error){
        console.log(error)
    }
}


// Event listener for searching news
newsSearch.addEventListener("input", event => {
    const inputSearchValue = event.target.value;
    contentWrapper.innerHTML = ""; // Clear previous news

    if (inputSearchValue === "") {
        getNews().then(data => renderNews(data.articles));
    } else {
        getSearchNews(inputSearchValue).then(data => {
            if (!data.articles || data.articles.length === 0) {
                showMessage("No results found");
                return;
            }
            renderNews(data.articles);
        }).catch(error => {
            console.log(error);
            showMessage("Failed to load news. Please try again.");
        });
    }
});