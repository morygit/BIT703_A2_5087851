document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // BACK TO TOP BUTTON
  // ==============================
  const backToTop = document.getElementById("backToTop");

  function toggleBackToTop() {
    if (!backToTop) return;

    if (window.scrollY > 250) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  if (backToTop) {
    window.addEventListener("scroll", toggleBackToTop);
    toggleBackToTop();
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
      if (qtyInput.value === "" || parseInt(qtyInput.value, 10) < 1) {
        qtyInput.value = 1;
      }
    });
  }

  // ==============================
  // VIEW PRODUCT (SAVE SELECTED PRODUCT)
  // ==============================
  const viewButtons = document.querySelectorAll(".view-product-btn");

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = {
        name: btn.dataset.name,
        price: btn.dataset.price,
        image: btn.dataset.image,
        description: btn.dataset.description
      };

      localStorage.setItem("selectedProduct", JSON.stringify(product));
    });
  });

  // ==============================
  // LOAD PRODUCT PAGE
  // ==============================
  const productTitle = document.getElementById("productName");
  const productPrice = document.getElementById("productPrice");
  const productImage = document.getElementById("productImage");
  const productDesc = document.getElementById("productDescription");
  const breadcrumbProductName = document.getElementById("breadcrumbProductName");
  const productAddToCartBtn = document.getElementById("productAddToCart");

  if (productTitle && productPrice && productImage && productDesc) {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));

    if (product) {
      productTitle.textContent = product.name;
      productPrice.textContent = `$${parseFloat(product.price).toFixed(2)}`;
      productImage.src = product.image;
      productImage.alt = product.name;
      productDesc.textContent = product.description;

      if (breadcrumbProductName) {
        breadcrumbProductName.textContent = product.name;
      }

      if (productAddToCartBtn) {
        productAddToCartBtn.dataset.name = product.name;
        productAddToCartBtn.dataset.price = product.price;
        productAddToCartBtn.dataset.image = product.image;
      }
    }
  }

  // ==============================
  // ADD TO CART FROM SHOP PAGE
  // ==============================
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);
      const image = button.dataset.image;

      let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingItem = cart.find((item) => item.name === name);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          name: name,
          price: price,
          image: image,
          quantity: 1
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(cart));
    });
  });

  // ==============================
  // ADD TO CART FROM PRODUCT PAGE WITH QTY
  // ==============================
  if (productAddToCartBtn) {
    productAddToCartBtn.addEventListener("click", () => {
      const name = productAddToCartBtn.dataset.name;
      const price = parseFloat(productAddToCartBtn.dataset.price);
      const image = productAddToCartBtn.dataset.image;

      const qtyField = document.getElementById("qty");
      const quantity = qtyField ? parseInt(qtyField.value, 10) || 1 : 1;

      let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingItem = cart.find((item) => item.name === name);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          name: name,
          price: price,
          image: image,
          quantity: quantity
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(cart));
      window.location.href = "cart.html";
    });
  }

  // ==============================
  // RENDER CART
  // ==============================
  function renderCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    if (!cartItemsContainer) return;

    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4">Your cart is empty.</td>
        </tr>
      `;

      const subtotalEl = document.getElementById("subtotal");
      const cartShippingEl = document.getElementById("cartShipping");
      const totalEl = document.getElementById("total");

      if (subtotalEl) subtotalEl.innerText = "$0.00";
      if (cartShippingEl) cartShippingEl.innerText = "$0.00";
      if (totalEl) totalEl.innerText = "$0.00";

      localStorage.setItem("cartSubtotal", "0.00");
      localStorage.setItem("shippingCost", "0.00");
      localStorage.setItem("cartTotal", "0.00");
      return;
    }

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="cart-product-cell">
          <div class="d-flex align-items-center gap-3">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-product-info">
              <p class="cart-product-name mb-0">${item.name}</p>
            </div>
          </div>
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <input
            type="number"
            value="${item.quantity}"
            min="1"
            class="form-control quantity-input"
            data-index="${index}"
            style="width:70px;"
          >
        </td>
        <td class="item-total">$${itemTotal.toFixed(2)}</td>
        <td>
          <button class="btn btn-danger btn-sm remove-item-btn" data-index="${index}">X</button>
        </td>
      `;
      cartItemsContainer.appendChild(row);
    });

    updateCartTotals();
  }

  // ==============================
  // UPDATE CART TOTALS
  // Cart page shows subtotal only.
  // Shipping is selected later on shipping page.
  // ==============================
