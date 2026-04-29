// scripts/main.js
console.log("main.js loaded");

// ------------------------
// SIDEBAR LOADING
// ------------------------

const sidebarContainer = document.getElementById("sidebar-container");

if (sidebarContainer) {
  fetch("sidebar.html")
    .then(res => res.text())
    .then(data => {
      sidebarContainer.innerHTML = data;
      setActiveLink();
      console.log("sidebar loaded");
    })
    .catch(err => console.error("Sidebar error:", err));
}

function setActiveLink() {
  const links = document.querySelectorAll(".sidebar a");
  const current = window.location.pathname.split("/").pop();

  links.forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
}

// ------------------------
// FILE SELECTION
// ------------------------

let selectedThumb = null;

function selectThumb(el) {
  if (selectedThumb) {
    selectedThumb.classList.remove("selected");
  }
  selectedThumb = el;
  el.classList.add("selected");
}

document.addEventListener("click", function(e) {
  const isThumb = e.target.closest(".thumb");

  if (!isThumb && selectedThumb) {
    selectedThumb.classList.remove("selected");
    selectedThumb = null;
  }
});

// ------------------------
// VIEWER (SAFE ON ALL PAGES)
// ------------------------

function openViewer(src, name) {
  const viewer = document.getElementById("viewer");
  const win = document.getElementById("viewer-window");

  if (!viewer || !win) return; // 🔴 prevents errors on pages without viewer

  document.getElementById("viewer-img").src = src;
  document.getElementById("viewer-title").textContent = name;
  viewer.classList.remove("hidden");

  const width = win.offsetWidth;
  const height = win.offsetHeight;

  const offset = Math.random() * 40;

  const centerX = window.innerWidth / 2 - width / 2;
  const centerY = window.innerHeight / 2 - height / 2;

  win.style.left = `${centerX + offset}px`;
  win.style.top = `${centerY + offset}px`;
}

function closeViewer() {
  const viewer = document.getElementById("viewer");
  if (viewer) {
    viewer.classList.add("hidden");
  }
}

// close when clicking outside
document.addEventListener("DOMContentLoaded", () => {
  const viewer = document.getElementById("viewer");

  if (viewer) {
    viewer.addEventListener("click", function(e) {
      if (e.target.id === "viewer") {
        closeViewer();
      }
    });
  }
});

// ------------------------
// DRAG WINDOW (ONLY IF EXISTS)
// ------------------------

document.addEventListener("DOMContentLoaded", () => {
  const viewerWindow = document.getElementById("viewer-window");
  if (!viewerWindow) return;

  const titlebar = viewerWindow.querySelector(".titlebar");

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titlebar.addEventListener("mousedown", (e) => {
    isDragging = true;
    e.preventDefault();

    const rect = viewerWindow.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

    const maxX = window.innerWidth - viewerWindow.offsetWidth;
    const maxY = window.innerHeight - viewerWindow.offsetHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    viewerWindow.style.left = `${newX}px`;
    viewerWindow.style.top = `${newY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  document.addEventListener("mouseleave", () => {
    isDragging = false;
  });
});