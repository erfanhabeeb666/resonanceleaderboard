// src/services/leaderboardService.js
// NOTE: Consider moving BIN_ID / API_KEY to env variables instead of hardcoding.

const BIN_ID = "68d10f64d0ea881f40862afe"; // Your JSONBin ID
const API_KEY = "$2a$10$bFAohK1LnxE70qa1US8Cte754xYmxI9eEITtLtU0.ZMbmAgETy5bi"; // Your JSONBin secret key
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function safeJson(res) {
  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getLeaderboard() {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
      },
    });

    const data = await safeJson(response);
    const record = data.record || [];
    // ensure points are numbers and keep other fields intact
    return record.map((h) => ({ ...h, points: Number(h.points || 0) }));
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    return [];
  }
}

export async function updateLeaderboard(newData) {
  try {
    // ensure all points are numbers before saving
    const normalized = newData.map((h) => ({ ...h, points: Number(h.points || 0) }));
    const response = await fetch(BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
      },
      body: JSON.stringify(normalized),
    });

    const data = await safeJson(response);
    return data.record || normalized;
  } catch (error) {
    console.error("❌ Error updating leaderboard:", error);
    throw error;
  }
}

export async function updateHouseScore(houseName, points) {
  const current = await getLeaderboard();
  const updated = current.map((h) =>
    h.house === houseName ? { ...h, points: Number(h.points || 0) + Number(points) } : h
  );
  return await updateLeaderboard(updated);
}

/**
 * Add results for a competition.
 * - first / second / third are house names (strings)
 * - points is an object { first: number, second: number, third: number, competition?: string }
 */
export async function addCompetitionResult(first, second, third, points) {
  if (!first || !second || !third) {
    throw new Error("first, second and third must be provided");
  }

  const current = await getLeaderboard();
  const fp = Number(points.first || 0);
  const sp = Number(points.second || 0);
  const tp = Number(points.third || 0);
  const compName = points.competition || "";

  const updated = current.map((h) => {
    const currentPoints = Number(h.points || 0);

    // Sum points if the same house appears in multiple positions
    const bonus =
      (h.house === first ? fp : 0) +
      (h.house === second ? sp : 0) +
      (h.house === third ? tp : 0);

    if (bonus > 0) {
      return { ...h, points: currentPoints + bonus, lastCompetition: compName };
    }
    return h;
  });

  const result = await updateLeaderboard(updated);
  return result;
}
