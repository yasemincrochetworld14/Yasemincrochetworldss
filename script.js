// script.js

// Dark mode toggle
const darkToggle = document.getElementById("darkToggle");
darkToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Hamburger menu
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
hamburger?.addEventListener("click", () => {
  menu.classList.toggle("open");
});

// Yıl güncelle
document.getElementById("year").textContent = new Date().getFullYear();

// Ürün kartları -> yeni sekme açma
document.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("click", () => {
    const productData = {
      id: card.dataset.id,
      name: card.dataset.name,
      price: card.dataset.price,
      desc: card.dataset.desc,
      returns: card.dataset.returns,
      size: card.dataset.size,
      images: card.dataset.images.split(",")
    };

    // Yeni sekmede ürün detay sayfası aç
    const detailWindow = window.open("", "_blank");
    detailWindow.document.write(`
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${productData.name} - Yasemin Crochet World</title>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body class="product-detail-page">
        <header class="detail-header">
          <h1>${productData.name}</h1>
          <a href="index.html" class="btn">← Ana Sayfa</a>
        </header>

        <section class="product-detail">
          <div class="image-gallery">
            ${productData.images.map(img => `<img src="${img}" alt="${productData.name}" loading="lazy">`).join("")}
          </div>
          <div class="detail-info">
            <h2>${productData.name}</h2>
            <p class="price">₺${productData.price},00</p>
            <p>${productData.desc}</p>
            <p><strong>Beden / Ölçü:</strong> ${productData.size}</p>
            <p><strong>İade Koşulları:</strong> ${productData.returns}</p>
          </div>
        </section>

        <footer class="site-footer">
          <p>© ${new Date().getFullYear()} Yasemin Crochet World</p>
        </footer>
      </body>
      </html>
    `);
    detailWindow.document.close();
  });
});
