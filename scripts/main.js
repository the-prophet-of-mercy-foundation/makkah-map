const TOOL_CONFIG = {
    kabah: {
        label: "Kabah",
        src: "assets/images/kaabah.png",
        width: 34,
        height: 34,
        single: true,
    },
    well: {
        label: "Wells",
        src: "assets/images/water-well.png",
        width: 34,
        height: 34,
    },
    market: {
        label: "Markets",
        src: "assets/images/market.png",
        width: 34,
        height: 34,
    },
    shoemaker: {
        label: "Shoemaker",
        src: "assets/images/shoemaker.png",
        width: 34,
        height: 34,
    },
    blacksmith: {
        label: "Blacksmith",
        src: "assets/images/blacksmith.png",
        width: 34,
        height: 34,
    },
    butcher: {
        label: "Butchers",
        src: "assets/images/butcher.png",
        width: 34,
        height: 34,
    },
};

const STORAGE_KEY = "interactive-map-markers-menu-v7";
const MEMORY_KEY = STORAGE_KEY + ":memory";

function keyFor(type, meta = {}) {
    if (type === "market" && meta.marketName) return `market::${meta.marketName}`;
    if (type === "well" && meta.wellName) return `well::${meta.wellName}`;
    return type;
}

function loadMemory() {
    try {
        return JSON.parse(localStorage.getItem(MEMORY_KEY) || "{}");
    } catch {
        return {};
    }
}

function saveMemory(mem) {
    try {
        localStorage.setItem(MEMORY_KEY, JSON.stringify(mem));
    } catch {
    }
}

let placementMemory = loadMemory();

const container = document.getElementById("map-container");
const clearBtn = document.getElementById("clearAll");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const savedToast = document.getElementById("saved");

let activeTool = null,
    activeMarketName = null,
    activeWellName = null;

// Modal
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

function openModal(title, html) {
    modalTitle.textContent = title || "";
    modalBody.innerHTML = html || "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}

modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});
modalClose.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

