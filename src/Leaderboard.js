// src/Leaderboard.js
import React, { useEffect, useState } from "react";
import { getLeaderboard } from "./Leaderboardservice";
import { getCompetitions } from "./competitionService";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// ✅ Simple Card components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl p-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-2 ${className}`}>{children}</div>
);

const Leaderboard = () => {
  const [houses, setHouses] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topPerformer, setTopPerformer] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getLeaderboard();
      const comps = await getCompetitions();
      setHouses(data);
      setCompetitions(comps);
      setLoading(false);
    };
    loadData();
  }, []);

  // Calculate top performer (most 1st places). If unavailable, fall back to points leader.
  useEffect(() => {
    if (competitions.length === 0) {
      setTopPerformer(null);
      return;
    }

    const firstPlaceCount = {};
    competitions.forEach((c) => {
      const winner = c?.winners?.[0]?.house || c?.first; // support legacy shape
      if (winner) {
        firstPlaceCount[winner] = (firstPlaceCount[winner] || 0) + 1;
      }
    });

    if (Object.keys(firstPlaceCount).length > 0) {
      let best = null;
      Object.entries(firstPlaceCount).forEach(([house, count]) => {
        if (!best || count > best.count) {
          best = { house, count, metric: "first" };
        }
      });
      setTopPerformer(best);
      return;
    }

    // Fallback: use current leaderboard points leader
    if (houses.length > 0) {
      const sorted = [...houses].sort((a, b) => Number(b.points || 0) - Number(a.points || 0));
      setTopPerformer({ house: sorted[0].house, count: sorted[0].points, metric: "points" });
    } else {
      setTopPerformer(null);
    }
  }, [competitions, houses]);

  const sortedHouses = [...houses].sort((a, b) => Number(b.points || 0) - Number(a.points || 0));
  const captainPhotos = {
    "Mavericks": "/captains/mavericks.jpeg",
    "Igniters": "/captains/igniters.jpeg",
    "Catalyst": "/captains/catalyst.jpeg",
    "Astra": "/captains/astra.jpeg",
  };
  const getCaptainPhoto = (house) =>
    captainPhotos[house] ||
    captainPhotos[String(house || "").toLowerCase()] ||
    "https://via.placeholder.com/96";
  const captainOrder = ["Mavericks", "Igniters", "Catalyst", "Astra"];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        🏆 Resonance Leaderboard
      </h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-center mb-4">Group Captains</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {captainOrder.map((name) => (
            <div key={name} className="flex flex-col items-center">
              <img
                src={getCaptainPhoto(name)}
                alt={`${name} Captain`}
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 shadow"
              />
              <div className="mt-2 text-sm font-medium text-gray-700">{name} Captain</div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600 text-center">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: House Leaderboard */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">House Points</h2>
            <ul>
              {sortedHouses.map((house, index) => (
                <li
                  key={house.house}
                  className="flex justify-between items-center py-3 border-b last:border-none"
                >
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index + 1}. {house.house}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-indigo-600">
                      {house.points}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Competitions List */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
              <span>Competitions</span>
              <span className="text-sm text-gray-500">{competitions.length} total</span>
            </h2>

            {competitions.length === 0 ? (
              <p className="text-gray-600">No competitions yet.</p>
            ) : (
              <ul className="divide-y">
                {competitions.map((comp, i) => (
                  <li
                    key={`${comp.competition}-${i}`}
                    className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded flex justify-between items-center"
                    onClick={() => setSelectedCompetition(comp)}
                  >
                    <div>
                      <div className="font-medium">{comp.competition}</div>
                      <div className="text-sm text-gray-500">{comp.date}</div>
                    </div>
                    <div className="text-sm text-gray-400">View</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* --------- ADDITIONAL CARDS FROM DASHBOARD --------- */}

          {/* Top Performer Card */}
          {topPerformer && (
            <Card className="shadow-lg md:col-span-2">
              <CardContent className="text-center">
                <h2 className="text-xl font-semibold mb-2">🌟 Top Performer</h2>
                <p className="text-lg">
                  <strong>{topPerformer.house}</strong>{" "}
                  {topPerformer.metric === "first"
                    ? `won most 1st places (${topPerformer.count} times)!`
                    : `leads the leaderboard with ${topPerformer.count} points.`}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Group Points Chart */}
          <Card className="shadow-lg md:col-span-2">
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">📊 Group Points</h2>
              <div className="w-full h-56 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedHouses} margin={{ top: 8, right: 8, left: 0, bottom: 56 }} barCategoryGap={10}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="house"
                      interval={0}
                      tick={{ fontSize: 10 }}
                      angle={-35}
                      textAnchor="end"
                      tickMargin={12}
                      height={36}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="points" name="Points" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL for Winners */}
      {selectedCompetition && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={() => setSelectedCompetition(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-3">{selectedCompetition.competition}</h3>
            <div className="space-y-2">
              {selectedCompetition.winners && selectedCompetition.winners.length > 0 ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🥇</span>
                    <div>
                      <div className="font-medium">{selectedCompetition.winners[0].house}</div>
                      <div className="text-sm text-gray-500">{selectedCompetition.winners[0].points} points</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🥈</span>
                    <div>
                      <div className="font-medium">{selectedCompetition.winners[1]?.house}</div>
                      <div className="text-sm text-gray-500">{selectedCompetition.winners[1]?.points} points</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🥉</span>
                    <div>
                      <div className="font-medium">{selectedCompetition.winners[2]?.house}</div>
                      <div className="text-sm text-gray-500">{selectedCompetition.winners[2]?.points} points</div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">No winner data available.</p>
              )}
            </div>

            <button
              onClick={() => setSelectedCompetition(null)}
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
