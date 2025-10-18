// --- Interactive coordinate picker for modern-makkah.html ---
// document.addEventListener("DOMContentLoaded", () => {
//   const baseMap = document.getElementById("base-map");
//   if (baseMap) {
//     baseMap.addEventListener("click", function (e) {
//       const rect = baseMap.getBoundingClientRect();
//       const x = ((e.clientX - rect.left) / rect.width) * baseMap.naturalWidth;
//       const y = ((e.clientY - rect.top) / rect.height) * baseMap.naturalHeight;
//       alert(`X: ${x.toFixed(0)}, Y: ${y.toFixed(0)}`);
//     });
//   }
// });
// document.addEventListener("DOMContentLoaded", () => {
//   const mapContainer = document.getElementById("map-container");
//   const sidebar = document.getElementById("toolSidebar");

//   // Numbers and corresponding image filenames
//   const items = [
//     { num: 1, img: "assets/images/qabeelah1.png", name: "Bani Hashim" },
//     { num: 4, img: "assets/images/qabeelah4.png", name: "Bani Abd Shams" },
//     { num: 7, img: "assets/images/qabeelah7.png", name: "Bani Adi" },
//     { num: 11, img: "assets/images/qabeelah11.png", name: "Bani Makhzum" },
//     { num: 14, img: "assets/images/qabeelah14.png", name: "Bani Taym" },
//   ];

//   // Clear sidebar
//   sidebar.innerHTML = "";

//   items.forEach(({ num, img, name }) => {
//     // Create label and checkbox
//     const label = document.createElement("label");
//     label.className = "tool-checkbox";
//     const checkbox = document.createElement("input");
//     checkbox.type = "checkbox";
//     checkbox.id = `chkQabeelah${num}`;
//     checkbox.dataset.qabeelah = num;

//     const span = document.createElement("span");
//     span.textContent = num + " - " + name;

//     label.appendChild(checkbox);
//     label.appendChild(span);
//     sidebar.appendChild(label);