// Descriptions registry (add more as needed)
const DESC = {
    "zuqaq al nar": {
        title: "Zuqāq al-Nār (South)",
        html: `<p>This “nightlife” area in Makkah’s south was where the pagans of Makkah gathered to drink alcohol and commit other sins during the pre‑Islamic Age of Ignorance.</p>`,
    },
    "kathib (kayd) market": {
        title: "Kathīb (Kayd) Market",
        html: `<p>This small market was described as being at the base of Mt. Kayd (AKA: Mayghah and later Khalīfah), between Mawqif al-Baqar and a small property that belonged to a man named al-Ḥārith.</p>`,
    },
    "mawqif al baqar": {
        title: "Mawqif al-Baqar",
        html: `
      <p>Mawqif al-Baqar literally means “Cow Stand, Station, or Stop,” but may linguistically also refer to a cow lot or pen. It appears from the name that this landmark in Lower Makkah was a place where cows were sold. We also know that cows were among the sacrificial animals familiar to the residents of Makkah during the pre‑Islamic Age of Ignorance. Cattle had already been known in Arabia for many centuries, as evidenced by ancient depictions of domesticated cattle on rocks across Arabia, some of which date back to before 1000 BCE.</p>
    `,
    },
    "abu bakr's shop": {
        title: "Abu Bakr’s Shop",
        html: `
      <p>This location is identified in sources as a shop associated with Abu Bakr. In the commercial fabric of Lower Makkah, small shops like this stood near prominent markets and thoroughfares, serving residents and pilgrims with everyday goods and trade.</p>
    `,
    },
    "the layl (night) market": {
        title: "The Layl (“Night”) Market",
        html: `
      <p>This was a narrow market sandwiched between a number of residential properties, with most of its shops running along the sides of the main “Belly of the Valley” flood path, and some shops actually situated on the path itself. After the time of the Prophet ﷺ, the market grew exponentially as it expanded northward along the main flood path.</p>
    `,
    },
    "attarin (perfume shops)": {
        title: "‘Attārīn (Perfume Shops)",
        html: `
      <p>Makkah’s perfume shops during the time of Prophet Muḥammad ﷺ were concentrated on the property of Azhar (RA) b. ‘Abd ‘Awf of Banī Zuhrah, next to Zuqāq al-‘Attārīn, a path that acquired its name due to the presence of these shops. Another cluster of perfume shops was located close by, but across the path of Mas‘ā from Dār Azhar b. ‘Abd ‘Awf.</p>
    `,
    },
    "slave market": {
        title: "Slave Market",
        html: `
      <p>This was a seasonal market that sprang up within the Layl Market, on a small corner of land that fell on Dār al-‘Abbās b. ‘Abd al-Muṭṭalib, at the point where the path of Mas‘ā intersected with the main “Belly of the Valley” flood path.</p>
    `,
    },
    "bayt al azlam (house of divination)": {
        title: "Bayt al-Azlām (“The House of Divination”)",
        html: `
      <p>This was a place where the polytheists of Makkah would go during the pre‑Islamic Age of Ignorance to consult with mystics and soothsayers for help in deciding various issues.</p>
    `,
    },
    "qaraz (qurt) shops": {
        title: "Qaraz (Qurt) Shops",
        html: `
      <p>These shops at the southern end of the Hazwarah Market sold either qurt or qaraz (or both) near the hill known as Qarn al-Qurt. Both products consisted of extracts and other components from two types of Acacia trees.</p>
    `,
    },
    "the hazwarah market": {
        title: "The Ḥazwarah Market",
        html: `
      <p>This was the largest and most famous market inside the Valley of Makkah, where various types of merchandise, including fine fabrics, water and food containers, leather, pottery, jewelry, dates, grains, various oils, perfumes, and most other household or personal items, were sold. The Ḥazwarah Market was a popular gathering place where people would shop, but also go merely “to see and be seen.”</p>
    `,
    },
    "gold and silver shops": {
        title: "Gold & Silver Shops",
        html: `
      <p>These shops were described as being on the portion of Dār Ḥuzābah that later belonged to the family of a man named Ghazwān al-Jandī. The shops were also described as places where (gold) dīnār(s) and (silver) dirham(s) were minted, but this must have been after the time of Prophet Muḥammad ﷺ and the establishment of proper Islamic dīnār(s) and dirham(s). Prior to this, such shops would have simply sold gold and silver and checked the authentic values of foreign currencies, mostly from the Roman and Persian empires.</p>
    `,
    },
    "milk shops": {
        title: "Milk Shops",
        html: `
      <p>Several milk shops were located in this area right next to Dār Ḥuzābah, which was next to the path known as al-Ḥizāmiyyah and overlooked the main “Belly of the Valley” flood path.</p>
    `,
    },
    "khayyatin (tailors)": {
        title: "Khayyāṭīn (Tailors)",
        html: `
      <p>This area, which was part of the larger and more vibrant Ḥazwarah Market, housed the shops of the khayyāṭīn (tailors), and was explicitly described in various narrations as being directly “behind” Dār Umm Hānī’ (RA), starting in the area of her backyard.</p>
    `,
    },
    "poultry market": {
        title: "Poultry Market",
        html: `
      <p>This small market was located along a segment of the Qu‘ayqān Flood Path, within the area where the Banī Qays b. ‘Adī subclan of Bani Sahm had its homes, and is where small shops selling chickens and doves were located.</p>
    `,
    },
    "grain shops": {
        title: "Grain Shops (Hannatin)",
        html: `
    <figure style="margin:0 0 12px 0;">
      <img
        src="assets/images/grain-shops.png"
        alt="Grain shops market scene"
        style="width:100%;height:auto;border-radius:8px;display:block;"
        loading="lazy"
      />
    </figure>
    <p>These shops specialized in staple grains for residents and travelers, with sacks and measures arranged beneath shade canopies along the market path.</p>
  `,
    },
    blacksmith: {
        title: "Blacksmiths",
        html: `
    <figure style="margin:0 0 12px 0;">
      <img
   
        src="assets/images/blacksmiths.png"
        alt="Blacksmiths area and stalls"
        style="width:100%;height:auto;border-radius:8px;display:block;"
        loading="lazy"
      />
    </figure>
    <p>Ironworking stalls equipped with bellows, anvils, hammers, and quenching basins produced tools, fittings, and arms for residents, caravans, and neighboring markets.</p>
  `,
    },
    "sheep market": {
        title: "Sheep Market",
        html: `
    <figure style="margin:0 0 12px 0;">
      <img
   
        src="assets/images/sheep-market.png"
        alt="Sheep market with moutains in background"
        style="width:100%;height:auto;border-radius:8px;display:block;"
        loading="lazy"
      />
    </figure>
  `,
    },
    shoemaker: {
        title: "Shoemakers",
        html: `
          <figure style="margin:0 0 12px 0;">
            <img src="assets/images/Shoemakers.png"
                 alt="Shoemaker stalls and cobblers at work"
                 style="width:100%;height:auto;border-radius:8px;display:block;"
                 loading="lazy"/>
          </figure>
          <p>Leather-working booths crafting and repairing sandals and footwear for locals and pilgrims, with benches, lasts, and awls visible at the counters.</p>
        `,
    },

    butcher: {
        title: "Butchers",
        html: `
        <figure style="margin:0 0 12px 0;">
          <img
            src="assets/images/Butchers.png"
            alt="Butcher market row with hanging cuts"
            style="width:100%;height:auto;border-radius:8px;display:block;"
            loading="lazy"
          />
        </figure>
        <p>Open-air meat stalls where animals were brought, dressed, and sold, with hanging cuts and scales arranged under shaded canopies.</p>
      `,
    },
    "upper (khumm) well": {
        title: "Upper (Khumm) Well",
        html: `
    <p>This well was initially dug by Qusayy b. Kilāb and later re‑excavated by his grandson ‘Abd Shams b. ‘Abd Manāf b. Qusayy. Within a few generations, however, the well apparently again fell into a state of disrepair, most likely due to the effects of flash floods that regularly ravaged the area, and so Jubayr (RA) b. Muṭ‘im b. ‘Adī (“the Elder”) b. Nawfal b. ‘Abd Manāf b. Qusayy b. Kilāb performed a major re‑excavation of the well during his time.</p>
  `,
    },
    "aluq well": {
        title: "‘Aluq Well",
        html: `
    <p>This well, the name of which appears in some sources as “al‑Ghalūq,” belonged to the Banī ‘Abd Shams clan of the Quraysh.</p>
  `,
    },
    "badhdhar well": {
        title: "Badhdhar Well",
        html: `
    <p>This well was dug by Hāshim b. ‘Abd Manāf b. Quṣayy b. Kilāb, and he is the one who named it Badhdhar, which also appears in some sources as Nadhdhar and Baddar. Some narrations, however, said that the well was originally excavated by Quṣayy b. Kilāb, which may mean that Hāshim only re‑excavated it.</p>
  `,
    },
    "tawa well": {
        title: "Ṭawá Well",
        html: `
    <p>The Ṭawá Well was originally dug by ‘Abd Shams b. ‘Abd Manāf b. Quṣayy b. Kilāb and then later re‑dug and excavated by ‘Aqīl (RA) b. Abī Ṭālib sometime after ‘Abd al‑Muṭṭalib’s re‑excavation of Zamzam, but before the advent of Prophet Muḥammad’s prophethood ﷺ.</p>
  `,
    },
    "huwaytib well": {
        title: "Ḥuwayṭib Well",
        html: `
    <p>This well belonged to Ḥuwayṭib (RA) b. ‘Abd al‑‘Uzzá, and was located on the eastern perimeter of his property, on the side that faced the main “Belly of the Valley” flood path, such that the well was situated on the path itself. It was among the few wells in Makkah dug after ‘Abd al‑Muṭṭalib’s re‑excavation of Zamzam, yet before the first revelations of the Qur’ān and the advent of Prophet Muḥammad’s prophethood ﷺ.</p>
  `,
    },
    "ajyad well": {
        title: "Ajyād Well",
        html: `
    <p>The Ajyād Well was among the few wells dug in Makkah in the period after the well of Zamzam was excavated by ‘Abd al‑Muṭṭalib, but before the first revelations of the Qur’ān and the advent of Prophet Muḥammad’s prophethood ﷺ. It was located in the Lesser Ajyād Valley, on the property of Zuhayr b. Abī Umayyah b. al‑Mughīrah of Banī Makhzūm.</p>
  `,
    },
    "rumm well": {
        title: "Rumm Well",
        html: `
    <p>The Rumm Well was another well originally excavated by ‘Abd Shams b. ‘Abd Manāf, and was located on a property in Upper Makkah that was later purchased by the wealthy Khadījah (RA) bt. Khuwaylid, granting her ownership of one of the few properties in Makkah with its own private well.</p>
  `,
    },
    "sajlah well": {
        title: "Sajlah Well",
        html: `
    <p>This well on the Mas‘á Path was situated directly in front of Dār Jubayr b. Muṭ‘im and was also part of his property. Originally dug by Hāshim b. ‘Abd Manāf b. Quṣayy b. Kilāb, it later belonged to Jubayr’s father, Muṭ‘im b. ‘Adī b. Nawfal b. ‘Abd Manāf b. Quṣayy b. Kilāb, and then to Jubayr (RA), and as such was also known as the Well of Jubayr ibn Muṭ‘im.</p>
  `,
    },
    "umm jalan well": {
        title: "Umm Ja‘lān Well",
        html: `
    <p>The Well of Umm Ja‘lān was among the wells that belonged to the Banī ‘Abd Shams clan of the Quraysh.</p>
  `,
    },
    "al suwayqah well": {
        title: "Al‑Suwayqah Well",
        html: `
    <p>This well, which belonged to the Banī Sahm clan of the Quraysh, was not officially named the Well of al‑Suwayqah, but was instead described as “the well in al‑Suwayqah” and was also explicitly described as being on the property of Abū al‑A‘war al‑Sulamī, which was in the area of al‑Suwayqah. It is very likely that this well was the Banī Sahm Well of al‑Ghamr, the location of which was not specified in early sources.</p>
  `,
    },
    "al jafr well": {
        title: "Al‑Jafr Well",
        html: `
    <p>The al‑Jafr Well was dug by Umayyah b. ‘Abd Shams, and was near the entrance to the Greater Ajyād Valley, right in front of what later became the homes of Banī ‘Abd Allāh b. ‘Ikrimah b. Khālid b. ‘Ikrimah b. Khālid (RA) b. al‑‘Āṣ b. Hishām b. al‑Mughīrah of Banī Makhzūm. This al‑Jafr Well should not be confused with an earlier Jafr Well that was dug outside of Makkah by Kilāb b. Murrah prior to the Quraysh taking control over Makkah from the tribe of Khuzā‘ah under the leadership of Kilāb’s son (Quṣayy b. Kilāb).</p>
  `,
    },
    "al thurayya (hafir) well": {
        title: "Al‑Thurayyā (Ḥafīr) Well",
        html: `
    <p>The al‑Thurayyā Well was dug by the Banī Taym clan of the Quraysh and also became known as the Well of ‘Abd Allāh ibn Jud‘ān due to the fact that it was located on his property. The same well was also called “al‑Ḥafīr,” a term that means a well that is wide or “oversized,” and was referred to as such in a poem in which the well was metaphorically described by the clan as a “deep, raging ocean” to boast about it being a very reliable and plentiful source of water.</p>
  `,
    },
    "sunbulah (ubayy) well": {
        title: "Sunbulah (Ubayy) Well",
        html: `<p>The Well of Sunbulah was excavated by Khalaf b. Wahb of Banī Jumah, and later became known as the Ubayy Well when his son Ubayy b. Khalaf inherited the portion of his property on which the well was located. The well, which was situated in front of Ubayy’s inherited property, was further described as being on the side of his property that faced the path of al‑Ḥizāmiyyah, across the path from Dār al‑Zubayr b. al‑‘Awwām, which it was also in front of.</p>`,
    },
    "umm hardan well": {
        title: "Umm Ḥardān Well",
        html: `
<p>While it is not known who originally dug this well, it became a possession of the Banī Jumah clan of the Quraysh, and was situated next to the Banī Qurād Dam (AKA: The Banī Jumah Dam) that ‘Abd al‑Malik b. Marwān later built during his reign as caliph (65–86 AH).</p>
`,
    },
    "al aswad well": {
        title: "Al‑Aswad Well (Shufayyah)",
        html: `
<p>This well belonged to the Banī Asad b. ‘Abd al‑‘Uzzā clan of the Quraysh, and was re‑excavated or renovated after Zamzam was excavated by ‘Abd al‑Muṭṭalib, but before the first revelations of the Qur’ān and the advent of Prophet Muḥammad’s prophethood ﷺ. The well was known as the al‑Aswad Well for two reasons. The first is that it was dug by al‑Aswad b. al‑Muṭṭalib b. Asad b. ‘Abd al‑‘Uzzā, and the second is because its location was on the property that al‑Aswad b. Abī al‑Bakhtarī b. Hāshim b. al‑Ḥārith b. Asad b. ‘Abd al‑‘Uzzā inherited from his father.</p>
`,
    },
    "ajul well": {
        title: "‘Ajūl Well",
        html: `
<p>The ‘Ajūl Well was a famous well located on the property of Umm Hānī’ (RA) bt. Abī Ṭālib, which had once belonged to Quṣayy b. Kilāb, who also excavated the well after he took over Makkah and united the Quraysh several generations before the time of Prophet Muḥammad ﷺ. The well eventually disappeared during expansions to al‑Masjid al‑Ḥarām undertaken by Caliph al‑Mahdī in 167 AH, when both the well and Dār Umm Hānī’ were absorbed into the area of the expanded mosque.</p>
`,
    },
    "ramram (maramram) well": {
        title: "Ramram (Maramram) Well",
        html: `
<p>Ramram was a Banī Sahm well that ceased to exist after being absorbed into the area of the mosque during expansions to al‑Masjid al‑Ḥarām undertaken by the ‘Abbāsid caliph Abū Ja‘far al‑Manṣūr in the years 137 to 140 AH, which took over some of the areas in which the Banī Sahm clan of the Quraysh had its homes (just west of the Ka‘bah).</p>
`,
    },
    "zam zam well": {
        title: "Zamzam Well",
        html: `
        <figure style="margin:0 0 12px 0;">
          <img
            src="assets/images/zamzam.png"
            alt="Zamzam well and surrounding area"
            style="width:100%;height:auto;border-radius:8px;display:block;"
            loading="lazy"
          />
        </figure>
<p>Makkah’s most plentiful well dates back to the time of Prophet Ismā‘īl (PBUH), when his distressed mother (Hājar) ran up and down the valley between the hills of Ṣafā and Marwah in search of relief for her thirsty and dehydrated infant, whereupon the Angel Jibrīl (Gabriel) (AS) descended to reveal the waters of Zamzam.</p> <p>The famous Well of Zamzam later ran dry during the final period of Jurhumite rule over Makkah, which lasted for centuries after the time of Ismā‘īl (PBUH), and it was thus buried and forgotten. This remained the case until it was re‑excavated by the Prophet’s grandfather, ‘Abd al‑Muṭṭalib b. Hāshim.</p> <p>Once Zamzam was uncovered by ‘Abd al‑Muṭṭalib, it became the primary source of water for al‑siqāyah (providing pilgrims to Makkah with water), and two animal hide basins were placed on either side of the well and filled primarily with its water for convenience. The one on the side closest to the Ka‘bah was used for drinking, while the one on the opposite side of the well was for washing.</p>
`,
    },

    // Add wells and other tools here as needed, with keys matching lowercased labels
};

