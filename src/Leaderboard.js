import React, { useEffect, useState } from "react";
import { getLeaderboard } from "./Leaderboardservice";

const Leaderboard = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getLeaderboard();
      setHouses(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const sortedHouses = [...houses].sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">🏆 House Leaderboard</h1>

      {loading ? (
        <p className="text-gray-600 text-lg">Loading scores...</p>
      ) : (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
          <ul>
            {sortedHouses.map((house, index) => (
              <li
                key={house.house}
                className="flex justify-between items-center py-3 border-b last:border-none"
              >
                <span className="font-medium text-gray-700">
                  {index + 1}. {house.house}
                </span>
                <span className="text-xl font-bold text-indigo-600">
                  {house.points}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
