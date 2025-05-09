// src/Memories.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ZDU0ZTEzMy00MDBiLTQ4MzUtODE2Yy02YTlmNDRkZWFmZDQiLCJlbWFpbCI6ImlzaGl0YWJhaXJhZ2kyMDIyQHZpdGJob3BhbC5hYy5pbiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4MTBjZGU0Y2M3ZTEyM2UyNGEzMyIsInNjb3BlZEtleVNlY3JldCI6IjZmZDdjOTU1MmE4NmUyOWNiYWNiNDQxYzA1NTgwNTZhMzU3NTVjYjUxOTVmYjYzZDI4NWM2YmQzZmI5MTEzMzIiLCJleHAiOjE3NzY3MzE5MTN9.09MIlgh0J8fV-ijPbjgIAGg7GokmeUTCNKsejiHbdRI"; // 🔑 Replace with your Pinata JWT

const Memories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPinnedFiles = async () => {
    try {
      const res = await axios.get("https://api.pinata.cloud/data/pinList?status=pinned", {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      });

      const imagePins = res.data.rows.filter((pin) => pin.metadata.name === "Memory Image");
      setMemories(imagePins);
    } catch (err) {
      console.error("Error fetching pinned files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPinnedFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">📚 All Memories</h1>
      {loading ? (
        <p>Loading memories...</p>
      ) : memories.length === 0 ? (
        <p>No memories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {memories.map((mem) => (
            <div key={mem.ipfs_pin_hash} className="bg-white text-black p-4 rounded shadow">
              <img
                src={`https://gateway.pinata.cloud/ipfs/${mem.ipfs_pin_hash}`}
                alt="Memory"
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <p>{mem.metadata.keyvalues?.description || "No description"}</p>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${mem.ipfs_pin_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm mt-1 block"
              >
                View on IPFS
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Memories;
