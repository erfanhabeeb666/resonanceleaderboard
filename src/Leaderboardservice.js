// src/services/leaderboardService.js
const BIN_ID = "68d10f64d0ea881f40862afe"; // Your JSONBin ID
const API_KEY = "$2a$10$bFAohK1LnxE70qa1US8Cte754xYmxI9eEITtLtU0.ZMbmAgETy5bi"; // Your JSONBin secret key
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

export async function getLeaderboard() {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
      },
    });
    const data = await response.json();
    return data.record || [];
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    return [];
  }
}

export async function updateLeaderboard(newData) {
  try {
    const response = await fetch(BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
      },
      body: JSON.stringify(newData),
    });
    const data = await response.json();
    return data.record || [];
  } catch (error) {
    console.error("❌ Error updating leaderboard:", error);
    throw error;
  }
}

export async function updateHouseScore(houseName, points) {
  const current = await getLeaderboard();
  const updated = current.map((h) =>
    h.house === houseName ? { ...h, points: Number(h.points) + points } : h
  );
  return await updateLeaderboard(updated);
}

export async function addCompetitionResult(first, second, third, points) {
  const current = await getLeaderboard();

  const updated = current.map((h) => {
    const currentPoints = Number(h.points); // ensure number
    if (h.house === first)
      return { ...h, points: currentPoints + points.first, lastCompetition: points.competition };
    if (h.house === second)
      return { ...h, points: currentPoints + points.second, lastCompetition: points.competition };
    if (h.house === third)
      return { ...h, points: currentPoints + points.third, lastCompetition: points.competition };
    return h;
  });

  const result = await updateLeaderboard(updated);
  return result;
}
