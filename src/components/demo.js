// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2026-07-21
// @description  try to take over the world!
// @author       You
// @match        https://arbpay.cc/#/buy/arb
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arbpay.cc
// @grant        none
// ==/UserScript==
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2026-04-17
// @description  try to take over the world!
// @author       You
// @match        https://www.tampermonkey.net/index.php?version=5.4.1&ext=iikm&updated=true
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const PRICE_SELECTOR = '.amount';
    const BUTTON_SELECTOR = '.van-button__text';

    let isBusy = false;
    let statusBox = null;

    function ensureStatusBox() {
        if (statusBox && document.body.contains(statusBox)) return;
        if (!document.body) return;

        if (!statusBox) {
            statusBox = document.createElement('div');
            statusBox.style.cssText = "position:fixed; bottom:10px; right:10px; padding:8px 12px; background:#222; color:#fff; z-index:9999999; font-size:12px; border-radius:4px; font-weight:bold; border: 1px solid #555;";
        }
        document.body.appendChild(statusBox);
        statusBox.innerText = "System Active";
    }

    function updateStatus(msg, color) {
        ensureStatusBox();
        if (statusBox) {
            statusBox.innerText = msg;
            if (color) statusBox.style.background = color;
        }
    }

    function scanAndClick() {
        ensureStatusBox();
        if (isBusy) return;

        let priceElements = document.querySelectorAll(PRICE_SELECTOR);

        if (priceElements.length === 0) {
            updateStatus("Waiting...", "#333");
        } else {
            updateStatus(`Scanning (${priceElements.length})...`, "#004400");
        }

        for (let priceEl of priceElements) {
            let rawText = priceEl.innerText;
            let price = parseFloat(rawText.replace(/[^0-9.]/g, ''));

            if (price === 1000 || (price >= 1500 && price <= 2000)) {

                isBusy = true;

                updateStatus(`Processing...`, 'orange');

                setTimeout(() => {
                    let card = priceEl.closest('.van-cell') ||
                        priceEl.parentElement.parentElement.parentElement;

                    if (card) {
                        let buyBtn = card.querySelector(BUTTON_SELECTOR);
                        if (buyBtn) {
                            buyBtn.click();
                            if (buyBtn.parentElement) buyBtn.parentElement.click();

                            updateStatus("Executing...", "blue");

                            setTimeout(() => {
                                isBusy = false;
                                updateStatus("Ready", "green");
                            }, 1);
                        }
                    } else {
                        isBusy = false;
                    }
                }, 1);

                return;
            }
        }
    }

    setInterval(scanAndClick, 1);

})();