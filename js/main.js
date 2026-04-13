const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTop?.classList.add("show");
  } else {
    backToTop?.classList.remove("show");
  }
});

function updateShipping() {
  const cartTotalEl = document.getElementById("cartTotal");
  const shippingCostEl = document.getElementById("shippingCost");
  const finalTotalEl = document.getElementById("finalTotal");
  const shippingMessageEl = document.getElementById("shippingMessage");

  if (!cartTotalEl || !shippingCostEl || !finalTotalEl || !shippingMessageEl) return;

  const cartTotal = parseFloat(cartTotalEl.textContent);

  let shippingCost = 15;
  let message = "Standard shipping applies.";

  if (cartTotal > 600) {
    shippingCost = 0;
    message = "You qualify for free shipping on orders over $600.";
  }

  shippingCostEl.textContent = shippingCost.toFixed(2);
  finalTotalEl.textContent = (cartTotal + shippingCost).toFixed(2);
  shippingMessageEl.textContent = message;
}

document.addEventListener("DOMContentLoaded", updateShipping);