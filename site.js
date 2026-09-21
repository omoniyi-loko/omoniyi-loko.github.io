// ============================================================
// CONFIGURATION : la seule ligne à modifier en semaine 1
// Colle ici l'ID de ton conteneur GTM (format GTM-XXXXXXX).
// Tant que c'est vide, GTM n'est pas chargé mais le dataLayer
// se remplit quand même (visible dans la console : dataLayer).
// ============================================================
var GTM_ID = "";

window.dataLayer = window.dataLayer || [];

// Chargement GTM (équivalent du snippet officiel <head>)
if (GTM_ID) {
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", GTM_ID);
}

// ---------- Outils ----------
function getProduit(id) {
  return window.CATALOGUE.find(function (p) { return p.id === id; });
}
function toItem(p, qte, index) {
  var item = { item_id: p.id, item_name: p.nom, item_brand: p.marque, item_category: p.categorie, price: p.prix, quantity: qte || 1 };
  if (index !== undefined) item.index = index;
  return item;
}
function pushEcommerce(eventName, ecommerce) {
  window.dataLayer.push({ ecommerce: null }); // bonne pratique GA4 : vider l'objet précédent
  window.dataLayer.push({ event: eventName, ecommerce: ecommerce });
}
function euros(n) { return n.toFixed(2).replace(".", ",") + " €"; }

// ---------- Panier (stocké dans le navigateur) ----------
function lirePanier() {
  try { return JSON.parse(localStorage.getItem("panier") || "[]"); } catch (e) { return []; }
}
function ecrirePanier(p) {
  try { localStorage.setItem("panier", JSON.stringify(p)); } catch (e) {}
  majCompteur();
}
function ajouterAuPanier(id, qte) {
  var panier = lirePanier();
  var ligne = panier.find(function (l) { return l.id === id; });
  if (ligne) ligne.qte += qte; else panier.push({ id: id, qte: qte });
  ecrirePanier(panier);
  var p = getProduit(id);
  pushEcommerce("add_to_cart", { currency: "EUR", value: p.prix * qte, items: [toItem(p, qte)] });
}
function totalPanier(panier) {
  return panier.reduce(function (s, l) { return s + getProduit(l.id).prix * l.qte; }, 0);
}
function majCompteur() {
  var el = document.getElementById("compteur-panier");
  if (el) el.textContent = lirePanier().reduce(function (s, l) { return s + l.qte; }, 0);
}
document.addEventListener("DOMContentLoaded", majCompteur);
