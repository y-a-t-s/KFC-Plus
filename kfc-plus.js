// ==UserScript==
// @name         KFC+
// @author       y a t s
// @description  Chyat, but with +.
// @downloadURL  https://github.com/y-a-t-s/KFC-Plus/raw/refs/heads/master/kfc-plus.js
// @homepageURL  https://github.com/y-a-t-s/KFC-Plus
// @version      0.1.0
// @match        https://kiwifarms.*/test-chat
// @match        *://kiwifarmsaaf4t2h7gc3dfc5ojhmqruw2nit3uejrpiagrxeuxiyxcyd.onion/test-chat
// ==/UserScript==

const chatInput = document.getElementById("new-message-input");
const style = chatInput.getAttribute("style") ?? "";
chatInput.setAttribute("style", style + "overflow-y: auto!important");

const green = "#72ff72";

var lastSent = "";

chatInput.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "Enter":
      if (e.shiftKey) {
        e.stopImmediatePropagation();
        chatInput.getRangeAt(0).insertNode(new Text("\n"));

        return;
      }

      var msg = chatInput.innerText;
      if (msg === "")
        return;

      switch (msg[0]) {
        case "\\":
          msg = msg.replace("\\", "");
          break;
        case ">":
          msg = `[color=${green}]` + msg;
          break;
      }

      chatInput.innerHTML = msg;
      lastSent = msg;

      break;
    case "Tab":
      e.preventDefault();
    case "ArrowDown":
      switch (chatInput.innerText) {
        case "":
        case "\n":
          chatInput.innerHTML = lastSent;
      }

      break;
  }
}, { capture: true });
