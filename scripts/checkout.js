import { cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from "../data/deliveryOptions.js";

const today = dayjs();
const deliveryDate = today.add(7, 'days');
console.log(deliveryDate.format('dddd, MMMM D'));

let cartSummaryHTML = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  const matchingProduct = products.find(product => product.id === productId);
  if (!matchingProduct) return;

  const deliveryOptionId = cartItem.deliveryOptionId;
  const deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);
  if (!deliveryOption) return;

  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
  const dateString = deliveryDate.format('dddd, MMMM D');

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}" alt="${matchingProduct.name}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-cart-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-save-input-${matchingProduct.id}" />
            <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option"
           data-product-id="${matchingProduct.id}"
           data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
               ${isChecked ? 'checked' : ''}
               class="delivery-option-input"
               name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString} Shipping</div>
        </div>
      </div>
    `;
  });

  return html;
}

// Render cart summary
const orderSummaryContainer = document.querySelector('.js-order-summary');
if (orderSummaryContainer) {
  orderSummaryContainer.innerHTML = cartSummaryHTML;
}

updateCartQuantity();

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  const quantityElement = document.querySelector('.js-total-cart-quantity');
  if (quantityElement) {
    quantityElement.innerHTML = `${cartQuantity} items`;
  }
}

// Delete
document.querySelectorAll('.js-delete-link').forEach((deleteLink) => {
  deleteLink.addEventListener('click', () => {
    const { productId } = deleteLink.dataset;
    removeFromCart(productId);
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    if (container) container.remove();
    updateCartQuantity();
  });
});

// Update quantity (edit mode)
document.querySelectorAll('.js-update-link').forEach((updateLink) => {
  updateLink.addEventListener('click', () => {
    const { productId } = updateLink.dataset;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    if (container) container.classList.add('is-editing-quantity');
  });
});

// Save quantity
document.querySelectorAll('.js-save-link').forEach((saveLink) => {
  saveLink.addEventListener('click', () => {
    const { productId } = saveLink.dataset;
    const quantityInput = document.querySelector(`.js-quantity-save-input-${productId}`);
    const newQuantity = Number(quantityInput.value);

    if (!newQuantity || newQuantity < 1 || newQuantity >= 1001) {
      return alert('Quantity must be at least 1 and less than 1000.');
    }

    updateQuantity(productId, newQuantity);

    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    if (container) container.classList.remove('is-editing-quantity');

    const quantityLabel = document.querySelector(`.js-cart-quantity-label-${productId}`);
    if (quantityLabel) quantityLabel.innerHTML = newQuantity;

    updateCartQuantity();
  });
});
console.log(cart)

// Delivery option change
document.querySelectorAll('.js-delivery-option').forEach((element) => {
  element.addEventListener('click', () => {
    const { productId, deliveryOptionId } = element.dataset;
    updateDeliveryOption(productId, deliveryOptionId);
  });
});
