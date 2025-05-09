// src/Memories.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ZDU0ZTEzMy00MDBiLTQ4MzUtODE2Yy02YTlmNDRkZWFmZDQiLCJlbWFpbCI6ImlzaGl0YWJhaXJhZ2kyMDIyQHZpdGJob3BhbC5hYy5pbiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxY2ZmN2JjNWE1ZTkwM2M0OWY2YiIsInNjb3BlZEtleVNlY3JldCI6IjI1MjEyOTYyNjBhNzgwYTlmNDZmMmY1MzA3ZGE0NThkZTUyNGRiNzU2ZWNlMTM1ZWFkNGU2NGQzNGYwZjE1YWUiLCJleHAiOjE3NzY4MDIyMDF9.zCzxJc-M-2m-0M0FrCP0rDiEaIvDjdplSHng1HdWna8"; // 🔑 Ensure this token is correct and valid

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
            console.log("Pinata API Response:", res.data); // Debugging: Log the entire response
            const imagePins = res.data.rows.filter((pin) =>
                pin.metadata.name === "Memory Image"
            );
            setMemories(imagePins);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching pinned files:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPinnedFiles();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-semibold text-gray-900 mb-8">Your Cherished Memories</h1>
                {loading ? (
                    <p className="text-gray-600">Loading your memories...</p>
                ) : memories.length === 0 ? (
                    <div className="bg-white shadow overflow-hidden rounded-md">
                        <div className="px-4 py-5 sm:p-6">
                            <p className="text-gray-600">No memories have been created yet.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {memories.map((mem) => (
                            <div key={mem.ipfs_pin_hash} className="bg-white shadow-md rounded-lg overflow-hidden">
                                <img
                                    src={`https://gateway.pinata.cloud/ipfs/${mem.ipfs_pin_hash}`}
                                    alt="Memory"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <p className="text-gray-800 text-sm mb-2">
                                        {mem.metadata.keyvalues?.description || "A beautiful memory"}
                                    </p>
                                    <a
                                        href={`https://gateway.pinata.cloud/ipfs/${mem.ipfs_pin_hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline text-xs"
                                    >
                                        View on IPFS
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Memories;