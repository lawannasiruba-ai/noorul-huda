// ===============================
// NOORUL HUDA - MAIN JAVASCRIPT
// ===============================


// ===============================
// MENU
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const menuButton = document.getElementById("menuButton");
    const menu = document.getElementById("menu");

    if (menuButton && menu) {
        menuButton.addEventListener("click", function () {
            menu.classList.toggle("active");
        });
    }

});


// ===============================
// GENERAL MESSAGE
// ===============================

function message(text) {
    alert(text);
}


// ===============================
// DAILY DUA
// ===============================

function showDua() {
    alert(
        "رَبِّ زِدْنِي عِلْمًا\n\n" +
        "My Lord, increase me in knowledge.\n\n" +
        "Qur'an 20:114"
    );
}


// ===============================
// ISLAMIC CALENDAR
// ===============================

function showIslamicDate() {

    const today = new Date();

    const hijri = new Intl.DateTimeFormat(
        "en-TN-u-ca-islamic",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(today);

    const dateBox = document.getElementById("hijriDate");

    if (dateBox) {
        dateBox.textContent = hijri;
    }
}

showIslamicDate();


// ===============================
// QUR'AN
// ===============================

const surahList = document.getElementById("surahList");
const surahSearch = document.getElementById("surahSearch");


// Load all 114 Surahs

async function loadSurahs() {

    if (!surahList) return;

    surahList.innerHTML = `
        <p class="loading">Loading Qur'an...</p>
    `;

    try {

        const response = await fetch(
            "https://api.alquran.cloud/v1/surah"
        );

        if (!response.ok) {
            throw new Error("Network error");
        }

        const data = await response.json();

        if (data.code !== 200 || !data.data) {
            throw new Error("Qur'an data unavailable");
        }

        displaySurahs(data.data);

    } catch (error) {

        console.log(error);

        surahList.innerHTML = `
            <p class="error">
                Unable to load Qur'an.
                Please check your internet connection.
            </p>
        `;
    }
}


// Display Surahs

function displaySurahs(surahs) {

    if (!surahList) return;

    surahList.innerHTML = "";

    surahs.forEach(function (surah) {

        const card = document.createElement("div");

        card.className = "surah-card";

        card.innerHTML = `
            <span class="surah-number">
                ${surah.number}
            </span>

            <span class="surah-name">
                ${surah.englishName}
                <small>
                    ${surah.englishNameTranslation}
                </small>
            </span>

            <span class="surah-arabic">
                ${surah.name}
            </span>
        `;

        card.addEventListener("click", function () {
            openSurah(surah.number);
        });

        surahList.appendChild(card);

    });
}


// Search Surahs

if (surahSearch) {

    surahSearch.addEventListener("input", async function () {

        const search = this.value.toLowerCase().trim();

        try {

            const response = await fetch(
                "https://api.alquran.cloud/v1/surah"
            );

            const data = await response.json();

            const filtered = data.data.filter(function (surah) {

                return (
                    surah.englishName
                        .toLowerCase()
                        .includes(search) ||

                    surah.englishNameTranslation
                        .toLowerCase()
                        .includes(search) ||

                    surah.name.includes(search)
                );

            });

            displaySurahs(filtered);

        } catch (error) {

            console.log(error);

        }

    });

}


// Open Surah

async function openSurah(number) {

    const quranPage = document.getElementById("quran-page");

    if (!quranPage) return;

    quranPage.innerHTML = `
        <div class="reader">

            <button class="back-btn" onclick="location.reload()">
                ← Back to Surahs
            </button>

            <p class="loading">
                Loading Surah...
            </p>

        </div>
    `;

    try {

        const response = await fetch(
            `https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,en.asad`
        );

        if (!response.ok) {
            throw new Error("Unable to load Surah");
        }

        const data = await response.json();

        const arabic = data.data[0];
        const translation = data.data[1];

        let verses = "";

        arabic.ayahs.forEach(function (ayah, index) {

            verses += `
                <div class="ayah">

                    <div class="ayah-number">
                        ${ayah.numberInSurah}
                    </div>

                    <p class="ayah-arabic">
                        ${ayah.text}
                    </p>

                    <p class="ayah-translation">
                        ${translation.ayahs[index].text}
                    </p>

                </div>
            `;

        });

        quranPage.innerHTML = `

            <div class="reader">

                <button
                    class="back-btn"
                    onclick="location.reload()">
                    ← Back to Surahs
                </button>

                <div class="surah-header">

                    <p class="reader-arabic">
                        ${arabic.name}
                    </p>

                    <h2>
                        ${arabic.englishName}
                    </h2>

                    <p>
                        ${arabic.englishNameTranslation}
                    </p>

                    <small>
                        ${arabic.numberOfAyahs} Ayahs
                    </small>

                </div>

                <div class="ayah-container">
                    ${verses}
                </div>

            </div>
        `;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.log(error);

        quranPage.innerHTML = `
            <div class="reader">

                <button
                    class="back-btn"
                    onclick="location.reload()">
                    ← Back
                </button>

                <p class="error">
                    Unable to load this Surah.
                    Please check your internet connection.
                </p>

            </div>
        `;
    }
}


// Start Qur'an

loadSurahs();


// ===============================
// HADITH SEARCH
// ===============================

const hadithSearch = document.getElementById("hadithSearch");

if (hadithSearch) {

    hadithSearch.addEventListener("input", function () {

        const search = this.value.toLowerCase();

        const cards = document.querySelectorAll(".hadith-card");

        cards.forEach(function (card) {

            const text = card.textContent.toLowerCase();

            if (text.includes(search)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

}


// ===============================
// END
// ===============================