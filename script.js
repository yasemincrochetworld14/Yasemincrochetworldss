/* ===== Yasemin Crochet World - Clean JS ===== */

// Yıl
document.getElementById("year")?.textContent = new Date().getFullYear();

/* ======= Mobil Menü ======= */
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
hamburger?.addEventListener("click", () => menu.classList.toggle("active"));

/* ======= Dark Mode ======= */
const darkToggle = document.getElementById("darkToggle");
const body = document.body;

if (localStorage.getItem("dark") === "1") {
  body.classList.add("dark");
  darkToggle && (darkToggle.innerHTML = '<i class="fa-solid fa-sun"></i>');
}
darkToggle?.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  localStorage.setItem("dark", isDark ? "1" : "0");
  darkToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

/* ======= Sepet Paneli ======= */
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast = document.getElementById("toast");

const openCart = () => {
  cartPanel?.classList.add("active");
  overlay?.classList.add("active");
  cartPanel?.setAttribute("aria-hidden", "false");
};
const closeCart = () => {
  cartPanel?.classList.remove("active");
  overlay?.classList.remove("active");
  cartPanel?.setAttribute("aria-hidden", "true");
};
cartToggle?.addEventListener("click", openCart);
cartClose?.addEventListener("click", closeCart);
overlay?.addEventListener("click", closeCart);

let cart = [];

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}
function animateBadge() {
  if (!cartCount) return;
  cartCount.style.transform = "scale(1.3)";
  setTimeout(() => (cartCount.style.transform = "scale(1)"), 200);
}

// Sepete ekle
document.querySelectorAll(".product-card").forEach((card) => {
  const btn = card.querySelector(".add-to-cart");
  btn?.addEventListener("click", () => {
    const name = card.querySelector("h3").textContent.trim();
    const price = parseFloat(card.dataset.price || "0");
    const existing = cart.find((i) => i.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ name, price, qty: 1 });
    updateCart();
    showToast("Sepete eklendi ✅");
    animateBadge();
  });
});

function updateCart() {
  if (!cartItems || !cartTotal || !cartCount) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name}</span>
      <div class="qty">
        <button data-i="${idx}" data-act="dec">-</button>
        <strong>${item.qty}</strong>
        <button data-i="${idx}" data-act="inc">+</button>
      </div>
      <strong>₺${(item.price * item.qty).toFixed(2)}</strong>
      <button data-i="${idx}" data-act="rm" title="Kaldır">x</button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `₺${total.toFixed(2)}`;
  cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);

  cartItems.querySelectorAll("button").forEach((btn) => {
    const i = +btn.dataset.i;
    const act = btn.dataset.act;
    btn.addEventListener("click", () => {
      if (act === "inc") cart[i].qty += 1;
      if (act === "dec") cart[i].qty = Math.max(0, cart[i].qty - 1);
      if (act === "rm") cart.splice(i, 1);
      cart = cart.filter((it) => it.qty > 0);
      updateCart();
    });
  });
}

checkoutBtn?.addEventListener("click", () => {
  if (!cart.length) {
    alert("Sepetiniz boş!");
    return;
  }
  window.open("https://www.shopier.com/yasemincrochetworld", "_blank");
});

/* ======= Ürün Sliderları ======= */
document.querySelectorAll(".slider").forEach((slider) => {
  let images = slider.querySelectorAll("img");
  let currentIndex = 0;
  const showImage = (i) => {
    images.forEach((img) => img.classList.remove("active"));
    images[i]?.classList.add("active");
  };
  slider.querySelector(".prev")?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  });
  slider.querySelector(".next")?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  });
  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }, 4000);
});

/* ======= Ürün Detay Modal ======= */
const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const slidesContainer = modal?.querySelector(".slides");
const modalPrev = modal?.querySelector(".prev");
const modalNext = modal?.querySelector(".next");
const closeBtn = modal?.querySelector(".close-btn");

let modalImages = [];
let currentSlide = 0;

document.querySelectorAll(".product-card").forEach((card) => {
  const detailsBtn = card.querySelector(".details-btn");
  detailsBtn?.addEventListener("click", () => {
    modalTitle.textContent = card.querySelector("h3").textContent.trim();
    modalDesc.textContent = card.querySelector("p").textContent.trim();
    modalPrice.textContent = card.querySelector(".price").textContent.trim();

    slidesContainer.innerHTML = "";
    modalImages = card.querySelectorAll(".slider img");
    modalImages.forEach((img, i) => {
      const clone = img.cloneNode();
      clone.classList.toggle("active", i === 0);
      slidesContainer.appendChild(clone);
    });

    currentSlide = 0;
    modal?.classList.add("active");
  });
});

closeBtn?.addEventListener("click", () => modal?.classList.remove("active"));
modal?.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("active");
});
function showSlide(n) {
  const imgs = slidesContainer?.querySelectorAll("img") || [];
  imgs.forEach((img) => img.classList.remove("active"));
  imgs[n]?.classList.add("active");
}
modalPrev?.addEventListener("click", () => {
  if (!modalImages.length) return;
  currentSlide = (currentSlide - 1 + modalImages.length) % modalImages.length;
  showSlide(currentSlide);
});
modalNext?.addEventListener("click", () => {
  if (!modalImages.length) return;
  currentSlide = (currentSlide + 1) % modalImages.length;
  showSlide(currentSlide);
});

/* ======= Favoriler ======= */
const favToggle = document.getElementById("favToggle");          // header kalbi
const favPanel = document.querySelector(".favorites-panel");
const favList = document.querySelector(".favorites-list");
const favOverlay = document.querySelector(".fav-overlay");
const favClose = document.querySelector(".close-fav");
const favCount = document.querySelector(".fav-count");           // header rozet

let favorites = []; // sadece 1 kez!

// Kartlara kalp butonu ekle (yoksa)
document.querySelectorAll(".product-card").forEach((card) => {
  if (!card.querySelector(".fav-btn")) {
    const favBtn = document.createElement("button");
    favBtn.className = "fav-btn";
    favBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    card.querySelector(".price-line")?.appendChild(favBtn);

    favBtn.addEventListener("click", () => toggleFavorite(card, favBtn));
  }
});

function toggleFavorite(card, btn) {
  const name = card.querySelector("h3").innerText.trim();
  const idx = favorites.indexOf(name);

  if (idx === -1) {
    favorites.push(name);
    btn.classList.add("active");
  } else {
    favorites.splice(idx, 1);
    btn.classList.remove("active");
  }
  renderFavorites();
}

function renderFavorites() {
  favList.innerHTML = "";
  favorites.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    favList.appendChild(li);
  });
  if (favCount) favCount.textContent = String(favorites.length);
}

// Panel aç/kapat
favToggle?.addEventListener("click", () => {
  favPanel?.classList.add("active");
  favOverlay?.classList.add("active");
});
favClose?.addEventListener("click", () => {
  favPanel?.classList.remove("active");
  favOverlay?.classList.remove("active");
});
favOverlay?.addEventListener("click", () => {
  favPanel?.classList.remove("active");
  favOverlay?.classList.remove("active");
});
