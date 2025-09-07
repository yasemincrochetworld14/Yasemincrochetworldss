// ================== FOOTER YIL ==================
document.getElementById('year').textContent = new Date().getFullYear();

// ================== HAMBURGER MENÜ ==================
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
if (hamburger && menu) {
  hamburger.addEventListener('click', () => menu.classList.toggle('active'));
}

// ================== DARK MODE ==================
const darkToggle = document.getElementById('darkToggle');
const body = document.body;

if (localStorage.getItem('dark') === '1') {
  body.classList.add('dark');
  darkToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

darkToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  if (body.classList.contains('dark')) {
    localStorage.setItem('dark', '1');
    darkToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    localStorage.setItem('dark', '0');
    darkToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
});

// ================== SEPET ==================
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartPanel = document.getElementById('cartPanel');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const toast = document.getElementById('toast');

const openCart = () => { 
  cartPanel.classList.add('active'); 
  overlay.classList.add('active'); 
};
const closeCart = () => { 
  cartPanel.classList.remove('active'); 
  overlay.classList.remove('active'); 
};

if (cartToggle) cartToggle.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', closeCart);
if (overlay) overlay.addEventListener('click', closeCart);

let cart = [];

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 2500);
}

function animateBadge(){
  cartCount.style.transform = "scale(1.3)";
  setTimeout(()=> cartCount.style.transform="scale(1)", 200);
}

document.querySelectorAll('.product-card').forEach(card => {
  const btn = card.querySelector('.add-to-cart');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const name = card.querySelector('h3').textContent.trim();
    const price = parseFloat(card.dataset.price);
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ name, price, qty: 1 });
    updateCart();
    showToast("Sepete eklendi ✅");
    animateBadge();
  });
});

function updateCart(){
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
    if (!cart.length) { 
      alert('Sepetiniz boş!'); 
      return; 
    }
    window.open("https://www.shopier.com/yasemincrochetworld", "_blank");
  });
}

// ================== SLIDER ==================
document.addEventListener("DOMContentLoaded", function () {
  const sliders = document.querySelectorAll(".slider");

  sliders.forEach(slider => {
    let images = slider.querySelectorAll("img");
    let currentIndex = 0;

    const showImage = (index) => {
      images.forEach(img => img.classList.remove("active"));
      images[index].classList.add("active");
    };

    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
      });

      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
      });
    }

    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }, 4000);
  });
});

// ================== ÜRÜN DETAY MODAL ==================
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

document.querySelectorAll(".product-card").forEach(card => {
  const detailsBtn = card.querySelector(".details-btn");
  if (!detailsBtn) return;

  detailsBtn.addEventListener("click", () => {
    modalTitle.textContent = card.querySelector("h3").textContent.trim();
    modalDesc.textContent  = card.querySelector("p").textContent.trim();
    modalPrice.textContent = card.querySelector(".price").textContent.trim();

    slidesContainer.innerHTML = "";
    modalImages = card.querySelectorAll(".slider img");
    modalImages.forEach((img, i) => {
      const clone = img.cloneNode();
      clone.classList.toggle("active", i === 0);
      slidesContainer.appendChild(clone);
    });

    currentSlide = 0;
    modal.classList.add("active");
  });
});

if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("active"));
if (modal) modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("active");
});

function showSlide(n) {
  const imgs = slidesContainer.querySelectorAll("img");
  imgs.forEach(img => img.classList.remove("active"));
  imgs[n].classList.add("active");
}
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

/* =========================
   Favoriler Paneli
========================= */
const favToggle = document.getElementById("favToggle");
const favPanel = document.querySelector(".favorites-panel");
const favOverlay = document.querySelector(".fav-overlay");
const closeFav = document.querySelector(".close-fav");
const favCount = document.querySelector(".fav-count");
const favList = document.querySelector(".favorites-list");

let favorites = [];

// Paneli açma
favToggle.addEventListener("click", () => {
  favPanel.classList.add("active");
  favOverlay.classList.add("active");
});

// Paneli kapatma
closeFav.addEventListener("click", () => {
  favPanel.classList.remove("active");
  favOverlay.classList.remove("active");
});
favOverlay.addEventListener("click", () => {
  favPanel.classList.remove("active");
  favOverlay.classList.remove("active");
});
// Ürünleri favorilere ekleme
document.querySelectorAll(".product-card").forEach(card => {
  const favBtn = card.querySelector(".fav-btn"); // artık mevcut butonu alıyoruz
  if (!favBtn) return;

  favBtn.addEventListener("click", () => {
    const title = card.querySelector("h3").innerText;

    if (favorites.includes(title)) {
      favorites = favorites.filter(item => item !== title);
      favBtn.classList.remove("active");
      favBtn.innerHTML = "🤍"; // boş kalp
    } else {
      favorites.push(title);
      favBtn.classList.add("active");
      favBtn.innerHTML = "❤️"; // dolu kalp
    }

    updateFavorites();
  });
});
function updateFavorites() {
  favList.innerHTML = ""; // önce listeyi sıfırla
  favorites.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    favList.appendChild(li);
  });
  favCount.textContent = favorites.length; // favori sayısını güncelle
}

