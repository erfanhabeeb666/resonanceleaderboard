// src/AdminPanel.js
import React, { useEffect, useState } from "react";
import { getLeaderboard, updateLeaderboard, addCompetitionResult } from "./Leaderboardservice";
import { addCompetitionLog } from "./competitionService";


const AdminPanel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState("");

  // Competition form state
  const [competitionName, setCompetitionName] = useState("");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [firstPoints, setFirstPoints] = useState(10);
  const [secondPoints, setSecondPoints] = useState(7);
  const [thirdPoints, setThirdPoints] = useState(5);

  const ADMIN_PASSWORD = "college123";

  useEffect(() => {
    if (authenticated) {
      const loadData = async () => {
        const scores = await getLeaderboard();
        setData(scores);
        setLoading(false);
      };
      loadData();
    }
  }, [authenticated]);

  const handleChange = (houseName, value) => {
    setData(prev =>
      prev.map(item => item.house === houseName ? { ...item, points: Number(value) } : item)
    );
  };

  const handleSave = async () => {
    try {
      await updateLeaderboard(data);
      alert("✅ Scores updated successfully!");
    } catch (error) {
      alert("❌ Failed to update scores!");
    }
  };

  const handleCompetitionSubmit = async (e) => {
    e.preventDefault();

    if (!competitionName) {
      alert("❌ Please enter a competition name!");
      return;
    }

    try {
      await addCompetitionResult(first, second, third, {
        first: Number(firstPoints),
        second: Number(secondPoints),
        third: Number(thirdPoints),
        competition: competitionName,
      });

      // 2️⃣ Log competition
      await addCompetitionLog(
        competitionName,
        first,
        second,
        third,
        {
          first: Number(firstPoints),
          second: Number(secondPoints),
          third: Number(thirdPoints)
        }
      );

      // 3️⃣ Refresh leaderboard
      const scores = await getLeaderboard();
      setData(scores);

      alert(`🏆 Results for "${competitionName}" added successfully!`);

      // Reset form
      setCompetitionName("");
      setFirst("");
      setSecond("");
      setThird("");
    } catch (error) {
      alert("❌ Failed to add competition results!");
      console.error(error);
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPassword("");
      setMessage("");
    } else {
      setMessage("❌ Wrong password!");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          {message && <p className="text-red-500 mt-2">{message}</p>}
        </div>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6 space-y-10">
     

      {/* 🏆 Add Competition Section */}
      <div className="bg-white p-6 shadow rounded w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">🏆 Add Competition Result</h2>
        <form onSubmit={handleCompetitionSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block font-medium">Competition Name</label>
            <input
              type="text"
              value={competitionName}
              onChange={(e) => setCompetitionName(e.target.value)}
              placeholder="Enter competition name"
              className="border rounded w-full px-2 py-1"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[{ pos: "First", value: first, setValue: setFirst, points: firstPoints, setPoints: setFirstPoints },
              { pos: "Second", value: second, setValue: setSecond, points: secondPoints, setPoints: setSecondPoints },
              { pos: "Third", value: third, setValue: setThird, points: thirdPoints, setPoints: setThirdPoints }].map((item, i) => (
              <div key={i}>
                <label className="block font-medium">{item.pos} Place</label>
                <select
                  value={item.value}
                  onChange={(e) => item.setValue(e.target.value)}
                  className="border rounded w-full px-2 py-1"
                  required
                >
                  <option value="">Select House</option>
                  {data.map((row) => (
                    <option key={row.house} value={row.house}>
                      {row.house}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.points}
                  onChange={(e) => item.setPoints(e.target.value)}
                  className="border rounded w-full px-2 py-1 mt-1"
                  placeholder="Points"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Add Result
          </button>
        </form>
      </div>

      {/* ✏️ Manual Edit Section */}
      <div className="bg-white p-6 shadow rounded w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">✏️ Edit Scores Manually</h2>
        <div className="space-y-3">
          {data.map((row) => (
            <div
              key={row.house}
              className="flex justify-between bg-gray-50 p-3 rounded"
            >
              <span>{row.house} - {row.lastCompetition || "No competition yet"}</span>
              <input
                type="number"
                value={row.points}
                onChange={(e) => handleChange(row.house, e.target.value)}
                className="border px-2 py-1 w-24 rounded"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