function updateCartTotals() {
  let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let tax = subtotal * 0.15;
  let total = subtotal + tax;

  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");

  if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.innerText = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;

  localStorage.setItem("cartSubtotal", subtotal.toFixed(2));
  localStorage.setItem("cartTax", tax.toFixed(2));
  localStorage.setItem("cartTotal", total.toFixed(2));
}

  // ==============================
  // CART EVENTS
  // ==============================
  document.addEventListener("input", (e) => {
    if (e.target.classList.contains("quantity-input")) {
      let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const index = parseInt(e.target.dataset.index, 10);
      let qty = parseInt(e.target.value, 10);

      if (isNaN(qty) || qty < 1) qty = 1;

      if (cart[index]) {
        cart[index].quantity = qty;
        localStorage.setItem("cartItems", JSON.stringify(cart));
        renderCart();
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item-btn")) {
      let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const index = parseInt(e.target.dataset.index, 10);

      cart.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(cart));
      renderCart();
    }
  });

  renderCart();

  // ==============================
  // SHIPPING PAGE SUMMARY
  // ==============================
  const shippingSubtotalEl = document.getElementById("subtotal");
  const shippingCostEl = document.getElementById("shippingCost");
  const shippingTotalEl = document.getElementById("total");
  const shippingMethodInputs = document.querySelectorAll('input[name="shippingMethod"]');
  const freeMsg = document.getElementById("freeShippingMsg");

