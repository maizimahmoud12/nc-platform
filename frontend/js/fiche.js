const data = JSON.parse(localStorage.getItem("fiche") || "{}");

function formatDate(value) {
  if (!value) return "";
  const parts = value.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return value;
}

function fallbackToday(value) {
  if (value) return formatDate(value);
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function checked(selected, label) {
  return `<span class="checkbox"><span class="box">${selected ? "X" : ""}</span>${label}</span>`;
}

function fillChoices(targetId, options, selectedValues) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = options
    .map(opt => checked((selectedValues || []).includes(opt.value), opt.label))
    .join("");
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "";
}

fillChoices("origineBox", [
  { value: "Declaration Spontanee", label: "Déclaration Spontanée" },
  { value: "Inspection Controle", label: "Inspection & Contrôle" },
  { value: "Audit", label: "Audit (I) - (E)" },
  { value: "Reclamation Client", label: "Réclamation Client" }
], data.origine);

fillChoices("natureBox", [
  { value: "Systeme Management Qualite", label: "Système Management Qualité" },
  { value: "Sante Securite Environnement", label: "Santé, Sécurité, Environnement" },
  { value: "Matiere Premiere Produit Fini", label: "Matière Première et/ou Produit Fini" },
  { value: "Legale Reglementaire", label: "Légale, Règlementaire" },
  { value: "Exigence Contractuelle", label: "Exigence Contractuelle" }
], data.natureEcart);

fillChoices("activitesBox", [
  "MNG","SMQ","HR","DLA","DAF","QC","HSE","PRO","REA","ACH","DOP","DTC","Fournisseur","Prestataire","Autres"
].map(v => ({ value: v, label: v })), data.activitesConcernees);

fillChoices("causesBox", [
  { value: "Main doeuvre", label: "Main d’œuvre" },
  { value: "Milieu", label: "Milieu" },
  { value: "Materiel", label: "Matériel" },
  { value: "Matiere", label: "Matière" },
  { value: "Methode", label: "Méthode" },
  { value: "Management Supervision", label: "Management & Supervision" }
], data.causes);

fillChoices("miseBox", [
  { value: "acceptable", label: "Acceptable" },
  { value: "acceptable-commentaire", label: "Acceptable (Avec Commentaire & Correction)" },
  { value: "rejete", label: "Non Acceptable (Rejeté)" }
], [data.miseEnOeuvre]);

setText("f_lieuEmission", data.lieuEmission);
setText("f_numero", data.numero);
setText("f_date", formatDate(data.date));

setText("autreNature", data.autreNature);
setText("descriptionEvenement", data.descriptionEvenement);

setText("emetteurNom", data.emetteurNom);
setText("emetteurVisa", data.emetteurVisa);
setText("emetteurDate", fallbackToday(data.emetteurDate));

setText("traitementImmediat", data.traitementImmediat);

setText("rechercheCauses", data.rechercheCauses);
setText("responsableActivite", data.responsableActivite);
setText("responsableVisa", data.responsableVisa);
setText("responsableDate", fallbackToday(data.responsableDate));

setText("actionsCorrectives", data.actionsCorrectives);
setText("respTraitCorr", data.responsableTraitementCorrective);
setText("delaiCorr", data.delaiClotureCorrective);
setText("suiviCorr", data.suiviEfficaciteCorrective);

setText("actionsPreventives", data.actionsPreventives);
setText("respTraitPrev", data.responsableTraitementPreventive);
setText("delaiPrev", data.delaiCloturePreventive);
setText("suiviPrev", data.suiviEfficacitePreventive);

setText("methodeSuivre", data.methodeSuivre);

setText("verificateurNom", data.verificateurNom);
setText("verificateurVisa", data.verificateurVisa);
setText("verificateurDate", fallbackToday(data.verificateurDate));

setText("coutNC", data.coutNC);

const risk1 = document.getElementById("risk1");
const risk2 = document.getElementById("risk2");
const risk3 = document.getElementById("risk3");

if (risk1 && data.evaluationRisques === "acceptable-surveillance") {
  risk1.classList.add("checked");
}
if (risk2 && data.evaluationRisques === "reduire-alarp") {
  risk2.classList.add("checked");
}
if (risk3 && data.evaluationRisques === "inacceptable") {
  risk3.classList.add("checked");
}

const methodAmdec = document.getElementById("methodAmdec");
const methodHazop = document.getElementById("methodHazop");
const method5m = document.getElementById("method5m");
const methodAutre = document.getElementById("methodAutre");

if (methodAmdec && data.methodeSuivre === "AMDEC") methodAmdec.classList.add("checked");
if (methodHazop && data.methodeSuivre === "HAZOP") methodHazop.classList.add("checked");
if (method5m && data.methodeSuivre === "5M") method5m.classList.add("checked");
if (methodAutre && data.methodeSuivre === "Autre") methodAutre.classList.add("checked");