/* =============================
   YASEMIN CROCHET - script.js
   (TEK DOSYA: TÜM ÖZELLİKLER + FIRESTORE ÜRÜNLER)
============================= */

/* ========== FOOTER YIL ========== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ========== HAMBURGER MENÜ ========== */
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
if (hamburger && menu) {
  hamburger.addEventListener('click', () => menu.classList.toggle('active'));
}

/* ========== DARK MODE ========== */
const darkToggle = document.getElementById('darkToggle');
const body = document.body;
if (localStorage.getItem('dark') === '1') {
  body.classList.add('dark');
  if (darkToggle) darkToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('dark', isDark ? '1' : '0');
    darkToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });
}

/* ========== SEPET PANELİ ========== */
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartPanel = document.getElementById('cartPanel');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const toast = document.getElementById('toast');

const openCart = () => { if(cartPanel&&overlay){ cartPanel.classList.add('active'); overlay.classList.add('active'); } };
const closeCart = () => { if(cartPanel&&overlay){ cartPanel.classList.remove('active'); overlay.classList.remove('active'); } };
if (cartToggle) cartToggle.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', closeCart);
if (overlay) overlay.addEventListener('click', closeCart);

let cart = [];

function showToast(msg){
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 2500);
}
function animateBadge(){
  if (!cartCount) return;
  cartCount.style.transform = "scale(1.3)";
  setTimeout(()=> cartCount.style.transform="scale(1)", 200);
}
function updateCart(){
  if (!cartItems || !cartTotal || !cartCount) return;
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const li = document.createElement('li');
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
  cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);

  cartItems.querySelectorAll('button').forEach(btn => {
    const i = +btn.dataset.i;
    const act = btn.dataset.act;
    btn.addEventListener('click', () => {
      if (act === 'inc') cart[i].qty += 1;
      if (act === 'dec') cart[i].qty = Math.max(0, cart[i].qty - 1);
      if (act === 'rm') cart.splice(i,1);
      cart = cart.filter(it => it.qty > 0);
      updateCart();
    });
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (!cart.length) { alert('Sepetiniz boş!'); return; }
    window.open("https://www.shopier.com/yasemincrochetworld", "_blank");
  });
}

/* ========== FAVORİLER PANELİ ========== */
const favToggle = document.getElementById("favToggle");
const favPanel = document.querySelector(".favorites-panel");
const favOverlay = document.querySelector(".fav-overlay");
const closeFav = document.querySelector(".close-fav");
const favCount = document.querySelector(".fav-count");
const favList = document.querySelector(".favorites-list");
let favorites = [];

if (favToggle && favPanel && favOverlay) {
  favToggle.addEventListener("click", () => {
    favPanel.classList.add("active");
    favOverlay.classList.add("active");
  });
}
if (closeFav && favPanel && favOverlay) {
  closeFav.addEventListener("click", () => {
    favPanel.classList.remove("active");
    favOverlay.classList.remove("active");
  });
}
if (favOverlay && favPanel) {
  favOverlay.addEventListener("click", () => {
    favPanel.classList.remove("active");
    favOverlay.classList.remove("active");
  });
}
function updateFavorites() {
  if (!favList || !favCount) return;
  favList.innerHTML = "";
  favorites.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    favList.appendChild(li);
  });
  favCount.textContent = favorites.length;
}

/* ========== ÜRÜN DETAY MODAL ========== */
const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const slidesContainer = modal ? modal.querySelector(".slides") : null;
const modalPrev = modal ? modal.querySelector(".prev") : null;
const modalNext = modal ? modal.querySelector(".next") : null;
const closeBtn = modal ? modal.querySelector(".close-btn") : null;

let modalImages = [];
let currentSlide = 0;

function showSlide(n) {
  if (!slidesContainer) return;
  const imgs = slidesContainer.querySelectorAll("img");
  if (!imgs.length) return;
  imgs.forEach(img => img.classList.remove("active"));
  imgs[n].classList.add("active");
}
if (closeBtn && modal) closeBtn.addEventListener("click", () => modal.classList.remove("active"));
if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("active"); });
if (modalPrev) modalPrev.addEventListener("click", () => {
  if (!modalImages.length) return;
  currentSlide = (currentSlide - 1 + modalImages.length) % modalImages.length;
  showSlide(currentSlide);
});
if (modalNext) modalNext.addEventListener("click", () => {
  if (!modalImages.length) return;
  currentSlide = (currentSlide + 1) % modalImages.length;
  showSlide(currentSlide);
});

