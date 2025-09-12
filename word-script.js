document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".main .search-input input");
    const searchInput_clearButton = document.querySelector(".main .search-input .clear-button");
    const searchList = document.querySelector(".main .search-list");
    
    const menu_bar_title = document.querySelector('.menu-bar .title');
    const aboutButton = document.querySelector(".menu-bar .button-list #about-button");
    const wordcountButton = document.querySelector(".menu-bar .button-list #wordcount-button");

    const showDictionary = document.querySelector(".main .dictionary");

    const params = new URLSearchParams(window.location.search);

    searchInput.addEventListener("keyup", () => {
        if (searchInput.value === "") {
            searchList.classList.remove("show");
            searchInput_clearButton.classList.remove("show");
            return;
        }
        searchInput_clearButton.classList.add("show");
        fetch("dictionary/Words/ms-MY.json")
        .then((response) => response.json())
        .then((data) => {
            const searchValue = searchInput.value.toLowerCase();
            const filteredWords = data.filter((word) => {
                return word.name.toLowerCase().startsWith(searchValue);
            }).slice(0, 10);

            searchList.innerHTML = "";

            filteredWords.forEach((word) => {
                const wordElement = document.createElement("li");
                const regex = new RegExp(`(${searchInput.value})`, "i");
                const highlightedName = word.name.replace(regex, `<span class="highlight">$1</span>`);
                wordElement.innerHTML = highlightedName;
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
            fetch("dictionary/Words/ms-MY.json")
            .then((response) => response.json())
            .then((data) => {
                const searchValue = searchInput.value.toLowerCase();
                const filteredWords = data.filter((word) => word.name.toLowerCase() == searchValue);

                if (filteredWords.length == 1) {
                    filteredWords.forEach((word) => {
                        window.location.href = `?id=${word.id}`;
                    });
                } else if (filteredWords.length > 1) {
                    alert("The system found two identical word names. Please click on the word in the search list area.")
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

    wordcountButton.addEventListener("click", () => {
        fetch("dictionary/WordCount/ms-MY.txt")
        .then(response => response.text())
        .then(text => {
            alert(text);
        });
    });

    if (params.has("id")) {
        fetch("dictionary/Words/ms-MY.json")
        .then((response) => response.json())
        .then((data) => {
            const filteredWords = data.filter((word) => word.id == params.get("id"));

            if (filteredWords.length == 1) {
                const word = filteredWords[0];
                showDictionary.querySelector(".word-name").innerHTML = word.name;
                if (word.stem) {
                    showDictionary.querySelector(".word-stem").classList.add("show");
                    showDictionary.querySelector(".label-stem").classList.add("show");
                    fetch("dictionary/Words/ms-MY.json")
                    .then((response) => response.json())
                    .then((data) => {
                        const stemWords = data.filter((item) => item.id == word.stem);
                        showDictionary.querySelector(".word-stem").innerHTML = stemWords[0].name;
                        showDictionary.querySelector(".word-stem").addEventListener("click", () => {
                            window.location.href = `?id=${stemWords[0].id}`;
                        });
                    });
                }
                word.pronounce.forEach((pronounce) => {
                    const spanPronounce = document.createElement("span");
                    spanPronounce.innerHTML = `[${pronounce}]`;
                    showDictionary.querySelector(".word-pronounce").appendChild(spanPronounce);
                });

                word.means.forEach((means) => {
                    let means_id = means.means_id;
                    let type = means.type;
                    let source = means.source;
                    let tag = means.tag;
                    let meansList = means.mean;
                    let meansElement = document.createElement("li");
                    let meansMain = document.createElement("div");
                    meansMain.classList.add("means-main");
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
                    meansMain.appendChild(meansTag);
                    meansMain.appendChild(meansSource);
                    meansMain.appendChild(meansType);
                    meansMain.appendChild(meansMeaning);
                    meansElement.appendChild(meansMain);

                    let meansAnnontate = document.createElement("div");
                    meansAnnontate.classList.add("means-annontate");
                    fetch("dictionary/Annontate/zh-Hans/ms-MY.json")
                    .then(response => response.json())
                    .then(data => {
                        const filteredAnnontate = data.filter((word) => word.word_id.includes(params.get("id")));
                        if (filteredAnnontate.length != 0) {
                            let annontateLanguage = document.createElement("span");
                            annontateLanguage.innerHTML = "Chinese (Simplified)"
                            annontateLanguage.classList.add("annontate_language");
                            meansAnnontate.appendChild(annontateLanguage);
                            let annontateMeaning = document.createElement("span");
                            annontateMeaning.classList.add("annontate_meaning");
                            meansAnnontate.appendChild(annontateMeaning);
                            for (let item = 0; item < filteredAnnontate[0].means.length; item++) {
                                if (filteredAnnontate[0].means[item].means_id == means_id) {
                                    annontateMeaning.innerHTML = filteredAnnontate[0].means[item].mean;
                                }
                            }
                            meansElement.appendChild(meansAnnontate);
                        }
                    });

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
                            fullText = "华人 | Chinese | Cina";
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
                        meansTag.querySelectorAll("span").forEach((spanTag) => {
                            spanTag.addEventListener("click", (text) => {
                                let tag_abbr = text.target.innerHTML;
                                let fullText = "";
                                if (tag_abbr == "abbr") {
                                    fullText = "缩写 | Abbreviation | Kependekan";
                                } else if (tag_abbr == "cl") {
                                    fullText = "古典文字 | Classical Literature | Sastera Lama";
                                } else if (tag_abbr == "egl") {
                                    fullText = "优雅的语文 | Elegant Language | Bahasa Halus";
                                } else if (tag_abbr == "ful") {
                                    fullText = "粗鲁的语文 | Foul Language | Bahasa Kasar";
                                } else if (tag_abbr == "ous") {
                                    fullText = "口语 | Oral Usage | Bahasa Percakapan";
                                } else if (tag_abbr == "rus") {
                                    fullText = "宫廷用语 | Royal Usage | Bahasa Istana/Dalam";
                                } else if (tag_abbr == "ant") {
                                    fullText = "人类学 | Anthropology | Antropologi";
                                } else if (tag_abbr == "art") {
                                    fullText = "艺术 | Art | Kesenian";
                                } else if (tag_abbr == "bio") {
                                    fullText = "生物学 | Biology | Biologi";
                                } else if (tag_abbr == "econ") {
                                    fullText = "经济 | Economy | Ekonomi";
                                } else if (tag_abbr == "phys") {
                                    fullText = "物理学 | Physics | Fizik";
                                } else if (tag_abbr == "geol") {
                                    fullText = "地质学 | Geology | Geologi";
                                } else if (tag_abbr == "geogr") {
                                    fullText = "地理学 | Geography | Geografi";
                                } else if (tag_abbr == "for") {
                                    fullText = "林业 | Forestry | Perhutanan";
                                } else if (tag_abbr == "eng") {
                                    fullText = "工程学 | Engineering | Kejuruteraan";
                                } else if (tag_abbr == "chem") {
                                    fullText = "化学 | Chemistry | Kimia";
                                } else if (tag_abbr == "ling") {
                                    fullText = "语言学 | Linguistics | Linguistik";
                                } else if (tag_abbr == "math") {
                                    fullText = "数学 | Mathematics | Matematik";
                                } else if (tag_abbr == "mus") {
                                    fullText = "音乐 | Music | Muzik";
                                } else if (tag_abbr == "psy") {
                                    fullText = "心理学 | Psychology | Psikologi";
                                } else if (tag_abbr == "liter") {
                                    fullText = "文学 | Literature | Kesusasteraan";
                                } else if (tag_abbr == "arch") {
                                    fullText = "建筑学 | Architecture | Seni Bina";
                                } else if (tag_abbr == "hs") {
                                    fullText = "历史 | History | Sejarah";
                                } else if (tag_abbr == "ag") {
                                    fullText = "农业 | Agriculture | Pertanian";
                                } else if (tag_abbr == "law") {
                                    fullText = "法律 | Law | Undang-Undang";
                                } else if (tag_abbr == "med") {
                                    fullText = "医学 | Medical | Perubatan";
                                }
                                alert(`Full Text: ${fullText}`);
                            });
                        })
                    }
                });
                if (word.example) {
                    word.example.forEach((item) => {
                        let example_id = item.example_id;
                        showDictionary.querySelector(".word-example").classList.add("show");
                        showDictionary.querySelector(".label-example").classList.add("show");
                        let itemElement = document.createElement("li");
                        let exampleMain = document.createElement("span");
                        exampleMain.classList.add("example-main");
                        exampleMain.innerHTML = `${item["sentence"]}`;
                        itemElement.appendChild(exampleMain);

                        let exampleAnnontate = document.createElement("span");
                        exampleAnnontate.classList.add("example-annontate");
                        fetch("dictionary/Annontate/zh-Hans/ms-MY.json")
                        .then(response => response.json())
                        .then(data => {
                            const filteredAnnontate = data.filter((word) => word.word_id.includes(params.get("id")));
                            if (filteredAnnontate.length != 0) {
                                let annontateLanguage = document.createElement("span");
                                annontateLanguage.innerHTML = "Chinese (Simplified)"
                                annontateLanguage.classList.add("annontate_language");
                                exampleAnnontate.appendChild(annontateLanguage);
                                let annontateSentence = document.createElement("span");
                                annontateSentence.classList.add("annontate_Sentence");
                                exampleAnnontate.appendChild(annontateSentence);
                                for (let item = 0; item < filteredAnnontate[0].example.length; item++) {
                                    if (filteredAnnontate[0].example[item].example_id == example_id) {
                                        annontateSentence.innerHTML = filteredAnnontate[0].example[item].sentence;
                                    }
                                }
                                itemElement.appendChild(exampleAnnontate);
                            }
                        });

                        showDictionary.querySelector(".word-example").appendChild(itemElement);
                    });
                }
                if (word.synonym) {
                    word.synonym.forEach((id) => {
                        showDictionary.querySelector(".word-synonym").classList.add("show");
                        showDictionary.querySelector(".label-synonym").classList.add("show");
                        fetch("dictionary/Words/ms-MY.json")
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
                if (word.antonym) {
                    word.antonym.forEach((id) => {
                        showDictionary.querySelector(".word-antonym").classList.add("show");
                        showDictionary.querySelector(".label-antonym").classList.add("show");
                        fetch("dictionary/Words/ms-MY.json")
                        .then((response) => response.json())
                        .then((data) => {
                            const basicWords = data.filter((item) => item.id == id);
                            let itemElement = document.createElement("li");
                            itemElement.innerHTML = `${basicWords[0].name}`;
                            showDictionary.querySelector(".word-antonym").appendChild(itemElement);
                            itemElement.addEventListener("click", () => {
                                window.location.href = `?id=${basicWords[0].id}`;
                            });
                        });
                    });
                }
                if (word.affix) {
                    word.affix.forEach((id) => {
                        showDictionary.querySelector(".word-affix").classList.add("show");
                        showDictionary.querySelector(".label-affix").classList.add("show");
                        fetch("dictionary/Words/ms-MY.json")
                        .then((response) => response.json())
                        .then((data) => {
                            const basicWords = data.filter((item) => item.id == id);
                            let itemElement = document.createElement("li");
                            itemElement.innerHTML = `${basicWords[0].name}`;
                            showDictionary.querySelector(".word-affix").appendChild(itemElement);
                            itemElement.addEventListener("click", () => {
                                window.location.href = `?id=${basicWords[0].id}`;
                            });
                        });
                    });
                }
                if (word.phrase) {
                    word.phrase.forEach((id) => {
                        showDictionary.querySelector(".word-phrase").classList.add("show");
                        showDictionary.querySelector(".label-phrase").classList.add("show");
                        fetch("dictionary/Words/ms-MY.json")
                        .then((response) => response.json())
                        .then((data) => {
                            const basicWords = data.filter((item) => item.id == id);
                            let itemElement = document.createElement("li");
                            itemElement.innerHTML = `${basicWords[0].name}`;
                            showDictionary.querySelector(".word-phrase").appendChild(itemElement);
                            itemElement.addEventListener("click", () => {
                                window.location.href = `?id=${basicWords[0].id}`;
                            });
                        });
                    });
                }
            } else {
                window.location.href = 'index.html';
            }
        });
    } else {
        window.location.href = 'index.html';
    }
});