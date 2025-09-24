// src/competitionService.js
// Store/load competition history (separate JSONBin)

const COMPETITION_BIN_ID = "68cfaf5fae596e708ff5dad1";
const COMPETITION_API_KEY = "$2a$10$bFAohK1LnxE70qa1US8Cte754xYmxI9eEITtLtU0.ZMbmAgETy5bi";
const COMPETITION_URL = `https://api.jsonbin.io/v3/b/${COMPETITION_BIN_ID}`;

async function safeJson(res) {
  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getCompetitions() {
  try {
    const res = await fetch(COMPETITION_URL, {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": COMPETITION_API_KEY,
      },
    });
    const data = await safeJson(res);
    return data.record || [];
  } catch (err) {
    console.error("❌ Error fetching competitions:", err);
    return [];
  }
}

/**
 * Adds a competition log entry (prepends to list).
 * Returns the new entry.
 */
export async function addCompetitionLog(competitionName, first, second, third, points) {
  const current = await getCompetitions();

  const newEntry = {
    competition: competitionName,
    winners: [
      { house: first || null, points: Number(points.first || 0) },
      { house: second || null, points: Number(points.second || 0) },
      { house: third || null, points: Number(points.third || 0) },
    ],
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  };

  // keep most recent first
  const updatedList = [newEntry, ...current];

  try {
    const res = await fetch(COMPETITION_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": COMPETITION_API_KEY,
      },
      body: JSON.stringify(updatedList),
    });
    await safeJson(res);
    return newEntry;
  } catch (err) {
    console.error("❌ Error saving competition log:", err);
    throw err;
  }
}