/* ========== İLETİŞİM FORMU (EmailJS) ========== */
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Kendi ServiceID/TemplateID'ni kullan
    emailjs.sendForm("service_p9lhd2g", "template_9s3t91e", this)
      .then(() => {
        if (!formMessage) return;
        formMessage.textContent = "Mesajınız başarıyla gönderildi ✅";
        formMessage.className = "form-message success";
        contactForm.reset();
        setTimeout(() => formMessage.classList.add("fade-out"), 2500);
        setTimeout(() => { formMessage.className = "form-message"; formMessage.textContent = ""; }, 3300);
      })
      .catch(() => {
        if (!formMessage) return;
        formMessage.textContent = "Mesaj gönderilirken hata oluştu ❌";
        formMessage.className = "form-message error";
        setTimeout(() => formMessage.classList.add("fade-out"), 2500);
        setTimeout(() => { formMessage.className = "form-message"; formMessage.textContent = ""; }, 3300);
      });
  });
}

/* ========== YORUMLAR (REVIEWS) ========== */
// Basit HTML kaçış (XSS)
const escapeHTML = (s) => s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const reviewList = document.getElementById("reviewList");
const reviewForm = document.getElementById("reviewForm");
const reviewMessageBox = document.getElementById("reviewMessageBox");
const RATE_LIMIT_MS = 10000;

/* ========== FIREBASE (compat) ========== */
(function ensureFirebase(){
  // Senin config’in
  const firebaseConfig = {
    apiKey: "AIzaSyDJDi1LyAKemqWo-iI7jyVi58-1yh2guq4",
    authDomain: "yasemincrochetworld.firebaseapp.com",
    projectId: "yasemincrochetworld"
    // storageBucket / messagingSenderId / appId gerekmiyor (Firestore için yeterli)
  };
  if (typeof firebase !== "undefined") {
    try {
      if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
      if (!window.db) window.db = firebase.firestore();
    } catch (e) {
      console.warn("Firebase init uyarı:", e);
    }
  } else {
    console.warn("Firebase scriptleri yüklenmemiş görünüyor.");
  }
})();

