// ==UserScript==
// @name         KFC+
// @author       y a t s
// @description  1) Message recall with ArrowDown or TAB; 2) Newline insertion with Shift+Enter.
// @version      0.0.1
// @match        https://kiwifarms.*/test-chat
// @match        *://kiwifarmsaaf4t2h7gc3dfc5ojhmqruw2nit3uejrpiagrxeuxiyxcyd.onion/test-chat
// ==/UserScript==

const chatInput = document.getElementById("new-message-input");
const style = chatInput.getAttribute("style") ?? "";
chatInput.setAttribute("style", style + "overflow-y: scroll!important");

const green = "#72ff72";

var lastSent = "";

chatInput.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "Enter":
      if (e.shiftKey) {
        e.stopImmediatePropagation();
        const range = chatInput.getRangeAt(0);
        range.insertNode(new Text("\n"));

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