//     // Add image on map when checked
//     checkbox.addEventListener("change", () => {
//       const existing = mapContainer.querySelector(
//         `.qabeelah-img[data-num="${num}"]`
//       );
//       if (checkbox.checked) {
//         if (!existing) {
//           const imgEl = document.createElement("img");
//           imgEl.src = img;
//           imgEl.alt = `Qabeelah ${num}`;
//           imgEl.className = "qabeelah-img";
//           imgEl.dataset.num = num;
//           mapContainer.appendChild(imgEl);
//         }
//       } else {
//         if (existing) existing.remove();
//       }
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.getElementById("map-container");
  const sidebar = document.getElementById("toolSidebar");
  const baseMap = document.getElementById("base-map");

  // items: full-screen image + multiple point overlays (random example coordinates)
  const items = [
    {
      num: 1,
      img: "assets/images/qabeelah1.png",
      name: "Bani Hashim",
      overlays: [
        {
          src: "assets/images/desert-house.png",
          title: "Abu Talib's House",
          xPercent: 0.495,
          yPercent: 0.799,
          w: 28,
          h: 28,
        },
        {
          src: "assets/images/desert-house.png",
          title: "Prophet's Birthplace (PBUH)",
          xPercent: 0.53,
          yPercent: 0.75,
          w: 28,
          h: 28,
        },
        {
          src: "assets/images/desert-house.png",
          title: "Abu Lahab's House",
          xPercent: 0.635,
          yPercent: 0.788,
          w: 28,
          h: 28,
        },
        {
          src: "assets/images/market.png",
          title: "Abu Bakr Siddique (RA)'s Shop",
          xPercent: 0.469,
          yPercent: 0.556,
          w: 35,
          h: 35,
        },
      ],
    },
    {
      num: 4,
      img: "assets/images/qabeelah4.png",
      name: "Bani Abd Shams",
      overlays: [
        {
          src: "assets/images/desert-house.png",
          title: "Usman (RA)'s House",
          xPercent: 0.582,
          yPercent: 0.613,
          w: 28,
          h: 28,
        },
        {
          src: "assets/images/desert-house.png",
          title: "Abu Sufyan bin Harb (RA)'s House",
          xPercent: 0.529,
          yPercent: 0.516,
          w: 28,
          h: 28,
        },
        {
          src: "assets/images/mountain.png",
          title: "Mount Marwah",
          xPercent: 0.39,
          yPercent: 0.525,
          w: 35,
          h: 35,
        },
        {
          src: "assets/images/mountain.png",
          title: "Mount Safa",
          xPercent: 0.535,
          yPercent: 0.461,
          w: 35,
          h: 35,
        },
      ],
    },
    {
      num: 7,
      img: "assets/images/qabeelah7.png",
      name: "Bani Adi",
      overlays: [
        {
          src: "assets/images/desert-house.png",
          title: "Umar bin al-khattab (RA)'s House",
          xPercent: 0.295,
          yPercent: 0.11,
          w: 28,
          h: 28,
        },
        {
          src: "assets/images/desert-house.png",
          title: "Zayd bin al-Khattab (RA)'s House",
          xPercent: 0.367,
          yPercent: 0.103,
          w: 28,
          h: 28,
        },
        {
          src: "assets/images/mountain.png",
          title: "Mount Umar",
          xPercent: 0.327,
          yPercent: 0.03,
          w: 35,
          h: 35,
        },
      ],
    },
    {
      num: 11,
      img: "assets/images/qabeelah11.png",
      name: "Bani Makhzum",
      overlays: [
        {
          src: "assets/images/desert-house.png",
          title: "Abu Jahl's House",
          xPercent: 0.305,
          yPercent: 0.633,
          w: 28,
          h: 28,
        },
        {
          src: "assets/images/valley.png",
          title: "Lesser Ajyad Valley",
          xPercent: 0.278,
          yPercent: 0.903,
          w: 28,
          h: 28,
        },
        {
          src: "assets/images/valley.png",
          title: "Greater Ajyad Valley",
          xPercent: 0.167,
          yPercent: 0.75,
          w: 28,
          h: 28,
        },
      ],
    },
    {
      num: 14,
      img: "assets/images/qabeelah14.png",
      name: "Bani Taym",
      overlays: [
        {
          src: "assets/images/desert-house.png",
          title: "Abu Bakr Siddique (RA)'s House",
          xPercent: 0.21,
          yPercent: 0.39,
          w: 28,
          h: 28,
        },
      ],
    },
  ];

  // active set of checked items
  const active = new Set();

  // Clear and render sidebar
  function renderSidebar() {
    sidebar.innerHTML = "";
    items.forEach((it) => {
      const label = document.createElement("label");
      label.className = "tool-checkbox";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.num = it.num;
      checkbox.checked = false;

      const span = document.createElement("span");
      span.textContent = `${it.num} - ${it.name}`;

      label.appendChild(checkbox);
      label.appendChild(span);
      sidebar.appendChild(label);

      checkbox.addEventListener("change", () => {
        if (checkbox.checked) active.add(it.num);
        else active.delete(it.num);
        renderOverlays();
      });
    });
  }

  // debounce helper
  function debounce(fn, ms = 100) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  // render overlays (full-screen images + point icons)
  function renderOverlays() {
    if (!mapContainer) return;

    // remove previous overlays we created
    mapContainer
      .querySelectorAll(".qabeelah-img, .responsive-icon[data-group]")
      .forEach((n) => n.remove());

    const containerRect = mapContainer.getBoundingClientRect();
    // determine visible image area; fall back to container if baseMap missing
    const imgRect = baseMap ? baseMap.getBoundingClientRect() : containerRect;
    const offsetX = imgRect.left - containerRect.left;
    const offsetY = imgRect.top - containerRect.top;
    const imgW = imgRect.width;
    const imgH = imgRect.height;

    const frag = document.createDocumentFragment();

    items.forEach((it) => {
      if (!active.has(it.num)) return;

      // full-screen overlay image (keeps existing behaviour)
      if (it.img) {
        const full = document.createElement("img");
        full.src = it.img;
        full.alt = it.name || "";
        full.className = "qabeelah-img";
        full.dataset.num = it.num;
        frag.appendChild(full);
      }

      // Create point overlays
      (it.overlays || []).forEach((ov, idx) => {
        const icon = document.createElement("img");
        icon.src = ov.src;
        icon.alt = ov.title || "";
        icon.className = "responsive-icon";
        icon.dataset.group = `q${it.num}`;
        icon.dataset.title = ov.title || ""; // Store title for tooltip

        const w = ov.w || 28;
        const h = ov.h || w;
        icon.style.width = w + "px";
        icon.style.height = h + "px";

        const left = offsetX + (ov.xPercent || 0) * imgW;
        const top = offsetY + (ov.yPercent || 0) * imgH;
        icon.style.left = left + "px";
        icon.style.top = top + "px";
        icon.style.transform = "translate(-50%, -50%)";

        // Add tooltip functionality
        setupTooltip(icon);
        frag.appendChild(icon);
      });
    });

    mapContainer.appendChild(frag);
  }

  const onResize = debounce(renderOverlays, 120);
  window.addEventListener("resize", onResize);

  // Tooltip management
  function setupTooltip(icon) {
    let tooltip = null;
    let hideTimeout = null;

    // Create tooltip element
    function createTooltip() {
      if (tooltip) return tooltip;

      tooltip = document.createElement("div");
      tooltip.className = "custom-tooltip";
      tooltip.textContent = icon.dataset.title;
      document.body.appendChild(tooltip);
      return tooltip;
    }

    // Show tooltip
    function showTooltip(e) {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }

      const tooltip = createTooltip();
      tooltip.textContent = icon.dataset.title;

      // Position tooltip above the icon
      const iconRect = icon.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      let left = iconRect.left + iconRect.width / 2 - tooltipRect.width / 2;
      let top = iconRect.top - tooltipRect.height - 10;

      // Keep tooltip within viewport
      left = Math.max(
        10,
        Math.min(left, window.innerWidth - tooltipRect.width - 10)
      );
      top = Math.max(10, top);

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
      tooltip.classList.add("visible");
    }

    // Hide tooltip
    function hideTooltip() {
      if (!tooltip) return;

      hideTimeout = setTimeout(() => {
        if (tooltip) {
          tooltip.classList.remove("visible");
        }
      }, 100);
    }

    // Remove tooltip completely
    function removeTooltip() {
      if (tooltip && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
        tooltip = null;
      }
    }

    // Event listeners
    icon.addEventListener("mouseenter", showTooltip);
    icon.addEventListener("mouseleave", hideTooltip);
    icon.addEventListener("click", showTooltip); // For mobile touch

    // Clean up when icon is removed
    icon.addEventListener("DOMNodeRemoved", removeTooltip);
  }

  // init
  renderSidebar();
  if (baseMap && baseMap.complete) renderOverlays();
  else if (baseMap) baseMap.onload = renderOverlays;
});
