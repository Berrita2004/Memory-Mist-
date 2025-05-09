import React, { useState, useRef, useEffect } from "react";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import anime from "animejs";

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const formRef = useRef(null);
    const backgroundRef = useRef(null);
    const overlayRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        anime({
            targets: formRef.current,
            translateY: [-40, 0],
            opacity: [0, 1],
            duration: 800,
            easing: "easeOutExpo",
        });

        setTimeout(() => {
            const bgImage = backgroundRef.current;
            const overlay = overlayRef.current;

            console.log("Delayed backgroundRef.current:", bgImage);
            console.log("Delayed overlayRef.current:", overlay);

            if (bgImage) {
                anime({
                    targets: bgImage,
                    translateX: ['-10%', '10%'],
                    duration: 5000,
                    loop: true,
                    direction: 'alternate',
                    easing: 'easeInOutSine'
                });
            }

            if (overlay) {
                anime({
                    targets: overlay,
                    opacity: [0.1, 0.5],
                    backgroundColor: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.3)'],
                    duration: 4000,
                    loop: true,
                    direction: 'alternate',
                    easing: 'easeInOutQuad'
                });
            }
        }, 500);
    }, []);

    const triggerShake = () => {
        anime({
            targets: formRef.current,
            translateX: [
                { value: -8, duration: 100 },
                { value: 8, duration: 100 },
                { value: -6, duration: 100 },
                { value: 6, duration: 100 },
                { value: 0, duration: 100 },
            ],
            easing: "easeInOutSine",
        });
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Successfully signed in!");
            navigate("/home");
        } catch (err) {
            setError("Sign in failed. Please check your email and password.");
            console.error("Signin error:", err.message);
            triggerShake();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#fff7f0' }}>
            <div
                ref={backgroundRef}
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534531688091-a458257992cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
            >
                <div ref={overlayRef} className="absolute top-0 left-0 w-full h-full bg-white/50 z-10"></div>
            </div>
            <div
                ref={formRef}
                className="rounded-2xl shadow-2xl p-8 w-full max-w-md text-black z-20"
                style={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
            >
                <h2 className="text-3xl font-bold text-center mb-6" style={{ fontFamily: "'UnifrakturCook', cursive", color: '#222' }}>
                    Welcome
                </h2>

                {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

                <form onSubmit={handleSignin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
                    />
                    <button
                        type="submit"
                        className="w-full bg-black text-white font-semibold py-3 rounded-full hover:bg-gray-800 transition duration-200"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-700">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-indigo-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signin;