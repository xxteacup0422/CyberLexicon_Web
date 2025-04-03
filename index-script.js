const main_area = document.querySelector(".main");
const info_button = main_area.querySelector(".button_area .info_button");

const info_area = document.querySelector(".info_area");

info_button.addEventListener("click", () => {
    document.body.classList.toggle("fill");
    main_area.classList.toggle("invisible");
    info_area.classList.toggle("show");
});