// İletişim Formu + Başarı/Hata Mesajı (fade-out ile)
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Buraya kendi Service ID ve Template ID’ni yaz
    emailjs.sendForm("service_p9lhd2g", "template_9s3t91e", this)
      .then(() => {
        formMessage.textContent = "Mesajınız başarıyla gönderildi ✅";
        formMessage.className = "form-message success";

        contactForm.reset();

        // 2.5 sn sonra fade-out başlasın
        setTimeout(() => {
          formMessage.classList.add("fade-out");
        }, 2500);

        // 3.3 sn sonra tamamen gizlensin
        setTimeout(() => {
          formMessage.className = "form-message";
          formMessage.textContent = "";
        }, 3300);
      })
      .catch(() => {
        formMessage.textContent = "Mesaj gönderilirken hata oluştu ❌";
        formMessage.className = "form-message error";

        setTimeout(() => {
          formMessage.classList.add("fade-out");
        }, 2500);

        setTimeout(() => {
          formMessage.className = "form-message";
          formMessage.textContent = "";
        }, 3300);
      });
  });
}
// ---- Yorumlar: Kaydet & Listele ----
const reviewList = document.getElementById("reviewList");
const reviewForm = document.getElementById("reviewForm");
const reviewMessageBox = document.getElementById("reviewMessageBox");

// Basit HTML kaçış (XSS'e karşı güvenlik)
const escapeHTML = (s) =>
  s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

// Basit hız limiti (aynı cihazdan art arda göndermeyi yavaşlatma)
const RATE_LIMIT_MS = 10000; // 10 saniye

if (reviewForm && window.db) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("reviewName");
    const msgEl  = document.getElementById("reviewMessage");
    const name = nameEl.value.trim();
    const message = msgEl.value.trim();

    // Basit doğrulama
    if (name.length < 2 || message.length < 5) {
      reviewMessageBox.textContent = "Lütfen adınızı ve yorumunuzu biraz daha detaylandırın.";
      reviewMessageBox.className = "form-message error";
      setTimeout(() => reviewMessageBox.classList.add("fade-out"), 2500);
      setTimeout(() => { reviewMessageBox.className = "form-message"; reviewMessageBox.textContent = ""; }, 3300);
      return;
    }

    // Rate limit kontrolü
    const last = Number(localStorage.getItem("lastReviewTime") || "0");
    if (Date.now() - last < RATE_LIMIT_MS) {
      reviewMessageBox.textContent = "Çok hızlı gidiyorsunuz, lütfen birkaç saniye bekleyin 😊";
      reviewMessageBox.className = "form-message error";
      setTimeout(() => reviewMessageBox.classList.add("fade-out"), 2500);
      setTimeout(() => { reviewMessageBox.className = "form-message"; reviewMessageBox.textContent = ""; }, 3300);
      return;
    }

    // Butonu devre dışı bırak
    const btn = reviewForm.querySelector("button[type='submit']");
    btn.disabled = true;

    try {
      await window.db.collection("reviews").add({
        name: name,
        message: message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      localStorage.setItem("lastReviewTime", String(Date.now()));
      reviewForm.reset();

      reviewMessageBox.textContent = "Yorumunuz başarıyla kaydedildi ✅";
      reviewMessageBox.className = "form-message success";
      setTimeout(() => reviewMessageBox.classList.add("fade-out"), 2500);
      setTimeout(() => { reviewMessageBox.className = "form-message"; reviewMessageBox.textContent = ""; }, 3300);

    } catch (err) {
      reviewMessageBox.textContent = "Yorum kaydedilirken hata oluştu ❌";
      reviewMessageBox.className = "form-message error";
      setTimeout(() => reviewMessageBox.classList.add("fade-out"), 2500);
      setTimeout(() => { reviewMessageBox.className = "form-message"; reviewMessageBox.textContent = ""; }, 3300);
    } finally {
      btn.disabled = false;
    }
  });

  // Yorumları canlı listele (en yeni üstte)
  window.db.collection("reviews")
    .orderBy("createdAt", "desc")
    .limit(50)
    .onSnapshot((snapshot) => {
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
// Firestore'dan gelen ürünü ekrana basma (GLOBAL)
window.renderCard = function renderCard(raw) {
  const container = document.querySelector(".product-grid");
  if (!container) return;

  // Alan adlarını normalize et
  const product = {
    name: raw.title || "",
    desc: raw.description || "",
    price: Number(raw.price) || 0,
    images: Array.isArray(raw.images) ? raw.images.slice(0, 5) : [],
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
// --- Slider eventleri ---
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
    setInterval(() => { idx = (idx + 1) % imgs.length; show(idx); }, 4000);
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
if (detailsBtn) {
  detailsBtn.addEventListener("click", () => {
    modalTitle.textContent = product.name;
    modalDesc.textContent  = product.desc;
    modalPrice.textContent = "₺" + product.price.toFixed(2);
    slidesContainer.innerHTML = product.images.map((img, i) =>
      `<img src="${img}" class="${i===0 ? 'active' : ''}">`
    ).join("");
    currentSlide = 0;
    modal.classList.add("active");
  });
}
