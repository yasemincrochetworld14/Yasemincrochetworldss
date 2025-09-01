// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

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

// Sepet sistemi
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const cartItemsList = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

let cart = [];

// Sepet panelini aç/kapat
cartToggle.addEventListener("click", () => {
  cartPanel.classList.toggle("active");
});

// Sepete ekle
document.querySelectorAll(".add-to-cart").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const productCard = btn.closest(".product-card");
    const name = productCard.querySelector("h3").innerText;
    const price = parseFloat(
      productCard.querySelector("span").innerText.replace("₺", "")
    );

    addToCart({ name, price, quantity: 1 });
  });
});

// Sepete ürün ekleme
function addToCart(product) {
  const existing = cart.find((item) => item.name === product.name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push(product);
  }
  renderCart();
}

// Sepeti görüntüleme
function renderCart() {
  cartItemsList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} (${item.quantity} adet)</span>
      <div>
        <button onclick="decreaseQuantity(${index})">-</button>
        <button onclick="increaseQuantity(${index})">+</button>
        <button onclick="removeFromCart(${index})">Sil</button>
      </div>
    `;
    cartItemsList.appendChild(li);
  });

  cartTotal.innerText = "₺" + total;
}

// Sepetten silme
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Adet azalt
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  renderCart();
}

// Adet artır
function increaseQuantity(index) {
  cart[index].quantity++;
  renderCart();
}

// Satın al
checkoutBtn.addEventListener("click", () => {
  window.open("https://www.shopier.com/yasemincrochetworld", "_blank");
});
