import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import anime from "animejs";
import { useNavigate, Link } from "react-router-dom";

// 🔒 Replace with your actual JWT securely
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ZDU0ZTEzMy00MDBiLTQ4MzUtODE2Yy02YTlmNDRkZWFmZDQiLCJlbWFpbCI6ImlzaGl0YWJhaXJhZ2kyMDIyQHZpdGJob3BhbC5hYy5pbiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxY2ZmN2JjNWE1ZTkwM2M0OWY2YiIsInNjb3BlZEtleVNlY3JldCI6IjI1MjEyOTYyNjBhNzgwYTlmNDZmMmY1MzA3ZGE0NThkZTUyNGRiNzU2ZWNlMTM1ZWFkNGU2NGQzNGYwZjE1YWUiLCJleHAiOjE3NzY4MDIyMDF9.zCzxJc-M-2m-0M0FrCP0rDiEaIvDjdplSHng1HdWna8";

const MemoryUpload = () => {
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState('');

    const uploadSectionRef = useRef(null);
    const imagePreviewRef = useRef(null);
    const heroRef = useRef(null);
    const navigate = useNavigate();

    const reelRef = useRef(null);
    const reelTrackRef = useRef(null);

    useEffect(() => {
        // Initial fade-in for the main section
        anime({
            targets: uploadSectionRef.current,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: "easeOutQuad",
        });

        // Hero section animation
        anime({
            targets: heroRef.current,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 1000,
            easing: 'easeOutSine',
        });

        // Subtle scaling animation for the hero heading
        anime({
            targets: heroRef.current?.querySelector('h1'),
            scale: [0.95, 1],
            opacity: [0.8, 1],
            duration: 1200,
            easing: 'easeOutBack',
        });

        // Animation for the upload card entrance
        anime({
            targets: uploadSectionRef.current?.querySelector('.upload-card'),
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 700,
            delay: 300,
            easing: 'easeOutQuad',
        });

        const interactiveElements = uploadSectionRef.current?.querySelectorAll('label, textarea, button');
        interactiveElements?.forEach(el => {
            el.addEventListener('mouseenter', () => {
                anime({
                    targets: el,
                    scale: 1.03,
                    duration: 150,
                    easing: 'easeOutSine',
                });
            });
            el.addEventListener('mouseleave', () => {
                anime({
                    targets: el,
                    scale: 1,
                    duration: 150,
                    easing: 'easeOutSine',
                });
            });
        });

        if (imagePreviewRef.current) {
            anime({
                targets: imagePreviewRef.current,
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 500,
                delay: 400,
                easing: 'easeOutBack'
            });
        }

        // Reel animation using anime.js
        const reelAnimation = () => {
            if (reelTrackRef.current && reelRef.current) {
                const reelWidth = reelRef.current.offsetWidth;
                const trackWidth = reelTrackRef.current.scrollWidth; // Use scrollWidth for the full width
                const distance = trackWidth - reelWidth; // Distance to move to complete one loop

                anime({
                    targets: reelTrackRef.current,
                    translateX: [0, -distance], // Start at the beginning, end at -distance
                    duration: 20000, // Increased duration for slower speed (adjust as needed)
                    easing: 'linear',
                    loop: true, // Make it loop
                    complete: function (anim) {
                        // Reset position when the animation loop restarts
                        anim.reset();
                    }
                });
            }
        };

        reelAnimation();

    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            console.log("Selected File:", file); // Debugging log
        }
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleUpload = async () => {
        if (!image || !message) {
            setStatus("⚠️ Please select an image and write a memory.");
            return;
        }

        setStatus("⏳ Gently imprinting your memory into the digital mist...");

        try {
            const formData = new FormData();
            formData.append("file", image);
            const metadata = JSON.stringify({
                name: "Memory Image",
                keyvalues: { description: message },
            });
            formData.append("pinataMetadata", metadata);
            const options = JSON.stringify({ cidVersion: 1 });
            formData.append("pinataOptions", options);

            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxContentLength: "Infinity",
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                    Authorization: `Bearer ${PINATA_JWT}`,
                },
            });

            const cid = res.data.IpfsHash;
            setStatus(`✨ Your memory has been carefully woven with CID: ${cid}`);

            await addDoc(collection(db, "memories"), {
                cid,
                message,
                timestamp: serverTimestamp(),
                likes: 0,
            });

            // Gentle fade out and navigation
            anime({
                targets: uploadSectionRef.current,
                opacity: 0,
                translateY: -30,
                duration: 500,
                easing: 'easeInQuad',
                complete: () => {
                    navigate("/memories"); // Redirect to the gallery
                }
            });

        } catch (error) {
            console.error("Memory weaving encountered an snag:", error);
            setStatus("💔 Alas, there was a whisper of an error while saving your memory. Please try once more.");
        }
    };

    return (
        <div ref={uploadSectionRef} style={{
            minHeight: '100vh',
            background: '#f8f4f0', // Soft, cozy background
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: 0,
            transform: 'translateY(30px)',
            fontFamily: "'Montserrat', Arial, sans-serif",
            color: '#555', // Refined text color
        }}>
            {/* Hero Section */}
            <section ref={heroRef} style={{
                background: `url('https://plus.unsplash.com/premium_photo-1699566447795-586a5b2367f6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D') center/cover no-repeat`,
                width: '100%',
                padding: '150px 0', // Increased padding for more visual space
                textAlign: 'center',
                color: '#fff',
                position: 'relative',
                opacity: 0,
                transform: 'translateY(50px)',
                zIndex: 1,
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.5)', // Slightly darker overlay for better text contrast
                    zIndex: -1,
                }}></div>
                <h1 style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: '4.5rem', // Slightly larger
                    marginBottom: '20px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
                }}>Share Your Treasured Story</h1>
                <p style={{ fontSize: '1.25rem', fontWeight: '300' }}>Preserve the moments that matter most.</p>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginTop: '25px', display: 'inline-block', fontWeight: '500' }}>← Back to Home</Link>
            </section>

            {/* Upload Card */}
            <div className="upload-card" style={{
                background: '#fff',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                width: '90%',
                maxWidth: '600px',
                marginTop: '40px',
                opacity: 0,
                transform: 'translateY(20px)',
            }}>
                {/* ... upload card content ... */}
                <label htmlFor="imageUpload" style={{
                    display: 'block',
                    marginBottom: '18px',
                    fontWeight: '600',
                    color: '#444',
                    fontSize: '1.1rem',
                }}>Select a precious image:</label>
                <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid #ddd',
                        width: '100%',
                        marginBottom: '25px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                    }}
                />

                {image && (
                    <div ref={imagePreviewRef} style={{
                        marginBottom: '25px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.06)',
                        opacity: 0,
                        scale: 0.9,
                    }}>
                        <img
                            src={image ? URL.createObjectURL(image) : ""}
                            alt="Memory Preview"
                            style={{
                                display: 'block',
                                width: '100%',
                                maxHeight: '350px',
                                objectFit: 'cover',
                            }}
                        />
                        {console.log("Image State in Render:", image)} {/* Debugging log in render */}
                    </div>
                )}

                <label htmlFor="messageTextarea" style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontWeight: '600',
                    color: '#444',
                    fontSize: '1.1rem',
                }}>Add a heartfelt caption:</label>
                <textarea
                    id="messageTextarea"
                    placeholder="Describe this cherished moment..."
                    value={message}
                    onChange={handleMessageChange}
                    style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: '10px',
                        border: '1px solid #ddd',
                        marginBottom: '30px',
                        fontSize: '1rem',
                        color: '#555',
                        lineHeight: '1.7',
                        boxSizing: 'border-box',
                        minHeight: '100px',
                    }}
                />

                <button
                    onClick={handleUpload}
                    style={{
                        background: '#5d4037', // Earthy, warm tone
                        color: '#fff',
                        padding: '14px 30px',
                        borderRadius: '30px',
                        border: 'none',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.06)',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#452c24'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#5d4037'}
                >
                    Weave This Memory
                </button>

                {status && (
                    <p style={{
                        marginTop: '30px',
                        color: status.startsWith("⚠️") ? '#d35400' : (status.startsWith("✨") ? '#2ecc71' : '#c0392b'),
                        fontWeight: '500',
                        fontSize: '1rem',
                    }}>{status}</p>
                )}
            </div>

            {/* Photographic Reel Section */}
            <section ref={reelRef} style={{
                width: '100%',
                overflow: 'hidden',
                padding: '20px 0',
                marginTop: '30px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark transparent background
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}>
                <div ref={reelTrackRef} style={{
                    display: 'flex',
                    width: 'fit-content',
                    padding: '10px 0',
                    WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0))',
                    maskImage: 'linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,0))',
                }}>
                    {/* Reel Frames */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 15px' }}>
                        <img src="https://images.unsplash.com/photo-1485038101637-2d4833df1b35?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Memory 1" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
                        <p style={{ marginTop: '5px', fontSize: '0.9em', color: '#fff' }}>Every picture holds a memory</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 15px' }}>
                        <img src="https://images.unsplash.com/photo-1498496294664-d9372eb521f3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Memory 2" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
                        <p style={{ marginTop: '5px', fontSize: '0.9em', color: '#fff' }}>Preserving moments, sharing stories</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 15px' }}>
                        <img src="https://images.unsplash.com/photo-1580067366068-445d9fecd0f4?q=80&w=2014&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG0dG8tdGFnZXx8fGVufDB8fHx8fA%3D%3D" alt="Memory 3" style={{ width: '200px', height: '150px',objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
                        <p style={{ marginTop: '5px', fontSize: '0.9em', color: '#fff' }}>Where stories begin.</p>
                    </div>
                    {/* Duplicate frames for seamless loop */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 15px' }}>
                        <img src="https://plus.unsplash.com/premium_photo-1701127871438-af582cdd8c55?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Memory 1" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
                        <p style={{ marginTop: '5px', fontSize: '0.9em', color: '#fff' }}>The heart of shared moments.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 15px' }}>
                        <img src="https://images.unsplash.com/photo-1497942304796-b8bc2cc898f3?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Memory 2" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
                        <p style={{ marginTop: '5px', fontSize: '0.9em', color: '#fff' }}>Your memories, beautifully kept</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 15px' }}>
                        <img src="https://images.unsplash.com/photo-1623869694958-afca16077078?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Memory 3" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
                        <p style={{ marginTop: '5px', fontSize: '0.9em', color: '#fff' }}>A collection of moments, a lifetime of memories.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MemoryUpload;