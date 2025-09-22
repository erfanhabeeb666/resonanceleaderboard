const BIN_ID = "68cbd8e7ae596e708ff2cede"; // Replace with your JSONBin ID
const API_KEY = "$2a$10$6GScYZVLiX7wrbkuI3RkE.axBXv0q8A6a4jdU3lyYLEocfEVJGZhW"; // Replace with your JSONBin secret key
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

export async function getScores() {
  const res = await fetch(`${BASE_URL}/latest`, {
    headers: {
      "X-Master-Key": API_KEY,
    },
  });
  const data = await res.json();
  return data.record;
}

export async function updateScores(newData) {
  const res = await fetch(BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY,
    },
    body: JSON.stringify(newData),
  });
  return await res.json();
}
