/* FindOrFree — floating "Write us in Telegram" button -> @findorfree_inbox_bot (bot greets in RU/HE/EN). */
(function(){
  var URL="https://t.me/findorfree_inbox_bot?start=site";
  var T={en:"Write in Telegram",ru:"Написать в Telegram",uk:"Написати в Telegram",he:"כתבו לנו בטלגרם",es:"Escríbenos en Telegram",de:"Schreib uns auf Telegram",fr:"Écrivez-nous sur Telegram",it:"Scrivici su Telegram",pt:"Fale conosco no Telegram"};
  var css=".fof-tg{position:fixed;right:16px;bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:60;display:flex;align-items:center;gap:8px;background:#229ED9;color:#fff;font:600 15px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:12px 16px;border-radius:999px;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.35)}"+
    ".fof-tg:hover{background:#1b8cc2}.fof-tg svg{width:22px;height:22px;flex:none}"+
    "html[dir=rtl] .fof-tg{right:auto;left:16px}"+
    "@media(max-width:700px){.fof-tg{bottom:calc(84px + env(safe-area-inset-bottom,0px));padding:12px}.fof-tg span{display:none}}";
  function lang(){var l=(document.documentElement.lang||"en").slice(0,2).toLowerCase();return T[l]?l:"en";}
  function init(){
    var s=document.createElement("style");s.textContent=css;document.head.appendChild(s);
    var a=document.createElement("a");a.className="fof-tg";a.href=URL;a.target="_blank";a.rel="noopener";
    a.innerHTML='<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M9.8 15.2l-.4 5.3c.6 0 .8-.3 1.1-.6l2.7-2.5 5.5 4c1 .6 1.7.3 2-.9l3.6-16.9c.3-1.5-.6-2.1-1.6-1.7L1.5 9.9c-1.4.6-1.4 1.4-.2 1.8l5.4 1.7L19.1 5.5c.6-.4 1.1-.2.7.2z"/></svg><span></span>';
    function set(){var t=T[lang()];a.querySelector("span").textContent=t;a.setAttribute("aria-label",t);a.title=t;}
    set();document.body.appendChild(a);
    new MutationObserver(set).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