function normName(s) {
    return (s || "").toString().trim().toLowerCase();
}

function filterMarkers() {
    // Get active tools
    const activeTools = Array.from(
        document.querySelectorAll('#toolSidebar .tool-icon.active')
    ).map((el) => el.dataset.tool);

    // Show/hide markers
    document.querySelectorAll(".marker").forEach((marker) => {
        const type = marker.dataset.type;
        marker.style.display = activeTools.includes(type) ? "" : "none";
    });
}

// Attach event listeners to toolbar icons
document.querySelectorAll('#toolSidebar .tool-icon').forEach((icon) => {
    icon.addEventListener("click", () => {
        icon.classList.toggle("active"); // toggle highlight
        filterMarkers();
    });
});

// Initial filter (all active by default)
document.querySelectorAll('#toolSidebar .tool-icon').forEach((icon) =>
    icon.classList.add("active")
);
filterMarkers();


// Map click disabled
container.addEventListener("pointerdown", () => {
});

// Utilities
clearBtn.addEventListener("click", () => {
    container.querySelectorAll(".marker").forEach((m) => m.remove());
    saveMarkers();
});
exportBtn.addEventListener("click", () => {
    const data = readMarkers();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "map-markers.json";
    a.click();
    URL.revokeObjectURL(url);
});
importBtn.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        loadMarkers(data);
        saveMarkers();
    } catch {
        alert("Invalid JSON");
    } finally {
        importFile.value = "";
    }
});

