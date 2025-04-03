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