/* ---- Yorumlar: Kaydet & Listele ---- */
if (reviewForm && window.db) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameEl = document.getElementById("reviewName");
    const msgEl  = document.getElementById("reviewMessage");
    const name = (nameEl?.value || "").trim();
    const message = (msgEl?.value || "").trim();

    if (name.length < 2 || message.length < 5) {
      if (reviewMessageBox) {
        reviewMessageBox.textContent = "Lütfen adınızı ve yorumunuzu biraz daha detaylandırın.";
        reviewMessageBox.className = "form-message error";
        setTimeout(() => reviewMessageBox.classList.add("fade-out"), 2500);
        setTimeout(() => { reviewMessageBox.className = "form-message"; reviewMessageBox.textContent = ""; }, 3300);
      }
      return;
    }

    const last = Number(localStorage.getItem("lastReviewTime") || "0");
    if (Date.now() - last < RATE_LIMIT_MS) {
      if (reviewMessageBox) {
        reviewMessageBox.textContent = "Çok hızlı gidiyorsunuz, lütfen birkaç saniye bekleyin 😊";
        reviewMessageBox.className = "form-message error";
        setTimeout(() => reviewMessageBox.classList.add("fade-out"), 2500);
        setTimeout(() => { reviewMessageBox.className = "form-message"; reviewMessageBox.textContent = ""; }, 3300);
      }
      return;
    }

    const btn = reviewForm.querySelector("button[type='submit']");
    if (btn) btn.disabled = true;

    try {
      await window.db.collection("reviews").add({
        name,
        message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      localStorage.setItem("lastReviewTime", String(Date.now()));
      reviewForm.reset();
      if (reviewMessageBox) {
        reviewMessageBox.textContent = "Yorumunuz başarıyla kaydedildi ✅";
        reviewMessageBox.className = "form-message success";
        setTimeout(() => reviewMessageBox.classList.add("fade-out"), 2500);
        setTimeout(() => { reviewMessageBox.className = "form-message"; reviewMessageBox.textContent = ""; }, 3300);
      }
    } catch (err) {
      if (reviewMessageBox) {
        reviewMessageBox.textContent = "Yorum kaydedilirken hata oluştu ❌";
        reviewMessageBox.className = "form-message error";
        setTimeout(() => reviewMessageBox.classList.add("fade-out"), 2500);
        setTimeout(() => { reviewMessageBox.className = "form-message"; reviewMessageBox.textContent = ""; }, 3300);
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  window.db.collection("reviews")
    .orderBy("createdAt", "desc")
    .limit(50)
    .onSnapshot((snapshot) => {
      if (!reviewList) return;
      reviewList.innerHTML = "";
      snapshot.forEach((doc) => {
        const r = doc.data();
        const card = document.createElement("div");
        card.className = "review-card fade-in";
        const safeName = escapeHTML(r.name || "Misafir");
        const safeMsg  = escapeHTML(r.message || "");
        card.innerHTML = `<p>“${safeMsg}”</p><span>- ${safeName}</span>`;
        reviewList.appendChild(card);
      });
    });
}

/* ========== ÜRÜN KARTI OLUŞTUR (DİNAMİK) ========== */
window.renderCard = function renderCard(raw) {
  const container = document.querySelector(".product-grid");
  if (!container) return;

  // Admin panelindeki alan adlarıyla uyumlu
  const product = {
    name: raw.title || raw.name || "",
    desc: raw.description || raw.desc || "",
    price: Number(raw.price) || 0,
    images: Array.isArray(raw.images) ? raw.images.slice(0, 5) : (raw.image ? [raw.image] : []),
    category: raw.category || ""
  };

  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.price = product.price;

  card.innerHTML = `
    <div class="slider">
      ${product.images.map((img, i) =>
        `<img src="${img}" alt="${product.name}" class="${i===0 ? 'active' : ''}">`
      ).join("")}
      <span class="prev">&#10094;</span>
      <span class="next">&#10095;</span>
    </div>
    <h3>${product.name}</h3>
    <p>${product.desc}</p>
    <div class="price-line">
      <span class="price">₺${product.price.toFixed(2)}</span>
      <button class="btn details-btn">Detayları Gör</button>
      <button class="btn add-to-cart">Sepete Ekle</button>
      <button class="fav-btn">🤍</button>
    </div>
  `;

  container.appendChild(card);

  // --- Slider (dinamik) ---
  const slider = card.querySelector(".slider");
  let imgs = slider.querySelectorAll("img");
  let idx = 0;
  const show = (i) => {
    imgs.forEach(img => img.classList.remove("active"));
    imgs[i].classList.add("active");
  };
  const prev = slider.querySelector(".prev");
  const next = slider.querySelector(".next");
  if (prev && next && imgs.length > 1) {
    prev.addEventListener("click", () => { idx = (idx - 1 + imgs.length) % imgs.length; show(idx); });
    next.addEventListener("click", () => { idx = (idx + 1) % imgs.length; show(idx); });
    const autoplay = setInterval(() => { 
      if (!document.body.contains(card)) return clearInterval(autoplay); 
      idx = (idx + 1) % imgs.length; show(idx); 
    }, 4000);
  }

  // --- Sepet butonu ---
  const addToCartBtn = card.querySelector(".add-to-cart");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const existing = cart.find(i => i.name === product.name);
      if (existing) existing.qty += 1;
      else cart.push({ name: product.name, price: product.price, qty: 1 });
      updateCart();
      showToast("Sepete eklendi ✅");
      animateBadge();
    });
  }

  // --- Favori butonu ---
  const favBtn = card.querySelector(".fav-btn");
  if (favBtn) {
    favBtn.addEventListener("click", () => {
      if (favorites.includes(product.name)) {
        favorites = favorites.filter(t => t !== product.name);
        favBtn.classList.remove("active"); favBtn.innerHTML = "🤍";
      } else {
        favorites.push(product.name);
        favBtn.classList.add("active"); favBtn.innerHTML = "❤️";
      }
      updateFavorites();
    });
  }

  // --- Detaylar butonu ---
  const detailsBtn = card.querySelector(".details-btn");
  if (detailsBtn && modal && slidesContainer) {
    detailsBtn.addEventListener("click", () => {
      modalTitle.textContent = product.name;
      modalDesc.textContent  = product.desc;
      modalPrice.textContent = "₺" + product.price.toFixed(2);
      slidesContainer.innerHTML = product.images.map((img, i) =>
        `<img src="${img}" class="${i===0 ? 'active' : ''}">`
      ).join("");
      modalImages = Array.from(slidesContainer.querySelectorAll("img"));
      currentSlide = 0;
      modal.classList.add("active");
    });
  }
};

