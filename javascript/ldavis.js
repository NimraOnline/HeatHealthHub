//import * as d3 from "https://cdn.skypack.dev/d3@5";

const urlList = [
    "./data/lda-model.json",
    "./data/pubmed_extreme-heat_data_topics.json"
];

const promiseList = urlList.map((url) => {
    return fetch(url)
        .then(response => response.json())
});

const listEl = document.querySelector(".article-list");
const countEl = document.querySelector(".article-count");
  
Promise.all(promiseList).then(valuesArr => {
    loadVis(valuesArr);
});

function loadVis(arr) {
    const ldavis_data = arr[0];
    const pubmed_data = arr[1];
    new LDAvis("#" + "ldavis_el", ldavis_data);

    const selectEl = document.querySelector("select[name='keyword']");
    reset();
    updateArticleList(pubmed_data, selectEl.value);
    selectEl.addEventListener("change", (event) => {
        reset();
        updateArticleList(pubmed_data, event.target.value);
    });
}

function reset() {
    listEl.innerHTML = "";
    countEl.innerHTML = "";
}

function updateArticleList(data, value) {
    const articles = data.filter((d) => {
        return d.tokens.includes(value);
    });

    countEl.innerHTML = articles.length;

    for (let i = 0; i < articles.length; ++i) {
        listEl.appendChild(createListItem(articles[i]));
    }
}

function createListItem(article) {
    const li = document.createElement('li');
    li.classList.add('item');
    li.innerHTML = getArticleContent(article);
    return li;
}

function getArticleContent(article) {
    const link = `https://pubmed.ncbi.nlm.nih.gov/${article.PMID}`;
    const content = `
        <h3>${article.Title}</h3>
        <p>${article.Authors}</p>
        <small>${article['Publication Title']}. ${article['Publication Year']}</small>
        <p class="topic">Topic ${article['topic']}</p>
        <a href="${link}" target="_blank"></a>
    `;
    return content;
}