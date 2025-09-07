// products.dynamic.js
// Site (index.html) tarafına dinamik ürünleri ekler.
// Not: Görseller /images klasöründe manuel barınır. Firestore'da sadece dosya adlarını tutuyoruz.

(function(){
  // Firestore (index.html içinde window.db olarak set edildi)
  var db = window.db || (firebase && firebase.firestore && firebase.firestore());
  if(!db){
    console.error("Firestore (db) bulunamadı. index.html içinde window.db = firebase.firestore() tanımlı olmalı.");
    return;
  }

  function fmtPrice(n){
    try{
      return "₺" + Number(n || 0).toFixed(2);
    }catch(e){ return "₺" + n; }
  }

  // Kart HTML şablonu
  function renderCard(p){
    var images = Array.isArray(p.images) ? p.images : [];
    if(images.length === 0){
      images = ["placeholder.jpg"]; // fallback
    }
    var html = '';
    html += '<article class="product-card" data-price="'+ (p.price || 0) +'">';
    html += '  <div class="slider">';
    images.forEach(function(fn, i){
      var cls = i === 0 ? ' class="active"' : '';
      html += '    <img src="images/'+ fn +'" alt="'+ (p.title || "") +' '+ (i+1) +'"'+ cls +'>';
    });
    html += '    <span class="prev">&#10094;</span>';
    html += '    <span class="next">&#10095;</span>';
    html += '  </div>';
    html += '  <h3>'+ (p.title || "") +'</h3>';
    html += '  <p>' + (p.description || "") + '</p>';
    html += '  <div class="price-line">';
    html += '    <span class="price">'+ fmtPrice(p.price) +'</span>';
    html += '    <button class="btn add-to-cart">Sepete Ekle</button>';
    html += '    <button class="btn details-btn">Detayları Gör</button>';
    html += '    <button class="fav-btn">🤍</button>';
    html += '  </div>';
    html += '</article>';
    return html;
  }

  function initSlider(slider){
    var images = slider.querySelectorAll("img");
    if(!images.length) return;
    var currentIndex = 0;
    function showImage(i){
      images.forEach(function(img){ img.classList.remove("active"); });
      images[i].classList.add("active");
    }
    var prevBtn = slider.querySelector(".prev");
    var nextBtn = slider.querySelector(".next");
    if(prevBtn && nextBtn){
      prevBtn.addEventListener("click", function(){
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
      });
      nextBtn.addEventListener("click", function(){
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
      });
    }
    setInterval(function(){
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }, 4000);
  }

  function attachInteractions(card){
    // Sepete ekle
    var btn = card.querySelector(".add-to-cart");
    if(btn){
      btn.addEventListener("click", function(){
        try{
          var name  = card.querySelector("h3").textContent.trim();
          var price = parseFloat(card.dataset.price);
          if(typeof updateCart === "function" && typeof showToast === "function"){
            if(typeof cart === "undefined"){ window.cart = []; }
            var existing = cart.find(function(i){ return i.name === name; });
            if(existing) existing.qty += 1;
            else cart.push({ name:name, price:price, qty:1 });
            updateCart();
            if(typeof animateBadge === "function") animateBadge();
            showToast("Sepete eklendi ✅");
          }else{
            alert("Sepete eklendi: " + name);
          }
        }catch(e){
          console.error(e);
        }
      });
    }

    // Detayları gör (modal)
    var details = card.querySelector(".details-btn");
    if(details){
      details.addEventListener("click", function(){
        var modal = document.getElementById("productModal");
        if(!modal){ return; }
        var modalTitle = document.getElementById("modalTitle");
        var modalDesc  = document.getElementById("modalDesc");
        var modalPrice = document.getElementById("modalPrice");
        var slidesContainer = modal.querySelector(".slides");
        var mPrev = modal.querySelector(".prev");
        var mNext = modal.querySelector(".next");

        modalTitle.textContent = card.querySelector("h3").textContent.trim();
        modalDesc.textContent  = card.querySelector("p").textContent.trim();
        modalPrice.textContent = card.querySelector(".price").textContent.trim();

        slidesContainer.innerHTML = "";
        var imgs = card.querySelectorAll(".slider img");
        imgs.forEach(function(img, i){
          var clone = img.cloneNode();
          if(i === 0) clone.classList.add("active");
          slidesContainer.appendChild(clone);
        });

        var mImgs = slidesContainer.querySelectorAll("img");
        var i = 0;
        function show(k){
          mImgs.forEach(function(im){ im.classList.remove("active"); });
          if(mImgs[k]) mImgs[k].classList.add("active");
        }
        if(mPrev && mNext){
          mPrev.onclick = function(){ i = (i - 1 + mImgs.length) % mImgs.length; show(i); };
          mNext.onclick = function(){ i = (i + 1) % mImgs.length; show(i); };
        }

        modal.classList.add("active");
        var closeBtn = modal.querySelector(".close-btn");
        if(closeBtn) closeBtn.onclick = function(){ modal.classList.remove("active"); };
        modal.addEventListener("click", function(e){ if(e.target === modal) modal.classList.remove("active"); });
      });
    }

    var slider = card.querySelector(".slider");
    if(slider) initSlider(slider);
  }

  function loadProducts(){
    var grid = document.querySelector("#kategoriler .product-grid, .products .product-grid");
    if(!grid){
      console.warn("product-grid bulunamadı.");
      return;
    }

    db.collection("products").orderBy("createdAt","desc").get().then(function(ss){
      var html = "";
      ss.forEach(function(doc){
        var p = doc.data();
        if(p && p.active){
          html += renderCard(p);
        }
      });
      var temp = document.createElement("div");
      temp.innerHTML = html;
      Array.from(temp.children).forEach(function(node){
        if(node.classList && node.classList.contains("product-card")){
          grid.appendChild(node);
          attachInteractions(node);
        }
      });
    }).catch(function(err){
      console.error("Ürünleri getirme hatası:", err);
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", loadProducts);
  }else{
    loadProducts();
  }
})();
function attachInteractions(card){
  // Sepete ekle
  var btn = card.querySelector(".add-to-cart");
  if(btn){
    btn.addEventListener("click", function(){
      var name  = card.querySelector("h3").textContent.trim();
      var price = parseFloat(card.dataset.price);
      if(typeof updateCart === "function"){
        if(typeof cart === "undefined"){ window.cart = []; }
        var existing = cart.find(i => i.name === name);
        if(existing) existing.qty += 1;
        else cart.push({ name, price, qty:1 });
        updateCart();
        if(typeof animateBadge === "function") animateBadge();
        if(typeof showToast === "function") showToast("Sepete eklendi ✅");
      }
    });
  }

  // Favorilere ekle / çıkar
var fav = card.querySelector(".fav-btn");
if (fav) {
  var name = card.querySelector("h3").textContent.trim();

  // İlk yüklemede kalp durumunu ayarla
  let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  fav.textContent = favs.includes(name) ? "❤️" : "🤍";

  fav.addEventListener("click", function () {
    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (favs.includes(name)) {
      // ÇIKAR
      favs = favs.filter(i => i !== name);
      fav.textContent = "🤍";
      if (typeof showToast === "function") showToast("Favorilerden çıkarıldı ❌");
    } else {
      // EKLE
      favs.push(name);
      fav.textContent = "❤️";
      if (typeof showToast === "function") showToast("Favorilere eklendi ❤️");
    }

    localStorage.setItem("favorites", JSON.stringify(favs));
  });
}
    });
  }

  // Detayları gör (modal)
  var details = card.querySelector(".details-btn");
  if(details){
    details.addEventListener("click", function(){
      var modal = document.getElementById("productModal");
      if(!modal) return;

      var modalTitle = document.getElementById("modalTitle");
      var modalDesc  = document.getElementById("modalDesc");
      var modalPrice = document.getElementById("modalPrice");
      var slidesContainer = modal.querySelector(".slides");
      var mPrev = modal.querySelector(".prev");
      var mNext = modal.querySelector(".next");

      modalTitle.textContent = card.querySelector("h3").textContent.trim();
      modalDesc.textContent  = card.querySelector("p").textContent.trim();
      modalPrice.textContent = card.querySelector(".price").textContent.trim();

      // resimleri doldur
      slidesContainer.innerHTML = "";
      var imgs = card.querySelectorAll(".slider img");
      imgs.forEach(function(img, i){
        var clone = img.cloneNode();
        if(i === 0) clone.classList.add("active");
        slidesContainer.appendChild(clone);
      });

      // modal slider kontrolü
      var mImgs = slidesContainer.querySelectorAll("img");
      var idx = 0;
      function show(k){
        mImgs.forEach(im => im.classList.remove("active"));
        if(mImgs[k]) mImgs[k].classList.add("active");
      }
      if(mPrev && mNext){
        mPrev.onclick = function(){ idx = (idx - 1 + mImgs.length) % mImgs.length; show(idx); };
        mNext.onclick = function(){ idx = (idx + 1) % mImgs.length; show(idx); };
      }

      modal.classList.add("active");

      var closeBtn = modal.querySelector(".close-btn");
      if(closeBtn) closeBtn.onclick = () => modal.classList.remove("active");
      modal.addEventListener("click", e => { if(e.target === modal) modal.classList.remove("active"); });
    });
  }

  // Slider
  var slider = card.querySelector(".slider");
  if(slider){
    var images = slider.querySelectorAll("img");
    if(images.length){
      var currentIndex = 0;
      function show(i){
        images.forEach(img => img.classList.remove("active"));
        images[i].classList.add("active");
      }
      slider.querySelector(".prev").addEventListener("click", function(){
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        show(currentIndex);
      });
      slider.querySelector(".next").addEventListener("click", function(){
        currentIndex = (currentIndex + 1) % images.length;
        show(currentIndex);
      });
    }
  }
}
