const API = "/api/fnc";

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map(el => el.value);
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fncForm");

  if (!form) {
    console.error("fncForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      numero: getValue("numeroFcn"),
      lieuEmission: getValue("lieuEmission"),
      date: getValue("date"),

      origine: getCheckedValues("origine"),
      natureEcart: getCheckedValues("natureEcart"),
      autreNature: getValue("autreNature"),

      descriptionEvenement: getValue("descriptionEvenement"),

      activitesConcernees: getCheckedValues("activitesConcernees"),
      emetteurNom: getValue("emetteurNom"),
      emetteurVisa: getValue("emetteurVisa"),
      emetteurDate: getValue("emetteurDate"),

      traitementImmediat: getValue("traitementImmediat"),

      causes: getCheckedValues("causes"),
      rechercheCauses: getValue("rechercheCauses"),
      responsableActivite: getValue("responsableActivite"),
      responsableVisa: getValue("responsableVisa"),
      responsableDate: getValue("responsableDate"),

      actionsCorrectives: getValue("actionsCorrectives"),
      responsableTraitementCorrective: getValue("responsableTraitementCorrective"),
      delaiClotureCorrective: getValue("delaiClotureCorrective"),
      suiviEfficaciteCorrective: getValue("suiviEfficaciteCorrective"),

      actionsPreventives: getValue("actionsPreventives"),
      responsableTraitementPreventive: getValue("responsableTraitementPreventive"),
      delaiCloturePreventive: getValue("delaiCloturePreventive"),
      suiviEfficacitePreventive: getValue("suiviEfficacitePreventive"),

      evaluationRisques:
        document.querySelector('input[name="evaluationRisques"]:checked')?.value || "",
      methodeSuivre:
        document.querySelector('input[name="methodeSuivre"]:checked')?.value || "",
      miseEnOeuvre:
        document.querySelector('input[name="miseEnOeuvre"]:checked')?.value || "",

      verificateurNom: getValue("verificateurNom"),
      verificateurVisa: getValue("verificateurVisa"),
      verificateurDate: getValue("verificateurDate"),

      coutNC: getValue("coutNC"),
      statut: "nouveau"
    };

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        throw new Error("Erreur serveur");
      }

      const contentType = res.headers.get("content-type") || "";
      let serverData = {};

      if (contentType.includes("application/json")) {
        serverData = await res.json();
      }
      const risk1 = document.getElementById("risk1");
      const risk2 = document.getElementById("risk2");
      const risk3 = document.getElementById("risk3");
      const saved = {
        ...payload,
        ...serverData
      };

      localStorage.setItem("fiche", JSON.stringify(saved));
      window.location.href = "fiche.html";
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Erreur serveur");
    }
  });
});
