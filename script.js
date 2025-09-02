// script.js

// ======================
// Dark Mode Toggle
// ======================
const darkToggle = document.getElementById("darkToggle");
darkToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
});
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

// ======================
// Hamburger Menü
// ======================
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
hamburger?.addEventListener("click", () => {
  menu.classList.toggle("open");
});

// ======================
// Sepet Paneli
// ======================
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const cartClose = document.getElementById("cartClose");
const overlay = document.getElementById("overlay");

cartToggle?.addEventListener("click", () => {
  cartPanel.classList.add("open");
  overlay.classList.add("active");
});
cartClose?.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  overlay.classList.remove("active");
});
overlay?.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  overlay.classList.remove("active");
});

// ======================
// Modal (Ürün Detay)
// ======================
const modal = document.getElementById("productModal");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const modalSizes = document.getElementById("modalSizes");
const modalSlides = document.getElementById("modalSlides");

let currentSlide = 0;

function openModal(product) {
  const id = product.dataset.id;
  const title = product.querySelector("h3").innerText;
  const desc = product.querySelector("p").innerText;
  const price = product.dataset.price;

  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modalPrice.textContent = `₺${price},00`;

  // Örnek 5 resim (sen sadece images klasörüne koyacaksın)
  modalSlides.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const img = document.createElement("img");
    img.src = `images/${id}-${i}.jpg`; // Örn: images/battaniye-1.jpg
    img.alt = `${title} ${i}`;
    img.classList.add("slide");
    if (i === 1) img.classList.add("active");
    modalSlides.appendChild(img);
  }

  modal.setAttribute("aria-hidden", "false");
  modal.style.display = "block";
  currentSlide = 0;
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  modal.style.display = "none";
}

modalClose?.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// ======================
// Slider Controls
// ======================
function showSlide(n) {
  const slides = modalSlides.querySelectorAll(".slide");
  if (slides.length === 0) return;

  slides.forEach((s, i) => s.classList.remove("active"));

  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
}

document.querySelector(".prev")?.addEventListener("click", () =>
  showSlide(currentSlide - 1)
);
document.querySelector(".next")?.addEventListener("click", () =>
  showSlide(currentSlide + 1)
);

// ======================
// Ürünlere Tıklama
// ======================
document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("click", () => openModal(card));
});

// ======================
// Footer Yılı
// ======================
document.getElementById("year").textContent = new Date().getFullYear();
