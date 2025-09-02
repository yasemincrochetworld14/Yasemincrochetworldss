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
// Favoriler Paneli
const favToggle = document.getElementById('favToggle');
const favClose = document.getElementById('favClose');
const favPanel = document.getElementById('favPanel');
const favItems = document.getElementById('favItems');
const favCount = document.getElementById('favCount');
const favShopBtn = document.getElementById('favShopBtn');

let favorites = [];

const openFav = () => { 
  favPanel.classList.add('active'); 
  overlay.classList.add('active'); 
  favPanel.setAttribute('aria-hidden','false'); 
};
const closeFav = () => { 
  favPanel.classList.remove('active'); 
  overlay.classList.remove('active'); 
  favPanel.setAttribute('aria-hidden','true'); 
};

favToggle.addEventListener('click', openFav);
favClose.addEventListener('click', closeFav);
overlay.addEventListener('click', () => {
  closeFav();
  closeCart();
});

// Favori ürünleri güncelle
function updateFav(){
  favItems.innerHTML = '';
  favorites.forEach((name, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${name}</span>
      <button data-i="${idx}" data-act="rm" title="Kaldır">x</button>
    `;
    favItems.appendChild(li);
  });
  favCount.textContent = favorites.length;

  favItems.querySelectorAll('button').forEach(btn => {
    const i = +btn.dataset.i;
    btn.addEventListener('click', () => {
      favorites.splice(i,1);
      updateFav();
    });
  });
}

// Favori butonlarına tıklama → listeye ekle/çıkar
document.querySelectorAll('.product-card').forEach(card => {
  const favBtn = card.querySelector('.favorite-btn');
  const name = card.querySelector('h3').textContent.trim();
  favBtn.addEventListener('click', () => {
    if (favBtn.classList.contains('active')) {
      if (!favorites.includes(name)) favorites.push(name);
    } else {
      favorites = favorites.filter(n => n !== name);
    }
    updateFav();
  });
});

// Shopier yönlendirme
favShopBtn.addEventListener('click', () => {
  if (!favorites.length) {
    alert('Hiç favoriniz yok!');
    return;
  }
  window.open("https://www.shopier.com/yasemincrochetworld", "_blank");
});
