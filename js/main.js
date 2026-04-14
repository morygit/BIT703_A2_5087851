document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("backToTop");

  function toggleBackToTop() {
    if (!backToTop) return;

    if (window.scrollY > 250) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", toggleBackToTop);
  toggleBackToTop();
});


const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");

if (priceRange && priceValue) {
  priceRange.addEventListener("input", () => {
    priceValue.textContent = `$${priceRange.value}`;
  });
}


const qtyInput = document.getElementById("qty");

if (qtyInput) {
  qtyInput.addEventListener("input", () => {
    if (qtyInput.value === "" || parseInt(qtyInput.value, 10) < 1) {
      qtyInput.value = 1;
    }
  });
}



// CART CALCULATION
function updateCart() {
  let subtotal = 0;

  document.querySelectorAll("tbody tr").forEach(row => {
    const price = parseFloat(row.children[1].innerText.replace("$", ""));
    const qty = row.querySelector(".quantity").value;

    const total = price * qty;
    row.querySelector(".item-total").innerText = "$" + total;

    subtotal += total;
  });

  document.getElementById("subtotal").innerText = "$" + subtotal;
  document.getElementById("total").innerText = "$" + (subtotal + 20);
}

// quantity change
document.querySelectorAll(".quantity").forEach(input => {
  input.addEventListener("input", updateCart);
});

// remove item
document.querySelectorAll(".remove-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.target.closest("tr").remove();
    updateCart();
  });
});


const paymentForm = document.getElementById("paymentForm");
const creditCardOption = document.getElementById("creditCard");
const paypalOption = document.getElementById("paypal");
const bankTransferOption = document.getElementById("bankTransfer");
const cardDetails = document.getElementById("cardDetails");

function toggleCardDetails() {
  if (!cardDetails || !creditCardOption) return;

  if (creditCardOption.checked) {
    cardDetails.style.display = "block";
  } else {
    cardDetails.style.display = "none";
  }
}

[creditCardOption, paypalOption, bankTransferOption].forEach(option => {
  if (option) {
    option.addEventListener("change", toggleCardDetails);
  }
});

toggleCardDetails();

if (paymentForm) {
  paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const cardNumber = document.getElementById("cardNumber");
    const cvv = document.getElementById("cvv");
    const postcode = document.getElementById("postcode");

    let isValid = paymentForm.checkValidity();

    if (creditCardOption.checked && cardNumber) {
      const cleanedCard = cardNumber.value.replace(/\s/g, "");
      if (!/^\d{16}$/.test(cleanedCard)) {
        cardNumber.classList.add("is-invalid");
        isValid = false;
      } else {
        cardNumber.classList.remove("is-invalid");
        cardNumber.classList.add("is-valid");
      }
    }

    if (creditCardOption.checked && cvv) {
      if (!/^\d{3,4}$/.test(cvv.value)) {
        cvv.classList.add("is-invalid");
        isValid = false;
      } else {
        cvv.classList.remove("is-invalid");
        cvv.classList.add("is-valid");
      }
    }

    if (postcode) {
      if (!/^\d{4}$/.test(postcode.value)) {
        postcode.classList.add("is-invalid");
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