// Yıl bilgisini footer'a yaz
document.getElementById('year').textContent = new Date().getFullYear();

// Hamburger menü
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
if (hamburger && menu){
  hamburger.addEventListener('click', () => menu.classList.toggle('active'));
}

// Dark mode toggle
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

// Sepet paneli
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
  cartPanel.setAttribute('aria-hidden','false'); 
};
const closeCart = () => { 
  cartPanel.classList.remove('active'); 
  overlay.classList.remove('active'); 
  cartPanel.setAttribute('aria-hidden','true'); 
};

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

// Sepet verileri
let cart = [];

// Toast bildirimi
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 2500);
}

// Badge animasyonu
function animateBadge(){
  cartCount.style.transform = "scale(1.3)";
  setTimeout(()=> cartCount.style.transform="scale(1)", 200);
}

// Ürünleri sepete ekle
document.querySelectorAll('.product-card').forEach(card => {
  const btn = card.querySelector('.add-to-cart');
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

// Sepeti güncelle
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

  // Buton aksiyonları
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

// Satın alma butonu → Shopier yönlendirme
checkoutBtn.addEventListener('click', () => {
  if (!cart.length) { 
    alert('Sepetiniz boş!'); 
    return; 
  }
  window.open("https://www.shopier.com/yasemincrochetworld", "_blank");
});
// ========== Slider ==========
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

    // Otomatik geçiş (opsiyonel)
    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }, 4000);
  });
});
// ========== Ürün Detay Modal ==========
const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const slidesContainer = modal.querySelector(".slides");
const modalPrev = modal.querySelector(".prev");
const modalNext = modal.querySelector(".next");
const closeBtn = modal.querySelector(".close-btn");

let modalImages = [];
let currentSlide = 0;

// Her ürün için "Detayları Gör" butonuna olay bağla
document.querySelectorAll(".product-card").forEach(card => {
  const detailsBtn = card.querySelector(".details-btn");
  if (!detailsBtn) return;

  detailsBtn.addEventListener("click", () => {
    // Başlık, açıklama, fiyat
    modalTitle.textContent = card.querySelector("h3").textContent.trim();
    modalDesc.textContent  = card.querySelector("p").textContent.trim();
    modalPrice.textContent = card.querySelector(".price").textContent.trim();

    // Modal slider görselleri
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

// Modal kapatma
if (closeBtn) {
  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
}
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("active");
});

// Modal slider kontrol
function showSlide(n) {
  const imgs = slidesContainer.querySelectorAll("img");
  imgs.forEach(img => img.classList.remove("active"));
  imgs[n].classList.add("active");
}
modalPrev.addEventListener("click", () => {
  if (!modalImages.length) return;
  currentSlide = (currentSlide - 1 + modalImages.length) % modalImages.length;
  showSlide(currentSlide);
});
modalNext.addEventListener("click", () => {
  if (!modalImages.length) return;
  currentSlide = (currentSlide + 1) % modalImages.length;
  showSlide(currentSlide);
});
/* ===== Favoriler ===== */
const favButtons = document.querySelectorAll(".fav-btn");
const favoritesPanel = document.querySelector(".favorites-panel");
const favoritesList = document.querySelector(".favorites-list");
const favOverlay = document.querySelector(".fav-overlay");
const closeFav = document.querySelector(".close-fav");

let favorites = [];

// Kalp butonuna tıklayınca çalışır
favButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    const productName = productCard.querySelector("h3").textContent;

    // Favoriye ekleme / çıkarma
    if (!favorites.includes(productName)) {
      favorites.push(productName);
      btn.classList.add("active");
      btn.textContent = "❤️";
    } else {
      favorites = favorites.filter(item => item !== productName);
      btn.classList.remove("active");
      btn.textContent = "🤍";
    }

    renderFavorites();
    openFavorites();
  });
});

// Favoriler listesini ekrana bas
function renderFavorites() {
  favoritesList.innerHTML = "";
  favorites.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    favoritesList.appendChild(li);
  });
}

// Panel aç
function openFavorites() {
  favoritesPanel.classList.add("active");
  favOverlay.classList.add("active");
}

// Panel kapat
function closeFavorites() {
  favoritesPanel.classList.remove("active");
  favOverlay.classList.remove("active");
}

closeFav.addEventListener("click", closeFavorites);
favOverlay.addEventListener("click", closeFavorites);
// ================= FAVORİLER =================
const favToggle = document.getElementById("favToggle");
const favoritesPanel = document.querySelector(".favorites-panel");
const favOverlay = document.querySelector(".fav-overlay");
const closeFav = document.querySelector(".close-fav");
const favCount = document.querySelector(".fav-count");
const favoritesList = document.querySelector(".favorites-list");

let favorites = [];

// Panel aç/kapat
favToggle.addEventListener("click", () => {
  favoritesPanel.classList.add("active");
  favOverlay.classList.add("active");
});

closeFav.addEventListener("click", () => {
  favoritesPanel.classList.remove("active");
  favOverlay.classList.remove("active");
});

favOverlay.addEventListener("click", () => {
  favoritesPanel.classList.remove("active");
  favOverlay.classList.remove("active");
});

// Ürünlere kalp butonu ekleme
document.querySelectorAll(".product-card").forEach(card => {
  const favBtn = document.createElement("button");
  favBtn.classList.add("fav-btn");
  favBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';

  const priceLine = card.querySelector(".price-line");
  if (priceLine) {
    priceLine.appendChild(favBtn);
  }

  favBtn.addEventListener("click", () => {
    const productName = card.querySelector("h3").innerText;

    if (!favorites.includes(productName)) {
      favorites.push(productName);

      const li = document.createElement("li");
      li.textContent = productName;
      favoritesList.appendChild(li);

      favBtn.classList.add("active");
    } else {
      favorites = favorites.filter(item => item !== productName);
      [...favoritesList.children].forEach(li => {
        if (li.textContent === productName) li.remove();
      });
      favBtn.classList.remove("active");
    }

    favCount.textContent = favorites.length;
  });
});