function resetSelections() {
    activeTool = null;
    activeMarketName = null;
    activeWellName = null;
    document
        .querySelectorAll(".tool[data-tool]")
        .forEach((t) => t.classList.remove("active"));
    wellsList?.querySelectorAll(".subitem").forEach((mi) => mi.classList.remove("active"));
    marketsList?.querySelectorAll(".subitem").forEach((mi) => mi.classList.remove("active"));
}

function markerExists(type, meta = {}) {
    if (type === "market" && meta.marketName)
        return !!container.querySelector(
            `.marker[data-type="market"][data-market="${meta.marketName}"]`
        );
    if (type === "well" && meta.wellName)
        return !!container.querySelector(
            `.marker[data-type="well"][data-well="${meta.wellName}"]`
        );
    return !!container.querySelector(`.marker[data-type="${type}"]`);
}

function createMarker(type, xPct, yPct, meta = {}) {
    const cfg = TOOL_CONFIG[type];

    // Outer marker container
    const wrapper = document.createElement("div");
    wrapper.className = "marker";
    wrapper.dataset.type = type;

    // Inner circular icon container
    const iconContainer = document.createElement("div");
    iconContainer.className = "icon-container";

    // Actual icon image
    const img = document.createElement("img");
    img.src = cfg.src;
    img.alt = type;
    img.className = "icon";

    iconContainer.appendChild(img);
    wrapper.appendChild(iconContainer);

    let hoverLabel = cfg.label;
    if (type === "market" && meta.marketName) {
        wrapper.dataset.market = meta.marketName;
        hoverLabel = meta.marketName;
    }
    if (type === "well" && meta.wellName) {
        wrapper.dataset.well = meta.wellName;
        hoverLabel = meta.wellName;
    }
    wrapper.title = hoverLabel;

    wrapper.dataset.x = +xPct.toFixed(4);
    wrapper.dataset.y = +yPct.toFixed(4);
    wrapper.style.left = wrapper.dataset.x + "%";
    wrapper.style.top = wrapper.dataset.y + "%";

    // Click -> modal
    wrapper.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const key =
            wrapper.dataset.type === "market"
                ? normName(wrapper.dataset.market || "")
                : wrapper.dataset.type === "well"
                    ? normName(wrapper.dataset.well || "")
                    : normName(wrapper.dataset.type || "");
        const info = DESC[key];
        if (info) openModal(info.title || wrapper.title, info.html || "");
    });

    const memKey = keyFor(type, {
        marketName: wrapper.dataset.market,
        wellName: wrapper.dataset.well,
    });
    placementMemory[memKey] = {
        type,
        x: wrapper.dataset.x,
        y: wrapper.dataset.y,
        marketName: wrapper.dataset.market || null,
        wellName: wrapper.dataset.well || null,
    };
    saveMemory(placementMemory);

    return wrapper;
}

