// ==UserScript==
// @name         KFC+
// @author       y a t s
// @description  Chyat, but with +.
// @downloadURL  https://github.com/y-a-t-s/KFC-Plus/raw/refs/heads/master/kfc-plus.js
// @homepageURL  https://github.com/y-a-t-s/KFC-Plus
// @version      0.2.1
// @match        https://kiwifarms.*/test-chat
// @match        *://kiwifarmsaaf4t2h7gc3dfc5ojhmqruw2nit3uejrpiagrxeuxiyxcyd.onion/test-chat
// @run-at       document-start
// ==/UserScript==

const green = "#72ff72";

// User config
const config = {
  autoGreentext: true,
  fixMemLeak: true,
  hideUserList: true,
  scrollInput: true
};

// Text replacement pairs for outgoing messages.
const replacements = [];

const Utils = (() => {
  // Add style to element.
  function addStyle(elem, rule) {
    const style = elem.getAttribute("style") ?? "";
    if (!rule.endsWith(";"))
      rule += ";";

    elem.setAttribute("style", style + rule);
  }

  // A weird hack to unescape ampersand characters in raw messages.
  // Currently unused, but will be used soon.
  var txtArea = document.createElement("textarea");
  function unEsc(str) {
    txtArea.innerHTML = str;
    return txtArea.value;
  }

  return {
    addStyle,
    unEsc
  };
})();

// See here: https://kiwifarms.st/threads/sneedchat-complaint-thread.120982/post-23530505
function patchLeak() {
  const userTemplate = document.querySelector("template#tmp-chat-user");
  userTemplate.content.querySelector("img.avatar").outerHTML = `<a class="avatar" src="" style="display: none;"></a>`;
}

const MsgInput = (() => {
  const chatInput = document.querySelector("#new-message-input");
  if (!chatInput)
    return null;

  function doReplace() {
    if (!replacements.length)
      return msg;

    var msg = getText();
    if (!msg)
      return msg;

    replacements.forEach((r) => {
      msg = msg.replaceAll(r[0], r[1]);
    });

    setText(msg);
    return msg;
  }

  function autoGT() {
    var msg = getText();
    if (!msg)
      return msg;

    switch (msg[0]) {
    case "\\":
      msg = msg.replace("\\", "");
      break;
    case ">":
      msg = `[color=${green}]` + msg;
      break;
    }

    setText(msg);
    return msg;
  }

  function enableScroll() {
    Utils.addStyle(chatInput, "overflow-y: auto!important");
  }

  function getText() {
    return chatInput.innerText;
  }

  function setText(msg) {
    chatInput.innerHTML = msg;
  }

  return {
    node: chatInput,
    autoGT,
    doReplace,
    enableScroll,
    getText,
    setText
  };
});

document.addEventListener("DOMContentLoaded", (e) => {
  const input = MsgInput();
  var lastSent = "";

  function hideUserList() {
    const userPane = document.querySelector("div#chat-activity-scroller");
    Utils.addStyle(userPane, "display: none;");
  }

  if (config.fixMemLeak)
    patchLeak();

  if (config.hideUserList)
    hideUserList();

  if (config.scrollInput)
    input.enableScroll();

  input.node.addEventListener("keydown", (e) => {
    switch (e.key) {
    case "Enter":
      if (e.shiftKey) {
        e.stopImmediatePropagation();

        const sel = window.getSelection();
        sel.getRangeAt(0).insertNode(new Text("\n"));

        return;
      }

      if (config.autoGreentext)
        input.autoGT();

      const msg = input.getText();
      if (!msg)
        return;

      lastSent = msg;

      break;
    case "Tab":
      // Stop focus from shifting away.
      e.preventDefault();
      input.doReplace();

      break;
    case "ArrowDown":
      var contents = input.getText();
      switch (contents) {
      case "":
      case "\n": // Sometimes an invisible <br> appears in the input field when empty. idk why.
        input.setText(lastSent);
      }

      break;
    }
  }, {capture: true});
});
