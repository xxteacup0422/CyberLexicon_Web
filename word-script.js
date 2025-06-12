document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".main .search-input input");
    const searchInput_clearButton = document.querySelector(".main .search-input .clear-button");
    const searchList = document.querySelector(".main .search-list");
    
    const menu_bar_title = document.querySelector('.menu-bar .title');
    const aboutButton = document.querySelector(".menu-bar .button-list #about-button");
    
    const showDictionary = document.querySelector(".main .dictionary");

    const params = new URLSearchParams(window.location.search);

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

    searchInput_clearButton.addEventListener("click", () => {
        searchInput.value = "";
        searchList.classList.remove("show");
        searchInput_clearButton.classList.remove("show");
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
                        window.location.href = `?id=${word.id}`;
                    });
                } else if (filteredWords.length > 1) {
                    alert("The system found two identical word names. Please click on the word in the purple area.")
                } else {
                    alert("No Find The Word.")
                }
            });
        }
    })

    menu_bar_title.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    aboutButton.addEventListener("click", () => {
        window.location.href = "about.html";
    });

    if (params.has("id")) {
        fetch("dictionary/ms-MY.json")
        .then((response) => response.json())
        .then((data) => {
            const filteredWords = data.filter((word) => word.id.includes(params.get("id")));

            if (filteredWords.length != 0) {
                const word = filteredWords[0];
                showDictionary.querySelector(".word-name").innerHTML = word.name;
                if (word.basic) {
                    showDictionary.querySelector(".word-basic").classList.add("show");
                    showDictionary.querySelector(".label-basic").classList.add("show");
                    fetch("dictionary/ms-MY.json")
                    .then((response) => response.json())
                    .then((data) => {
                        const basicWords = data.filter((item) => item.id == word.basic);
                        showDictionary.querySelector(".word-basic").innerHTML = basicWords[0].name;
                        showDictionary.querySelector(".word-basic").addEventListener("click", () => {
                            window.location.href = `?id=${basicWords[0].id}`;
                        });
                    });
                }
                word.pronounce.forEach((pronounce) => {
                    const spanPronounce = document.createElement("span");
                    spanPronounce.innerHTML = `[${pronounce}]`;
                    showDictionary.querySelector(".word-pronounce").appendChild(spanPronounce);
                });

                word.means.forEach((means) => {
                    let type = means.type;
                    let source = means.source;
                    let tag = means.tag;
                    let meansList = means.mean;
                    let meansElement = document.createElement("li");
                    let meansType = document.createElement("span");
                    meansType.classList.add("means_type");
                    let meansSource = document.createElement("span");
                    if (source) {
                        meansSource.classList.add("means_source");
                    }
                    let meansTag = document.createElement("div");
                    let meansMeaning = document.createElement("span");
                    meansMeaning.classList.add("means_meaning");
                    meansType.innerHTML = type ? `${type}.` : "";
                    meansSource.innerHTML = source ? source : "";
                    if (tag) {
                        meansTag.classList.add("means_tag");
                        tag.forEach((item) => {
                            let tagElement = document.createElement("span");
                            tagElement.innerHTML = item;
                            meansTag.appendChild(tagElement);
                        });
                    }
                    meansMeaning.innerHTML = meansList;
                    meansElement.appendChild(meansTag);
                    meansElement.appendChild(meansSource);
                    meansElement.appendChild(meansType);
                    meansElement.appendChild(meansMeaning);
                    showDictionary.querySelector(".word-means").appendChild(meansElement);

                    meansType.addEventListener("click", () => {
                        let fullText = "";
                        if (type == "adj") {
                            fullText = "形容词 | Adjective | Kata Adjektif";
                        } else if (type == "clf") {
                            fullText = "数词 | Classifier | Kata Bilangan";
                        } else if (type == "num") {
                            fullText = "量词 | Numeral | Penjodoh Bilangan";
                        } else if (type == "prep") {
                            fullText = "介词 | Preposition | Kata Sendi";
                        } else if (type == "conj") {
                            fullText = "连词 | Conjunction | Kata Hubung";
                        } else if (type == "n") {
                            fullText = "名词 | Noun | Kata Nama";
                        } else if (type == "adv") {
                            fullText = "副词 | Adverb | Kata Keterangan";
                        } else if (type == "pron") {
                            fullText = "代名词 | Pronoun | Kata Ganti";
                        } else if (type == "v") {
                            fullText = "动词 | Verb | Kata Kerja";
                        } else if (type == "intrj") {
                            fullText = "感叹词 | Interjection | Kata Seru";
                        }
                        alert(`Full Text: ${fullText}`);
                    });

                    meansSource.addEventListener("click", () => {
                        let fullText = "";
                        if (source == "ar") {
                            fullText = "阿拉伯 | Arabic | Arab";
                        } else if (source == "br") {
                            fullText = "文莱 | Brunei | Brunei";
                        } else if (source == "cn") {
                            fullText = "中文 | China | China";
                        } else if (source == "idnl") {
                            fullText = "印尼-荷属 | Indonesia-Netherlands | Indonesia-Belanda";
                        } else if (source == "id") {
                            fullText = "印尼 | Indonesia | Indonesia";
                        } else if (source == "jh") {
                            fullText = "柔佛 | Johor | Johor";
                        } else if (source == "jk") {
                            fullText = "雅加达 | Jakarta | Jakarta";
                        } else if (source == "jw") {
                            fullText = "爪哇 | Jawa | Jawa";
                        } else if (source == "kd") {
                            fullText = "吉打 | Kedah | Kedah";
                        } else if (source == "kl") {
                            fullText = "吉兰丹 | Kelantan | Kelantan";
                        } else if (source == "ml") {
                            fullText = "马六甲 | Malacca | Melaka";
                        } else if (source == "mn") {
                            fullText = "米南佳保[苏门答腊] | Minangkabau | Minangkabau";
                        } else if (source == "ns") {
                            fullText = "森美兰 | Negeri Sembilan | Negeri Sembilan";
                        } else if (source == "ph") {
                            fullText = "彭亨 | Pahang | Pahang";
                        } else if (source == "pl") {
                            fullText = "玻璃市 | Perlis | Perlis";
                        } else if (source == "pr") {
                            fullText = "霹雳 | Perak | Perak";
                        } else if (source == "sb") {
                            fullText = "沙巴 | Sabah | Sabah";
                        } else if (source == "sg") {
                            fullText = "新加坡 | Singapore | Singapura";
                        } else if (source == "sl") {
                            fullText = "雪兰莪 | Selangor | Selangor";
                        } else if (source == "sr") {
                            fullText = "砂拉越 | Sarawak | Sarawak";
                        } else if (source == "tr") {
                            fullText = "登嘉楼 | Terengganu | Terengganu";
                        }
                        alert(`Full Text: ${fullText}`);
                    });

                    if (tag) {
                        meansTag.querySelector("span").addEventListener("click", () => {
                            let fullText = "";
                            if (tag == "abbr") {
                                fullText = "缩写 | Abbreviation | Kependekan";
                            } else if (tag == "cl") {
                                fullText = "古典文字 | Classical Literature | Sastera Lama";
                            } else if (tag == "egl") {
                                fullText = "优雅的语文 | Elegant Language | Bahasa Halus";
                            } else if (tag == "ful") {
                                fullText = "粗鲁的语文 | Foul Language | Bahasa Kasar";
                            } else if (tag == "ous") {
                                fullText = "口语 | Oral Usage | Bahasa Percakapan";
                            } else if (tag == "prov") {
                                fullText = "谚语 | Proverb | Peribahasa";
                            } else if (tag == "rus") {
                                fullText = "宫廷用语 | Royal Usage | Bahasa Istana/Dalam";
                            } else if (tag == "ant") {
                                fullText = "人类学 | Anthropology | Antropologi";
                            } else if (tag == "bio") {
                                fullText = "生物学 | Biology | Biologi";
                            } else if (tag == "econ") {
                                fullText = "经济 | Economy | Ekonomi";
                            } else if (tag == "phys") {
                                fullText = "物理学 | Physics | Fizik";
                            } else if (tag == "geol") {
                                fullText = "地质学 | Geology | Geologi";
                            } else if (tag == "geogr") {
                                fullText = "地理学 | Geography | Geografi";
                            } else if (tag == "for") {
                                fullText = "林业 | Forestry | Perhutanan";
                            } else if (tag == "eng") {
                                fullText = "工程学 | Engineering | Kejuruteraan";
                            } else if (tag == "chem") {
                                fullText = "化学 | Chemistry | Kimia";
                            } else if (tag == "ling") {
                                fullText = "语言学 | Linguistics | Linguistik";
                            } else if (tag == "math") {
                                fullText = "数学 | Mathematics | Matematik";
                            } else if (tag == "mus") {
                                fullText = "音乐 | Music | Muzik";
                            } else if (tag == "psy") {
                                fullText = "心理学 | Psychology | Psikologi";
                            } else if (tag == "liter") {
                                fullText = "文学 | Literature | Kesusasteraan";
                            } else if (tag == "arch") {
                                fullText = "建筑学 | Architecture | Seni Bina";
                            } else if (tag == "hs") {
                                fullText = "历史 | History | Sejarah";
                            } else if (tag == "ag") {
                                fullText = "农业 | Agriculture | Pertanian";
                            } else if (tag == "law") {
                                fullText = "法律 | Law | Undang-Undang";
                            } else if (tag == "med") {
                                fullText = "医学 | Medical | Perubatan";
                            }
                            alert(`Full Text: ${fullText}`);
                        });
                    }
                });
                if (word.example) {
                    word.example.forEach((item) => {
                        showDictionary.querySelector(".word-example").classList.add("show");
                        showDictionary.querySelector(".label-example").classList.add("show");
                        let itemElement = document.createElement("li");
                        itemElement.innerHTML = `${item}`;
                        showDictionary.querySelector(".word-example").appendChild(itemElement);
                    });
                }
                if (word.synonym) {
                    word.synonym.forEach((id) => {
                        showDictionary.querySelector(".word-synonym").classList.add("show");
                        showDictionary.querySelector(".label-synonym").classList.add("show");
                        fetch("dictionary/ms-MY.json")
                        .then((response) => response.json())
                        .then((data) => {
                            const basicWords = data.filter((item) => item.id == id);
                            let itemElement = document.createElement("li");
                            itemElement.innerHTML = `${basicWords[0].name}`;
                            showDictionary.querySelector(".word-synonym").appendChild(itemElement);
                            itemElement.addEventListener("click", () => {
                                window.location.href = `?id=${basicWords[0].id}`;
                            });
                        });
                    });
                }
            }
        });
    } else {
        window.location.href = 'index.html';
    }
});