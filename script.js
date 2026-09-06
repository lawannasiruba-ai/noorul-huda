/* ===================================
   NOORUL HUDA JAVASCRIPT
=================================== */


/* ================= MENU ================= */

function toggleMenu() {

  const menu = document.getElementById("menu");

  if (menu) {
    menu.classList.toggle("active");
  }

}


function closeMenu() {

  const menu = document.getElementById("menu");

  if (menu) {
    menu.classList.remove("active");
  }

}


/* ================= ARTICLES ================= */

function readArticle(text) {

  alert(text);

}


/* ================= HIJRI CALENDAR ================= */

function showIslamicDate() {

  const dateBox = document.getElementById("hijriDate");

  if (!dateBox) return;

  try {

    const today = new Date();

    const hijriDate = new Intl.DateTimeFormat(
      "en-TN-u-ca-islamic",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(today);

    dateBox.textContent = hijriDate;

  } catch (error) {

    dateBox.textContent = "Hijri date unavailable";

  }

}


/* ================= QUR'AN ================= */

const surahList =
  document.getElementById("surahList");

const surahSearch =
  document.getElementById("surahSearch");


let allSurahs = [];


/* Load Surahs */

async function loadSurahs() {

  if (!surahList) return;

  surahList.innerHTML =
    '<p class="loading">Loading Qur\'an...</p>';

  try {

    const response = await fetch(
      "https://api.alquran.cloud/v1/surah"
    );

    if (!response.ok) {
      throw new Error("Network error");
    }

    const result = await response.json();

    allSurahs = result.data;

    displaySurahs(allSurahs);

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


/* Display Surahs */

function displaySurahs(surahs) {

  if (!surahList) return;

  surahList.innerHTML = "";

  if (surahs.length === 0) {

    surahList.innerHTML = `
      <p class="loading">
        No Surah found.
      </p>
    `;

    return;
  }


  surahs.forEach(function(surah) {

    const card =
      document.createElement("div");

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


    card.addEventListener(
      "click",
      function() {
        openSurah(surah.number);
      }
    );


    surahList.appendChild(card);

  });

}


/* Search Surah */

if (surahSearch) {

  surahSearch.addEventListener(
    "input",
    function() {

      const search =
        this.value.toLowerCase().trim();


      const filtered =
        allSurahs.filter(function(surah) {

          return (

            surah.englishName
              .toLowerCase()
              .includes(search)

            ||

            surah.englishNameTranslation
              .toLowerCase()
              .includes(search)

            ||

            surah.name.includes(search)

          );

        });


      displaySurahs(filtered);

    }
  );

}


/* Open Surah */

async function openSurah(number) {

  const quranPage =
    document.getElementById("quran-page");

  if (!quranPage) return;


  quranPage.innerHTML = `

    <div class="reader">

      <button
        class="back-btn"
        onclick="location.reload()">

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


    const data =
      await response.json();


    const arabic =
      data.data[0];

    const translation =
      data.data[1];


    let verses = "";


    arabic.ayahs.forEach(
      function(ayah, index) {

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

      }
    );


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


/* ================= HADITH SEARCH ================= */

const hadithSearch =
  document.getElementById("hadithSearch");


if (hadithSearch) {

  hadithSearch.addEventListener(
    "input",
    function() {

      const search =
        this.value.toLowerCase().trim();


      const cards =
        document.querySelectorAll(
          ".hadith-card"
        );


      cards.forEach(function(card) {

        const text =
          card.textContent.toLowerCase();


        if (text.includes(search)) {

          card.style.display = "";

        } else {

          card.style.display = "none";

        }

      });

    }
  );

}


/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    showIslamicDate();

    loadSurahs();

  }
);
// TASBIH COUNTER

let tasbihCount = Number(localStorage.getItem("tasbihCount")) || 0;
let tasbihTarget = Number(localStorage.getItem("tasbihTarget")) || 33;

function updateTasbih() {
  const count = document.getElementById("tasbihCount");
  const target = document.getElementById("tasbihTarget");
  const progress = document.getElementById("tasbihProgress");

  if (!count) return;

  count.textContent = tasbihCount;

  if (target) {
    target.textContent = tasbihTarget;
  }

  if (progress) {
    progress.style.width =
      Math.min((tasbihCount / tasbihTarget) * 100, 100) + "%";
  }
}

function countTasbih() {
  if (tasbihCount < tasbihTarget) {
    tasbihCount++;

    localStorage.setItem("tasbihCount", tasbihCount);

    updateTasbih();

    if (tasbihCount === tasbihTarget) {
      alert("Masha Allah! Ka kai target na " + tasbihTarget);
    }
  }
}

function resetTasbih() {
  tasbihCount = 0;
  localStorage.setItem("tasbihCount", "0");
  updateTasbih();
}

function setTarget(target) {
  tasbihTarget = target;
  localStorage.setItem("tasbihTarget", target);

  if (tasbihCount > target) {
    tasbihCount = 0;
    localStorage.setItem("tasbihCount", "0");
  }

  updateTasbih();
}

document.addEventListener("DOMContentLoaded", function () {
  updateTasbih();
});
const dhikrSelect = document.getElementById("dhikrSelect");
const dhikrName = document.getElementById("dhikrName");

if (dhikrSelect) {
  dhikrSelect.addEventListener("change", function() {
    dhikrName.textContent = this.value;

    tasbihCount = 0;
    document.getElementById("tasbihCount").textContent = "0";
  });
}
// 99 NAMES OF ALLAH

const namesOfAllah = [
  ["الرَّحْمَنُ", "Ar-Rahman", "The Most Merciful"],
  ["الرَّحِيمُ", "Ar-Raheem", "The Especially Merciful"],
  ["الْمَلِكُ", "Al-Malik", "The King"],
  ["الْقُدُّوسُ", "Al-Quddus", "The Most Holy"],
  ["السَّلَامُ", "As-Salam", "The Source of Peace"],
  ["الْمُؤْمِنُ", "Al-Mu'min", "The Giver of Security"],
  ["الْمُهَيْمِنُ", "Al-Muhaymin", "The Guardian"],
  ["الْعَزِيزُ", "Al-Aziz", "The Almighty"],
  ["الْجَبَّارُ", "Al-Jabbar", "The Compeller"],
  ["الْمُتَكَبِّرُ", "Al-Mutakabbir", "The Majestic"],
  ["الْخَالِقُ", "Al-Khaliq", "The Creator"],
  ["الْبَارِئُ", "Al-Bari", "The Originator"],
  ["الْمُصَوِّرُ", "Al-Musawwir", "The Fashioner"],
  ["الْغَفَّارُ", "Al-Ghaffar", "The Constant Forgiver"],
  ["الْقَهَّارُ", "Al-Qahhar", "The Subduer"],
  ["الْوَهَّابُ", "Al-Wahhab", "The Bestower"],
  ["الرَّزَّاقُ", "Ar-Razzaq", "The Provider"],
  ["الْفَتَّاحُ", "Al-Fattah", "The Opener"],
  ["الْعَلِيمُ", "Al-Alim", "The All-Knowing"],
  ["الْقَابِضُ", "Al-Qabid", "The Withholder"],
  ["الْبَاسِطُ", "Al-Basit", "The Expander"],
  ["الْخَافِضُ", "Al-Khafid", "The Reducer"],
  ["الرَّافِعُ", "Ar-Rafi", "The Exalter"],
  ["الْمُعِزُّ", "Al-Mu'izz", "The Honorer"],
  ["المُذِلُّ", "Al-Mudhill", "The Humiliator"],
  ["السَّمِيعُ", "As-Sami", "The All-Hearing"],
  ["الْبَصِيرُ", "Al-Basir", "The All-Seeing"],
  ["الْحَكَمُ", "Al-Hakam", "The Judge"],
  ["الْعَدْلُ", "Al-Adl", "The Utterly Just"],
  ["اللَّطِيفُ", "Al-Latif", "The Gentle"],
  ["الْخَبِيرُ", "Al-Khabir", "The All-Aware"],
  ["الْحَلِيمُ", "Al-Halim", "The Forbearing"],
  ["الْعَظِيمُ", "Al-Azim", "The Magnificent"],
  ["الْغَفُورُ", "Al-Ghafur", "The Forgiving"],
  ["الشَّكُورُ", "Ash-Shakur", "The Appreciative"],
  ["الْعَلِيُّ", "Al-Ali", "The Most High"],
  ["الْكَبِيرُ", "Al-Kabir", "The Most Great"],
  ["الْحَفِيظُ", "Al-Hafiz", "The Preserver"],
  ["الْمُقِيتُ", "Al-Muqit", "The Sustainer"],
  ["الْحَسِيبُ", "Al-Hasib", "The Reckoner"],
  ["الْجَلِيلُ", "Al-Jalil", "The Majestic"],
  ["الْكَرِيمُ", "Al-Karim", "The Generous"],
  ["الرَّقِيبُ", "Ar-Raqib", "The Watchful"],
  ["الْمُجِيبُ", "Al-Mujib", "The Responsive"],
  ["الْوَاسِعُ", "Al-Wasi", "The All-Encompassing"],
  ["الْحَكِيمُ", "Al-Hakim", "The Wise"],
  ["الْوَدُودُ", "Al-Wadud", "The Loving"],
  ["الْمَجِيدُ", "Al-Majid", "The Glorious"],
  ["الْبَاعِثُ", "Al-Ba'ith", "The Resurrector"],
  ["الشَّهِيدُ", "Ash-Shahid", "The Witness"],
  ["الْحَقُّ", "Al-Haqq", "The Truth"],
  ["الْوَكِيلُ", "Al-Wakil", "The Trustee"],
  ["الْقَوِيُّ", "Al-Qawiyy", "The Strong"],
  ["الْمَتِينُ", "Al-Matin", "The Firm"],
  ["الْوَلِيُّ", "Al-Wali", "The Protecting Friend"],
  ["الْحَمِيدُ", "Al-Hamid", "The Praiseworthy"],
  ["الْمُحْصِي", "Al-Muhsi", "The Counter"],
  ["الْمُبْدِئُ", "Al-Mubdi", "The Originator"],
  ["الْمُعِيدُ", "Al-Mu'id", "The Restorer"],
  ["الْمُحْيِي", "Al-Muhyi", "The Giver of Life"],
  ["الْمُمِيتُ", "Al-Mumit", "The Bringer of Death"],
  ["الْحَيُّ", "Al-Hayy", "The Ever-Living"],
  ["الْقَيُّومُ", "Al-Qayyum", "The Sustainer"],
  ["الْوَاجِدُ", "Al-Wajid", "The Finder"],
  ["الْمَاجِدُ", "Al-Majid", "The Noble"],
  ["الْوَاحِدُ", "Al-Wahid", "The One"],
  ["الْأَحَدُ", "Al-Ahad", "The Unique"],
  ["الصَّمَدُ", "As-Samad", "The Eternal Refuge"],
  ["الْقَادِرُ", "Al-Qadir", "The Capable"],
  ["الْمُقْتَدِرُ", "Al-Muqtadir", "The Powerful"],
  ["الْمُقَدِّمُ", "Al-Muqaddim", "The Expediter"],
  ["الْمُؤَخِّرُ", "Al-Mu'akhkhir", "The Delayer"],
  ["الْأَوَّلُ", "Al-Awwal", "The First"],
  ["الْآخِرُ", "Al-Akhir", "The Last"],
  ["الظَّاهِرُ", "Az-Zahir", "The Manifest"],
  ["الْبَاطِنُ", "Al-Batin", "The Hidden"],
  ["الْوَالِي", "Al-Wali", "The Governor"],
  ["الْمُتَعَالِي", "Al-Muta'ali", "The Most Exalted"],
  ["الْبَرُّ", "Al-Barr", "The Source of Goodness"],
  ["التَّوَابُ", "At-Tawwab", "The Accepter of Repentance"],
  ["الْمُنْتَقِمُ", "Al-Muntaqim", "The Avenger"],
  ["الْعَفُوُّ", "Al-Afuww", "The Pardoner"],
  ["الرَّؤُوفُ", "Ar-Ra'uf", "The Compassionate"],
  ["مَالِكُ الْمُلْكِ", "Malik-ul-Mulk", "Owner of Sovereignty"],
  ["ذُو الْجَلَالِ وَالْإِكْرَامِ", "Dhul-Jalali wal-Ikram", "Lord of Majesty and Honor"],
  ["الْمُقْسِطُ", "Al-Muqsit", "The Equitable"],
  ["الْجَامِعُ", "Al-Jami", "The Gatherer"],
  ["الْغَنِيُّ", "Al-Ghani", "The Self-Sufficient"],
  ["الْمُغْنِي", "Al-Mughni", "The Enricher"],
  ["الْمَانِعُ", "Al-Mani", "The Preventer"],
  ["الضَّارُّ", "Ad-Darr", "The Distresser"],
  ["النَّافِعُ", "An-Nafi", "The Benefactor"],
  ["النُّورُ", "An-Nur", "The Light"],
  ["الْهَادِي", "Al-Hadi", "The Guide"],
  ["الْبَدِيعُ", "Al-Badi", "The Incomparable Originator"],
  ["الْبَاقِي", "Al-Baqi", "The Everlasting"],
  ["الْوَارِثُ", "Al-Warith", "The Inheritor"],
  ["الرَّشِيدُ", "Ar-Rashid", "The Guide to the Right Path"],
  ["الصَّبُورُ", "As-Sabur", "The Patient"]
];

const namesGrid = document.getElementById("namesGrid");
const namesSearch = document.getElementById("namesSearch");

function displayNames(list) {
  if (!namesGrid) return;

  namesGrid.innerHTML = "";

  list.forEach((name, index) => {
    namesGrid.innerHTML += `
      <div class="name-card">
        <div class="name-number">${index + 1}</div>
        <div class="name-arabic">${name[0]}</div>
        <div class="name-english">${name[1]}</div>
        <div class="name-meaning">${name[2]}</div>
      </div>
    `;
  });
}

if (namesGrid) {
  displayNames(namesOfAllah);
}

if (namesSearch) {
  namesSearch.addEventListener("input", function () {
    const search = this.value.toLowerCase().trim();

    const filtered = namesOfAllah.filter(name =>
      name[0].includes(search) ||
      name[1].toLowerCase().includes(search) ||
      name[2].toLowerCase().includes(search)
    );

    displayNames(filtered);
  });
}
document.querySelectorAll(".bottom-nav a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();

    // Nuna Home
    document.querySelector("#home").scrollIntoView({
      behavior: "smooth"
    });
  });
});
document.querySelectorAll(".bottom-nav a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});