/* ========== FIRESTORE'DAN ÜRÜNLERİ ÇEK ========== */
function loadProductsFromFirestore() {
  if (!window.db) return;

  const container = document.querySelector(".product-grid");
  if (!container) return;

  // Önce canlı (onSnapshot) ve sıralı dene:
  try {
    window.db.collection("products").orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        container.innerHTML = "";
        snapshot.forEach(doc => window.renderCard(doc.data()));
      }, (err) => {
        // createdAt yoksa fallback
        console.warn("orderBy(createdAt) olmadı, fallback:", err?.message || err);
        window.db.collection("products").onSnapshot((snap2) => {
          container.innerHTML = "";
          snap2.forEach(doc => window.renderCard(doc.data()));
        });
      });
  } catch (e) {
    // Eski tarayıcı/alan yok fallback
    window.db.collection("products").onSnapshot((snap2) => {
      container.innerHTML = "";
      snap2.forEach(doc => window.renderCard(doc.data()));
    });
  }
}
document.addEventListener("DOMContentLoaded", loadProductsFromFirestore);

/* ========== STATİK KARTLAR İÇİN (Sayfada HTML ile varsa) SEPET/FAVORİ/DETAY BAĞLAMA ========== */
/* Not: Dinamik kartlar renderCard içinde bağlanıyor. Bu kısım,
   sayfa HTML'inde önceden yazılmış kartlar varsa onların da çalışması için. */
function bindStaticCardsOnce(){
  document.querySelectorAll('.product-card').forEach(card => {
    // Eğer zaten renderCard ile geldiyse atla:
    if (card.dataset.bound === "1") return;
    card.dataset.bound = "1";

    const name = card.querySelector('h3')?.textContent?.trim() || "Ürün";
    const priceEl = card.querySelector('.price');
    const price = priceEl ? Number((priceEl.textContent||"").replace(/[^\d.,]/g,'').replace(',','.')) : Number(card.dataset.price || 0);

    // Sepet
    const btnCart = card.querySelector('.add-to-cart');
    if (btnCart) {
      btnCart.addEventListener('click', () => {
        const existing = cart.find(i => i.name === name);
        if (existing) existing.qty += 1;
        else cart.push({ name, price, qty: 1 });
        updateCart(); showToast("Sepete eklendi ✅"); animateBadge();
      });
    }

    // Favori
    const favBtn = card.querySelector('.fav-btn');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        if (favorites.includes(name)) {
          favorites = favorites.filter(t => t !== name);
          favBtn.classList.remove("active"); favBtn.innerHTML = "🤍";
        } else {
          favorites.push(name);
          favBtn.classList.add("active"); favBtn.innerHTML = "❤️";
        }
        updateFavorites();
      });
    }

    // Detay
    const detailsBtn = card.querySelector(".details-btn");
    if (detailsBtn && modal && slidesContainer) {
      detailsBtn.addEventListener("click", () => {
        const desc = card.querySelector("p")?.textContent?.trim() || "";
        const images = Array.from(card.querySelectorAll(".slider img")).map(i=>i.src);
        modalTitle.textContent = name;
        modalDesc.textContent  = desc;
        modalPrice.textContent = "₺" + (price || 0).toFixed(2);
        slidesContainer.innerHTML = images.map((img, i) =>
          `<img src="${img}" class="${i===0 ? 'active' : ''}">`
        ).join("");
        modalImages = Array.from(slidesContainer.querySelectorAll("img"));
        currentSlide = 0;
        modal.classList.add("active");
      });
    }

    // Slider
    const slider = card.querySelector(".slider");
    if (slider) {
      let imgs = slider.querySelectorAll("img");
      let idx = 0;
      const show = (i) => { imgs.forEach(img => img.classList.remove("active")); imgs[i].classList.add("active"); };
      const prev = slider.querySelector(".prev");
      const next = slider.querySelector(".next");
      if (prev && next && imgs.length > 1) {
        prev.addEventListener("click", () => { idx = (idx - 1 + imgs.length) % imgs.length; show(idx); });
        next.addEventListener("click", () => { idx = (idx + 1) % imgs.length; show(idx); });
        setInterval(() => { idx = (idx + 1) % imgs.length; show(idx); }, 4000);
      }
    }
  });
}
document.addEventListener("DOMContentLoaded", bindStaticCardsOnce);
