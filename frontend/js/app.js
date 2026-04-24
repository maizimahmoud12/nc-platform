const API = "/api/fnc";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().split("T")[0];
}

function getItemId(item) {
  return item._id || item.id || "";
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return { res, data };
}

async function openCase(id) {
  try {
    const { res, data } = await fetchJson(`${API}/${id}`);
    if (!res.ok) throw new Error("open failed");

    localStorage.setItem("fiche", JSON.stringify(data));
    window.location.href = "fiche.html";
  } catch (error) {
    console.error("Erreur ouverture fiche :", error);
    alert("Impossible d’ouvrir cette fiche.");
  }
}

async function tryUpdate(url, method, body) {
  const { res, data } = await fetchJson(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return { ok: res.ok, status: res.status, data };
}

async function markAsTreated(id) {
  try {
    const { res: getRes, data: item } = await fetchJson(`${API}/${id}`);
    if (!getRes.ok || !item) throw new Error("get failed");

    const fullItem = {
      ...item,
      statut: "traite"
    };

    const attempts = [
      () => tryUpdate(`${API}/${id}`, "PATCH", { statut: "traite" }),
      () => tryUpdate(`${API}/${id}`, "PUT", { statut: "traite" }),
      () => tryUpdate(`${API}/${id}`, "PUT", fullItem),
      () => tryUpdate(`${API}/${id}`, "PATCH", fullItem),
      () => tryUpdate(`${API}/${id}/status`, "PATCH", { statut: "traite" }),
      () => tryUpdate(`${API}/${id}/traiter`, "PATCH", { statut: "traite" }),
      () => tryUpdate(`${API}/${id}/traiter`, "PUT", { statut: "traite" })
    ];

    let updated = false;
    let lastError = null;

    for (const attempt of attempts) {
      try {
        const result = await attempt();
        if (result.ok) {
          updated = true;
          break;
        }
        lastError = result;
      } catch (e) {
        lastError = e;
      }
    }

    if (!updated) {
      console.error("Update failed:", lastError);
      throw new Error("update failed");
    }

    await loadStats();
  } catch (error) {
    console.error("Erreur lors du traitement du cas :", error);
    alert("Impossible de marquer ce cas comme traité.");
  }
}

async function loadStats() {
  try {
    const { res, data } = await fetchJson(API);
    if (!res.ok || !Array.isArray(data)) throw new Error("load failed");

    const total = data.length;
    const nouveaux = data.filter(item => item.statut === "nouveau").length;
    const traites = data.filter(item => item.statut !== "nouveau").length;

    const byDate = {};
    data.forEach(item => {
      const date = formatDate(item.createdAt) || "Sans date";
      byDate[date] = (byDate[date] || 0) + 1;
    });

    document.getElementById("declared").textContent = total;
    document.getElementById("newCases").textContent = nouveaux;
    document.getElementById("treated").textContent = traites;

    const labels = Object.keys(byDate);
    const values = Object.values(byDate);

    if (window.chart1Instance) window.chart1Instance.destroy();
    if (window.chart2Instance) window.chart2Instance.destroy();

   window.chart1Instance = new Chart(document.getElementById("chart1"), {
  type: "bar",
  data: {
    labels,
    datasets: [{
      label: "Cas déclarés",
      data: values,
      backgroundColor: "rgba(255, 209, 0, 0.85)",
      borderColor: "#FFE066",
      borderWidth: 2,
      borderRadius: 14,
      maxBarThickness: 90
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#eaf2ff",
          font: { size: 13, weight: "bold" },
          boxWidth: 16,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#dbeafe",
        borderColor: "rgba(255,255,255,0.15)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#dbeafe",
          font: { size: 12, weight: "bold" }
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#cbd5e1",
          font: { size: 12 }
        },
        grid: {
          color: "rgba(255,255,255,0.08)"
        }
      }
    }
  }
});

window.chart2Instance = new Chart(document.getElementById("chart2"), {
  type: "doughnut",
  data: {
    labels: ["Nouveaux cas", "Cas traités"],
    datasets: [{
      data: [nouveaux, traites],
      backgroundColor: [
        "rgba(56, 189, 248, 0.9)",
        "rgba(52, 211, 153, 0.9)"
      ],
      borderColor: "#ffffff",
      borderWidth: 3,
      hoverOffset: 14,
      cutout: "62%"
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#eaf2ff",
          font: { size: 13, weight: "bold" },
          padding: 18,
          usePointStyle: true,
          pointStyle: "circle"
        }
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#dbeafe",
        borderColor: "rgba(255,255,255,0.15)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10
      }
    }
  }
});
    const rows = document.getElementById("caseRows");
    rows.innerHTML = "";

    data.slice().reverse().forEach(item => {
      const itemId = getItemId(item);
      const isTreated = item.statut !== "nouveau";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.numero || itemId}</td>
        <td>${item.lieuEmission || ""}</td>
        <td>${formatDate(item.createdAt) || ""}</td>
        <td class="action-cell">
          <a href="#" data-id="${itemId}" class="view-link">Voir fiche</a>
          ${
            isTreated
              ? `<span class="done-label">Traité</span>`
              : `<button type="button" class="treat-btn" data-treat-id="${itemId}">Traiter</button>`
          }
        </td>
      `;

      rows.appendChild(tr);
    });

    rows.querySelectorAll("a[data-id]").forEach(link => {
      link.addEventListener("click", async (e) => {
        e.preventDefault();
        await openCase(e.currentTarget.dataset.id);
      });
    });

    rows.querySelectorAll("button[data-treat-id]").forEach(button => {
      button.addEventListener("click", async (e) => {
        await markAsTreated(e.currentTarget.dataset.treatId);
      });
    });
  } catch (error) {
    console.error("Erreur loadStats :", error);
  }
}

loadStats();
