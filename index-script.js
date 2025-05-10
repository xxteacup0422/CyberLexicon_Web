document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search");
    const searchArea = document.querySelector(".search_area");

    const dictionaryArea = document.querySelector(".dictionary_area");
    const dictionaryWord = dictionaryArea.querySelector(".word");
    const dictionaryPronounce = dictionaryArea.querySelector(".pronounce");
    const dictionaryMeans = dictionaryArea.querySelector(".means");

    const params = new URLSearchParams(window.location.search);

    searchInput.addEventListener("input", () => {
        fetch("dictionary/ms-MY.json")
        .then((response) => response.json())
        .then((data) => {
            const searchValue = searchInput.value.toLowerCase();
            const filteredWords = data.filter((word) => {
                return word.name.toLowerCase().includes(searchValue);
            });

            searchArea.innerHTML = "";

            filteredWords.forEach((word) => {
                const wordElement = document.createElement("li");
                wordElement.innerHTML = word.name;
                searchArea.appendChild(wordElement);
                wordElement.addEventListener("click", () => {
                    window.location.href = `?id=${word.id}`;
                });
            });
        });
    });

    if (window.location.hash == "#about") {
        document.body.classList.add("fill");
        document.querySelector(".main").classList.add("invisible");
        document.querySelector(".info_area").classList.add("show");
    }
    if (params.get("id")) {
        document.body.classList.add("fill");
        document.querySelector(".main").classList.add("invisible");
        document.querySelector(".dictionary_area").classList.add("show");
        fetch("dictionary/ms-MY.json")
        .then((response) => response.json())
        .then((data) => {
            const filteredWords = data.filter((word) => word.id.includes(params.get("id")));

            let word = filteredWords[0]
            dictionaryWord.innerHTML = word.name;
            word.pronounce.forEach((pronounce) => {
                const spanPronounce = document.createElement("span");
                spanPronounce.innerHTML = `[${pronounce}]`;
                dictionaryPronounce.appendChild(spanPronounce);
            });

            word.means.forEach((means) => {
                let type = means.type;
                let source = means.source;
                let tag = means.tag;
                let meansList = means.mean;
                let meansElement = document.createElement("li");
                meansElement.innerHTML = `${type}. ${source ? `[${source}]` : ""} ${tag ? `(${tag})` : ""} ${meansList}`;
                dictionaryMeans.appendChild(meansElement);
            });
        });
    }
});

function showInfo() {
    window.location.hash = "#about";
    location.reload();
}

function backMain() {
    window.location.search = "?";
}