function readMarkers() {
    const out = [];
    container.querySelectorAll(".marker").forEach((m) => {
        out.push({
            type: m.dataset.type,
            marketName: m.dataset.market || null,
            wellName: m.dataset.well || null,
            x: parseFloat(m.dataset.x),
            y: parseFloat(m.dataset.y),
            src: m.querySelector("img")?.getAttribute("src"),
            title: m.title,
        });
    });
    return out;
}

function saveMarkers() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(readMarkers()));
        showSavedToast();
    } catch {
        console.warn("Save failed.");
    }
}

function showSavedToast() {
    const t = document.getElementById("saved");
    t.classList.add("show");
    clearTimeout(showSavedToast._t);
    showSavedToast._t = setTimeout(() => t.classList.remove("show"), 600);
}

function loadMarkers(data = null) {
    container.querySelectorAll(".marker").forEach((m) => m.remove());
    if (!data) {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        try {
            data = JSON.parse(raw);
        } catch {
            return;
        }
    }
    for (const item of data) {
        if (
            item.type === "kabah" &&
            container.querySelector('.marker[data-type="kabah"]')
        )
            continue;
        const el = createMarker(item.type, item.x, item.y, {
            marketName: item.marketName || null,
            wellName: item.wellName || null,
        });
        if (item.title) el.title = item.title;
        container.appendChild(el);
    }
    placementMemory = {};
    container.querySelectorAll(".marker").forEach((m) => {
        const type = m.dataset.type,
            marketName = m.dataset.market || null,
            wellName = m.dataset.well || null;
        const k = keyFor(type, {marketName, wellName});
        placementMemory[k] = {
            type,
            x: m.dataset.x,
            y: m.dataset.y,
            marketName,
            wellName,
        };
    });
    saveMemory(placementMemory);
}

loadMarkers();
