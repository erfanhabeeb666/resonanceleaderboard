// src/services/competitionService.js
const COMPETITION_BIN_ID = "68cfaf5fae596e708ff5dad1";
const COMPETITION_API_KEY = "$2a$10$bFAohK1LnxE70qa1US8Cte754xYmxI9eEITtLtU0.ZMbmAgETy5bi";
const COMPETITION_URL = `https://api.jsonbin.io/v3/b/${COMPETITION_BIN_ID}`;

export async function getCompetitions() {
  try {
    const res = await fetch(COMPETITION_URL, {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": COMPETITION_API_KEY,
      },
    });
    const data = await res.json();
    return data.record || [];
  } catch (err) {
    console.error("❌ Error fetching competitions:", err);
    return [];
  }
}

export async function addCompetitionLog(competitionName, first, second, third, points) {
  const current = await getCompetitions();

  const newEntry = {
    competition: competitionName,
    winners: [
      { house: first, points: points.first },
      { house: second, points: points.second },
      { house: third, points: points.third }
    ],
    date: new Date().toISOString().split("T")[0] // YYYY-MM-DD
  };

  current.push(newEntry);

  try {
    await fetch(COMPETITION_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": COMPETITION_API_KEY,
      },
      body: JSON.stringify(current),
    });
    return newEntry;
  } catch (err) {
    console.error("❌ Error saving competition log:", err);
    throw err;
  }
}
