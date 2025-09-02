// script.js

// Dark Mode Toggle
const darkToggle = document.getElementById("darkToggle");
darkToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Hamburger Menü
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
hamburger?.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// Sepet Panel
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const cartClose = document.getElementById("cartClose");
const overlay = document.getElementById("overlay");

cartToggle?.addEventListener("click", () => {
  cartPanel.classList.add("active");
  overlay.classList.add("active");
});

cartClose?.addEventListener("click", () => {
  cartPanel.classList.remove("active");
  overlay.classList.remove("active");
});

overlay?.addEventListener("click", () => {
  cartPanel.classList.remove("active");
  overlay.classList.remove("active");
});

// Sepet İşlemleri
let cart = [];
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

function updateCart() {
  cartItems.innerHTML = "";
  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="cart-empty">
      <i class="fa-solid fa-box-open" style="font-size:2rem; opacity:0.6;"></i>
      <p>Sepetiniz boş</p>
    </div>`;
    cartCount.textContent = 0;
    cartTotal.textContent = "₺0,00";
    return;
  }
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <img src="${item.img}" alt="${item.name}" style="width:50px; border-radius:6px;">
        <div>
          <p>${item.name}</p>
          <small>₺${item.price.toFixed(2)}</small>
        </div>
      </div>
      <button class="remove" data-index="${i}"><i class="fa-solid fa-trash"></i></button>
    `;
    cartItems.appendChild(li);
  });
  cartCount.textContent = cart.length;
  cartTotal.textContent = `₺${total.toFixed(2)}`;

  // Sepetten sil
  document.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.currentTarget.dataset.index;
      cart.splice(idx, 1);
      updateCart();
    });
  });
}

function showToast(product) {
  toast.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px;">
      <img src="${product.img}" style="width:40px; border-radius:6px;">
      <span>${product.name} sepete eklendi ✅</span>
    </div>
  `;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// Sepete Ekle
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    const name = card.querySelector("h3").textContent;
    const price = parseFloat(card.dataset.price);
    const img = card.querySelector("img").src;

    const product = { name, price, img };
    cart.push(product);
    updateCart();
    showToast(product);
  });
});

// Favorilere Ekle
document.querySelectorAll(".fav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
  });
});

// Lazy Loading Blur
document.querySelectorAll(".product-card img").forEach((img) => {
  img.addEventListener("load", () => {
    img.setAttribute("data-loaded", "true");
  });
});

// Arama ve Filtreleme
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

function filterProducts() {
  const query = searchInput?.value.toLowerCase() || "";
  const filter = filterSelect?.value || "all";

  document.querySelectorAll(".product-card").forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    const price = parseFloat(card.dataset.price);

    let match = name.includes(query);
    if (filter === "low" && price > 150) match = false;
    if (filter === "high" && price <= 150) match = false;

    card.style.display = match ? "block" : "none";
  });
}

searchInput?.addEventListener("input", filterProducts);
filterSelect?.addEventListener("change", filterProducts);
