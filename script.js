// =====================
// DARK MODE
// =====================
const darkToggle = document.getElementById("darkToggle");
darkToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// =====================
// HAMBURGER MENU
// =====================
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
hamburger?.addEventListener("click", () => {
  menu.classList.toggle("open");
});

// =====================
// CART PANEL
// =====================
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const cartClose = document.getElementById("cartClose");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

let cart = [];

function updateCart() {
  cartItems.innerHTML = "";
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div class="empty-illust">🛒</div>
        <p>Sepetiniz boş</p>
      </div>`;
    cartTotal.textContent = "₺0,00";
    cartCount.textContent = "0";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("cart-item");
    li.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <div>
        <strong>${item.name}</strong><br>
        <span>₺${item.price.toFixed(2)}</span>
      </div>
    `;
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = `₺${total.toFixed(2)}`;
  cartCount.textContent = cart.length;
}

cartToggle?.addEventListener("click", () => {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
});
cartClose?.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
});
overlay?.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
});

// =====================
// ADD TO CART + TOAST
// =====================
const addToCartBtns = document.querySelectorAll(".add-to-cart");
const toast = document.getElementById("toast");

addToCartBtns.forEach(btn => {
  btn.addEventListener("click", e => {
    const card = e.target.closest(".product-card");
    const name = card.querySelector("h3").textContent;
    const price = parseFloat(card.dataset.price);
    const img = card.querySelector("img").src;

    cart.push({ name, price, img });
    updateCart();

    // Görselli Toast
    toast.innerHTML = `
      <img src="${img}" alt="${name}" />
      <div class="toast-text">
        <strong>${name}</strong>
        <span>Sepete eklendi • ₺${price.toFixed(2)}</span>
      </div>
    `;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  });
});

// =====================
// FAVORİ (KALP) BUTONU
// =====================
document.querySelectorAll(".fav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const pressed = btn.getAttribute("aria-pressed") === "true";
    btn.setAttribute("aria-pressed", !pressed);
  });
});

// =====================
// LAZY LOAD (BLUR)
// =====================
const lazyImages = document.querySelectorAll("img[loading='lazy']");
lazyImages.forEach(img => {
  img.classList.add("lazy");
  img.addEventListener("load", () => {
    img.classList.add("loaded");
  });
});

// =====================
// ARAMA & FİLTRE
// =====================
const searchInput = document.getElementById("searchInput");
const priceMin = document.getElementById("priceMin");
const priceMax = document.getElementById("priceMax");

function filterProducts() {
  const query = searchInput?.value.toLowerCase() || "";
  const min = parseFloat(priceMin?.value) || 0;
  const max = parseFloat(priceMax?.value) || Infinity;

  document.querySelectorAll(".product-card").forEach(card => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    const price = parseFloat(card.dataset.price);

    if (name.includes(query) && price >= min && price <= max) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

searchInput?.addEventListener("input", filterProducts);
priceMin?.addEventListener("input", filterProducts);
priceMax?.addEventListener("input", filterProducts);
