// ==UserScript==
// @name         KFC+
// @author       y a t s
// @description  Chyat, but with +.
// @downloadURL  https://github.com/y-a-t-s/KFC-Plus/raw/refs/heads/master/kfc-plus.js
// @homepageURL  https://github.com/y-a-t-s/KFC-Plus
// @version      0.2.0
// @match        https://kiwifarms.*/test-chat
// @match        *://kiwifarmsaaf4t2h7gc3dfc5ojhmqruw2nit3uejrpiagrxeuxiyxcyd.onion/test-chat
// @run-at       document-start
// ==/UserScript==

const green = "#72ff72";

// == Options ==

const autoGreentext = true;
const fixMemLeak = true;
const hideUserList = true;
const scrollInput = true;

// =============

var lastSent = "";

// Add style to element.
function addStyle(elem, rule) {
  const style = elem.getAttribute("style") ?? "";
  if (!rule.endsWith(";"))
    rule += ";";

  elem.setAttribute("style", style + rule);
}

// See here: https://kiwifarms.st/threads/sneedchat-complaint-thread.120982/post-23530505
function patchLeak() {
  const t = document.querySelector("template#tmp-chat-user");
  t.innerHTML = `<div class="activity"><a class="avatar" aria-hidden="true" src="" alt=""></a><a class="user"></a></div>`;
}

// A weird hack to unescape ampersand characters.
function unEsc(str) {
  var txt = document.createElement("textarea");
  txt.innerHTML = str;

  return txt.value;
}

document.addEventListener("DOMContentLoaded", (e) => {
  const chatInput = document.querySelector("#new-message-input");

  function applyMods(msg) {
    // msg[0] is undefined if msg is empty.
    switch (msg[0]) {
    case "\\":
      msg = msg.replace("\\", "");
      break;
    case ">":
      if (autoGreentext)
        msg = `[color=${green}]` + msg;

      break;
    }

    return msg;
  }

  function enableInputScroll() {
    addStyle(chatInput, "overflow-y: auto!important");
  }

  function hideUsers() {
    addStyle(document.querySelector("div#chat-activity-scroller"), "display: none;");
  }

  if (fixMemLeak)
    patchLeak();

  if (hideUserList)
    hideUsers();

  if (scrollInput)
    enableInputScroll();

  chatInput.addEventListener("keydown", (e) => {
    switch (e.key) {
    case "Enter":
      if (e.shiftKey) {
        e.stopImmediatePropagation();
        chatInput.getRangeAt(0).insertNode(new Text("\n"));

        return;
      }

      var msg = applyMods(chatInput.innerText);
      if (!msg)
        return;

      chatInput.innerHTML = msg;
      lastSent = msg;

      break;
    case "Tab":
      // Stop focus from shifting away.
      e.preventDefault();
    case "ArrowDown":
      switch (chatInput.innerText) {
      case "":
      case "\n": // Sometimes an invisible <br> appears in the input field when empty. idk why.
        chatInput.innerHTML = lastSent;
      }

      break;
    }
  }, {capture: true});
});
