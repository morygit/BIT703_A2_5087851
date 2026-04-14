// ==============================
// BACK TO TOP BUTTON
// ==============================
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 300 ? "block" : "none";
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


// ==============================
// SHOP PAGE - PRICE SLIDER
// ==============================
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");

if (priceRange && priceValue) {
  priceRange.addEventListener("input", () => {
    priceValue.textContent = `$${priceRange.value}`;
  });
}


// ==============================
// PRODUCT PAGE - QUANTITY FIX
// ==============================
const qtyInput = document.getElementById("qty");

if (qtyInput) {
  qtyInput.addEventListener("input", () => {
    if (qtyInput.value < 1) qtyInput.value = 1;
  });
}


// ==============================
// CART PAGE
// ==============================
function updateCart() {
  let subtotal = 0;

  document.querySelectorAll("tbody tr").forEach(row => {
    const price = parseFloat(row.children[1].innerText.replace("$", ""));
    const qty = row.querySelector(".quantity").value;

    const total = price * qty;
    row.querySelector(".item-total").innerText = "$" + total;

    subtotal += total;
  });

  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  if (subtotalEl && totalEl) {
    subtotalEl.innerText = "$" + subtotal;
    totalEl.innerText = "$" + (subtotal + 20);
  }
}

document.querySelectorAll(".quantity").forEach(input => {
  input.addEventListener("input", updateCart);
});

document.querySelectorAll(".remove-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.target.closest("tr").remove();
    updateCart();
  });
});


// ==============================
// PAYMENT PAGE
// ==============================
const paymentForm = document.getElementById("paymentForm");

if (paymentForm) {
  paymentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (paymentForm.checkValidity()) {
      alert("Payment submitted successfully!");
    }

    paymentForm.classList.add("was-validated");
  });
}


// ==============================
// SHIPPING LOGIC
// ==============================

const shippingSubtotal = document.getElementById("subtotal");
const shippingCost = document.getElementById("shippingCost");
const total = document.getElementById("total");
const message = document.getElementById("shippingMessage");

if (shippingSubtotal && shippingCost && total) {

  // Example subtotal (can come from cart later)
  let subtotalValue = 500;

  let shipping = 20;

  if (subtotalValue > 600) {
    shipping = 0;
    message.textContent = "🎉 You got FREE shipping!";
  } else {
    message.textContent = "Spend over $600 to get free shipping.";
  }

  shippingCost.textContent = "$" + shipping;
  total.textContent = "$" + (subtotalValue + shipping);
}