function updateShippingSummary(selectedMethod = null) {
  if (!shippingSubtotalEl || !shippingCostEl || !shippingTotalEl) return;

  let subtotal = parseFloat(localStorage.getItem("cartSubtotal")) || 0;
  let tax = subtotal * 0.15;
  let shipping = 0;

  const taxEl = document.getElementById("tax");
  const freeMsg = document.getElementById("freeShippingMsg");

  // FREE SHIPPING RULE
  if (subtotal >= 600) {
    shipping = 0;
    if (freeMsg) freeMsg.classList.remove("d-none");
  } else {
    if (freeMsg) freeMsg.classList.add("d-none");

    if (selectedMethod === "nextday") {
      shipping = 20;
    } else {
      shipping = 10;
    }
  }

  let total = subtotal + tax + shipping;

  shippingSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  shippingCostEl.textContent = `$${shipping.toFixed(2)}`;
  shippingTotalEl.textContent = `$${total.toFixed(2)}`;
}

  shippingMethodInputs.forEach((input) => {
    input.addEventListener("change", () => {
      updateShippingSummary(input.value);
    });
  });

  // Show summary on page load
  if (shippingSubtotalEl && shippingCostEl && shippingTotalEl) {
    const checkedMethod = document.querySelector('input[name="shippingMethod"]:checked');
    updateShippingSummary(checkedMethod ? checkedMethod.value : null);
  }

  // ==============================
  // SHIPPING FORM VALIDATION
  // ==============================
  const shippingForm = document.getElementById("shippingForm");

  if (shippingForm) {
    shippingForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const shippingMethods = document.querySelectorAll('input[name="shippingMethod"]');
      const shippingMethodError = document.getElementById("shippingMethodError");

      let selectedShippingMethod = null;
      shippingMethods.forEach((method) => {
        if (method.checked) {
          selectedShippingMethod = method.value;
        }
      });

      let isValid = shippingForm.checkValidity();

      if (!selectedShippingMethod) {
        if (shippingMethodError) shippingMethodError.classList.remove("d-none");
        isValid = false;
      } else {
        if (shippingMethodError) shippingMethodError.classList.add("d-none");
      }

      shippingForm.classList.add("was-validated");

      if (!isValid) return;

      let subtotal = parseFloat(localStorage.getItem("cartSubtotal")) || 0;
      let shipping = 0;
      let shippingMethodLabel = "";

      if (subtotal >= 600) {
        if (selectedShippingMethod === "nextday") {
          shipping = 20;
          shippingMethodLabel = "Next Day Delivery";
        } else {
          shipping = 0;
          shippingMethodLabel = "Free Standard Shipping";
        }
      } else {
        if (selectedShippingMethod === "nextday") {
          shipping = 20;
          shippingMethodLabel = "Next Day Delivery";
        } else {
          shipping = 10;
          shippingMethodLabel = "Standard Shipping";
        }
      }

      let tax = subtotal * 0.15;
      let total = subtotal + tax + shipping;

      localStorage.setItem("shippingMethod", shippingMethodLabel);
      localStorage.setItem("shippingCost", shipping.toFixed(2));
      localStorage.setItem("cartTax", tax.toFixed(2));
      localStorage.setItem("cartTotal", total.toFixed(2));

      window.location.href = "payment.html";
    });
  }

  // ==============================
  // PAYMENT PAGE SUMMARY
  // ==============================
  const paymentSubtotalEl = document.getElementById("paymentSubtotal");
  const paymentTaxEl = document.getElementById("paymentTax");
  const paymentShippingEl = document.getElementById("paymentShipping");
  const paymentTotalEl = document.getElementById("paymentTotal");
  const paymentShippingMethodEl = document.getElementById("paymentShippingMethod");

  if (paymentSubtotalEl && paymentShippingEl && paymentTotalEl) {
    let subtotal = parseFloat(localStorage.getItem("cartSubtotal")) || 0;
    let shipping = parseFloat(localStorage.getItem("shippingCost")) || 0;
    let tax = subtotal * 0.15;
    let total = subtotal + tax + shipping;

    paymentSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    paymentShippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (paymentTaxEl) paymentTaxEl.textContent = `$${tax.toFixed(2)}`;
    paymentTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  if (paymentShippingMethodEl) {
    const shippingMethod = localStorage.getItem("shippingMethod");
    paymentShippingMethodEl.textContent = shippingMethod || "-";
  }

  // ==============================
  // PAYMENT PAGE - CARD DISPLAY
  // ==============================
  const paymentForm = document.getElementById("paymentForm");
  const creditCardOption = document.getElementById("creditCard");
  const paypalOption = document.getElementById("paypal");
  const bankTransferOption = document.getElementById("bankTransfer");
  const cardDetails = document.getElementById("cardDetails");

  function toggleCardDetails() {
    if (!cardDetails || !creditCardOption) return;
    cardDetails.style.display = creditCardOption.checked ? "block" : "none";
  }

  [creditCardOption, paypalOption, bankTransferOption].forEach((option) => {
    if (option) {
      option.addEventListener("change", toggleCardDetails);
    }
  });

  toggleCardDetails();

  // ==============================
  // PAYMENT FORM VALIDATION
  // ==============================
  if (paymentForm) {
    paymentForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const cardNumber = document.getElementById("cardNumber");
      const cvv = document.getElementById("cvv");
      const postcode = document.getElementById("postcode");

      let isValid = paymentForm.checkValidity();

      if (creditCardOption && creditCardOption.checked && cardNumber) {
        const cleanedCard = cardNumber.value.replace(/\s/g, "");
        if (!/^\d{16}$/.test(cleanedCard)) {
          cardNumber.classList.add("is-invalid");
          cardNumber.classList.remove("is-valid");
          isValid = false;
        } else {
          cardNumber.classList.remove("is-invalid");
          cardNumber.classList.add("is-valid");
        }
      }

      if (creditCardOption && creditCardOption.checked && cvv) {
        if (!/^\d{3,4}$/.test(cvv.value)) {
          cvv.classList.add("is-invalid");
          cvv.classList.remove("is-valid");
          isValid = false;
        } else {
          cvv.classList.remove("is-invalid");
          cvv.classList.add("is-valid");
        }
      }

      if (postcode) {
        if (!/^\d{4}$/.test(postcode.value)) {
          postcode.classList.add("is-invalid");
          postcode.classList.remove("is-valid");
          isValid = false;
        } else {
          postcode.classList.remove("is-invalid");
          postcode.classList.add("is-valid");
        }
      }

      paymentForm.classList.add("was-validated");

      if (isValid) {
        alert("Payment submitted successfully.");
      }
    });
  }
});