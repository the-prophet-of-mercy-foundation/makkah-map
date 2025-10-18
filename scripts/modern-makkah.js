// Responsive icon placement for base map with object-fit: contain
// Define your icons as percentage coordinates relative to the image
const ICONS = [
  {
    src: "assets/images/desert-house.png",
    alt: "Abdur Rahman Bin Awf (RA)'s House",
    title: "Abdur Rahman Bin Awf (RA)'s House",
    xPercent: 0.5276,
    yPercent: 0.4781,
    width: 30,
    height: 30,
    type: "house",
  },
  {
    src: "assets/images/desert-house.png",
    alt: "Prophet's Birthplace (PBUH)",
    title: "Prophet's Birthplace (PBUH)",
    xPercent: 0.6636,
    yPercent: 0.343,
    width: 30,
    height: 30,
    type: "house",
  },
  {
    src: "assets/images/desert-house.png",
    alt: "Abu Talib's House",
    title: "Abu Talib's House",
    xPercent: 0.6756,
    yPercent: 0.3981,
    width: 30,
    height: 30,
    type: "house",
  },
  {
    src: "assets/images/desert-house.png",
    alt: "Abu Lahab's House",
    title: "Abu Lahab's House",
    xPercent: 0.6816,
    yPercent: 0.2081,
    width: 30,
    height: 30,
    type: "house",
  },
  {
    src: "assets/images/desert-house.png",
    alt: "Abu Jahal's House",
    title: "Abu Jahal's House",
    xPercent: 0.576,
    yPercent: 0.7181,
    width: 30,
    height: 30,
    type: "house",
  },
  {
    src: "assets/images/desert-house.png",
    alt: "AbuBakr Siddique (RA)'s House",
    title: "AbuBakr Siddique (RA)'s House",
    xPercent: 0.382,
    yPercent: 0.8481,
    width: 30,
    height: 30,
    type: "house",
  },
  {
    src: "assets/images/desert-house.png",
    alt: "Umar bin al-khattab (RA)'s House",
    title: "Umar bin al-khattab (RA)'s House",
    xPercent: 0.302,
    yPercent: 0.7081,
    width: 30,
    height: 30,
    type: "house",
  },
  {
    src: "assets/images/valley.png",
    alt: "Valley of Banu Hashim",
    title: "Valley of Banu Hashim",
    xPercent: 0.702,
    yPercent: 0.4581,
    width: 30,
    height: 30,
    type: "valley",
  },
  {
    src: "assets/images/valley.png",
    alt: "Lesser Ajyad Valley",
    title: "Lesser Ajyad Valley",
    xPercent: 0.632,
    yPercent: 0.8181,
    width: 30,
    height: 30,
    type: "valley",
  },
  {
    src: "assets/images/valley.png",
    alt: "Greater Ajyad Valley",
    title: "Greater Ajyad Valley",
    xPercent: 0.522,
    yPercent: 0.9781,
    width: 30,
    height: 30,
    type: "valley",
  },
  {
    src: "assets/images/mountain.png",
    alt: "Mount Abu Qubais",
    title: "Mount Abu Qubais",
    xPercent: 0.642,
    yPercent: 0.602,
    width: 40,
    height: 40,
    type: "mountain",
  },
  {
    src: "assets/images/mountain.png",
    alt: "Mount Safa",
    title: "Mount Safa",
    xPercent: 0.546,
    yPercent: 0.6281,
    width: 40,
    height: 40,
    type: "mountain",
  },
  {
    src: "assets/images/mountain.png",
    alt: "Mount Marwah",
    title: "Mount Marwah",
    xPercent: 0.556,
    yPercent: 0.2981,
    width: 40,
    height: 40,
    type: "mountain",
  },
];

const FILTERS = [
  {
    type: "house",
    label: "Houses",
    img: "assets/images/desert-house.png",
  },
  {
    type: "valley",
    label: "Valleys",
    img: "assets/images/valley.png",
  },
  {
    type: "mountain",
    label: "Mountains",
    img: "assets/images/mountain.png",
  },
];

let activeFilters = new Set(FILTERS.map((f) => f.type)); // Show all by default

function renderSidebar() {
  const sidebar = document.getElementById("iconSidebar");
  sidebar.innerHTML = "";
  FILTERS.forEach((f) => {
    const label = document.createElement("label");
    label.className = "icon-filter-label";
    label.title = f.label;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = activeFilters.has(f.type);
    checkbox.dataset.type = f.type;
    checkbox.style.marginRight = "6px";

    const img = document.createElement("img");
    img.src = f.img;
    img.className = "icon-filter-img";
    img.alt = f.label;

    const text = document.createElement("span");
    text.className = "icon-filter-text";
    text.textContent = f.label;

    label.appendChild(checkbox);
    label.appendChild(img);
    label.appendChild(text);
    sidebar.appendChild(label);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        activeFilters.add(f.type);
      } else {
        activeFilters.delete(f.type);
      }
      renderIcons();
    });
  });
}

// Tooltip management function
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

  // Show tooltip - POSITION ABOVE THE ICON
  function showTooltip(e) {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    const tooltip = createTooltip();
    tooltip.textContent = icon.dataset.title;

    // Position tooltip ABOVE the icon
    const iconRect = icon.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left = iconRect.left + iconRect.width / 2 - tooltipRect.width / 2;
    let top = iconRect.top - tooltipRect.height - 10; // Position ABOVE the icon

    // Keep tooltip within viewport
    left = Math.max(
      10,
      Math.min(left, window.innerWidth - tooltipRect.width - 10)
    );

    // If tooltip would go above viewport, position below instead
    if (top < 10) {
      top = iconRect.bottom + 10;
    }

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

function renderIcons() {
  const mapContainer = document.getElementById("map-container");
  const baseMap = document.getElementById("base-map");
  if (!mapContainer || !baseMap) return;

  // Remove any previous icons
  mapContainer
    .querySelectorAll(".responsive-icon")
    .forEach((el) => el.remove());

  // Get actual rendered image area
  const containerRect = mapContainer.getBoundingClientRect();
  const imgRect = baseMap.getBoundingClientRect();

  // Calculate offset of image inside container
  const offsetX = imgRect.left - containerRect.left;
  const offsetY = imgRect.top - containerRect.top;
  const imgWidth = imgRect.width;
  const imgHeight = imgRect.height;

  ICONS.filter((icon) => activeFilters.has(icon.type)).forEach((icon) => {
    const iconEl = document.createElement("img");
    iconEl.src = icon.src;
    iconEl.alt = icon.alt;
    iconEl.className = "responsive-icon";
    iconEl.dataset.title = icon.title; // Store title for tooltip
    iconEl.style.setProperty("--icon-size", icon.width + "px");
    iconEl.style.width = icon.width + "px";
    iconEl.style.height = icon.height + "px";
    iconEl.style.left = offsetX + icon.xPercent * imgWidth + "px";
    iconEl.style.top = offsetY + icon.yPercent * imgHeight + "px";
    iconEl.style.zIndex = "10";
    iconEl.style.transform = "translate(-50%, -50%)";

    // Add tooltip functionality
    setupTooltip(iconEl);

    mapContainer.appendChild(iconEl);
  });
}

window.addEventListener("resize", renderIcons);
window.addEventListener("DOMContentLoaded", () => {
  renderSidebar();
  const baseMap = document.getElementById("base-map");
  if (baseMap.complete) {
    renderIcons();
  } else {
    baseMap.onload = renderIcons;
  }
});
