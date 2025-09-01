// DARK MODE
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

// LocalStorage'dan kontrol et
if (localStorage.getItem("dark-mode") === "enabled") {
  body.classList.add("dark-mode");
}

darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "enabled");
  } else {
    localStorage.setItem("dark-mode", "disabled");
  }
});

// HAMBURGER MENÜ
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// SEPET SİSTEMİ
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

let cart = [];

// Sepet panelini aç/kapat
cartToggle.addEventListener("click", () => {
  cartPanel.classList.toggle("active");
});

// "Sepete Ekle" butonlarını yakala
const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const productCard = button.parentElement;
    const productName = productCard.querySelector("h3").innerText;
    const productPrice = parseFloat(
      productCard.querySelector("span").innerText.replace("₺", "").replace(",", ".")
    );

    const existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    updateCart();
  });
});

// Sepeti güncelle
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ₺${item.price.toFixed(2)} x ${item.quantity}
      <button class="decrease" data-index="${index}">-</button>
      <button class="increase" data-index="${index}">+</button>
      <button class="remove" data-index="${index}">x</button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.innerText = `₺${total.toFixed(2)}`;
  cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Butonlara event ekle
  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", () => {
      cart[btn.dataset.index].quantity++;
      updateCart();
    });
  });

  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", () => {
      if (cart[btn.dataset.index].quantity > 1) {
        cart[btn.dataset.index].quantity--;
      } else {
        cart.splice(btn.dataset.index, 1);
      }
      updateCart();
    });
  });

  document.querySelectorAll(".remove").forEach(btn => {
    btn.addEventListener("click", () => {
      cart.splice(btn.dataset.index, 1);
      updateCart();
    });
  });
}

// Satın al butonu
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Sepetiniz boş!");
  } else {
    alert("Satın alma işlemi başlatılıyor...");
    cart = [];
    updateCart();
    cartPanel.classList.remove("active");
  }
});
