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
  const favBtn = document.createElement("button");
  favBtn.className = "fav-btn";
  favBtn.innerHTML = "❤";

  card.querySelector(".price-line").appendChild(favBtn);

  favBtn.addEventListener("click", () => {
    const title = card.querySelector("h3").innerText;

    if (favorites.includes(title)) {
      // Favoriden çıkar
      favorites = favorites.filter(item => item !== title);
      favBtn.classList.remove("active");
    } else {
      // Favoriye ekle
      favorites.push(title);
      favBtn.classList.add("active");
    }

    updateFavorites();
  });
});

// Favoriler listesini güncelle
function updateFavorites() {
  favList.innerHTML = "";
  favorites.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    favList.appendChild(li);
  });
  favCount.textContent = favorites.length;
}
