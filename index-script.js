document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".main .search-input input");
    const searchInput_clearButton = document.querySelector(".main .search-input .clear-button");
    const searchList = document.querySelector(".main .search-list");
    
    const menu_bar_title = document.querySelector('.menu-bar .title');
    const aboutButton = document.querySelector(".menu-bar .button-list #about-button");

    searchInput.addEventListener("keyup", () => {
        searchInput_clearButton.classList.add("show");
        fetch("dictionary/ms-MY.json")
        .then((response) => response.json())
        .then((data) => {
            const searchValue = searchInput.value.toLowerCase();
            const filteredWords = data.filter((word) => {
                return word.name.toLowerCase().includes(searchValue);
            });

            searchList.innerHTML = "";

            filteredWords.forEach((word) => {
                const wordElement = document.createElement("li");
                wordElement.innerHTML = word.name;
                searchList.appendChild(wordElement);
                wordElement.addEventListener("click", () => {
                    window.location.href = `word.html?id=${word.id}`;
                });
            });
            if (filteredWords.length === 0) {
                searchList.classList.remove("show");
            } else {
                searchList.classList.add("show");
            }
        });
    });

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            fetch("dictionary/ms-MY.json")
            .then((response) => response.json())
            .then((data) => {
                const searchValue = searchInput.value.toLowerCase();
                const filteredWords = data.filter((word) => word.name.toLowerCase() == searchValue);

                if (filteredWords.length == 1) {
                    filteredWords.forEach((word) => {
                        window.location.href = `word.html?id=${word.id}`;
                    });
                } else if (filteredWords.length > 1) {
                    alert("The system found two identical word names. Please click on the word in the purple area.")
                } else {
                    alert("No Find The Word.")
                }
            });
        }
    })

    searchInput_clearButton.addEventListener("click", () => {
        searchInput.value = "";
        searchList.classList.remove("show");
        searchInput_clearButton.classList.remove("show");
    });

    menu_bar_title.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    aboutButton.addEventListener("click", () => {
        window.location.href = "about.html";
    });
});