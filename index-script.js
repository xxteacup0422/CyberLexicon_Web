document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search");
    const searchArea = document.querySelector(".search_area");

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
            });
        });
    });

    setInterval(() => {
        if (window.location.hash == "#about") {
            document.body.classList.add("fill");
            document.querySelector(".main").classList.add("invisible");
            document.querySelector(".info_area").classList.add("show");
        }
    });

    function showInfo() {
        window.location.hash = "#about";
    }

    function backMain() {
        window.location.href = "";
    }
});