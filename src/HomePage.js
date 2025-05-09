import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import anime from "animejs";

// Define a heavy calligraphy font (you might need to ensure this font is available or use a web font)
const heavyCalligraphyFont = "'Great Vibes', cursive"; // Example, you might need to install or link this

const Home = () => {
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const galleryRef = useRef(null);
    const storyRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Initial animations for sections
        const sections = [heroRef, featuresRef, galleryRef, storyRef];
        sections.forEach((ref, index) => {
            anime({
                targets: ref.current,
                opacity: [0, 1],
                translateY: [50, 0],
                duration: 800,
                delay: 200 * index,
                easing: "easeOutQuad",
            });
        });

        // Text Hover Animation (Zoom Only)
        const animatedTextElements = document.querySelectorAll('h1, h2, h3, p, a, button');
        animatedTextElements.forEach(text => {
            text.addEventListener('mouseenter', () => {
                anime({
                    targets: text,
                    scale: 1.08,
                    duration: 200,
                    easing: 'easeOutSine',
                });
            });
            text.addEventListener('mouseleave', () => {
                anime({
                    targets: text,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutSine',
                });
            });
        });

        // "3D" Story Section
        if (storyRef.current) {
            storyRef.current.addEventListener('mousemove', (e) => {
                const rect = storyRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) / 80;
                const deltaY = (e.clientY - centerY) / 80;

                anime({
                    targets: storyRef.current,
                    rotateX: deltaY,
                    rotateY: deltaX,
                    perspective: '600px',
                    duration: 250,
                    easing: 'easeInOutSine',
                });
            });

            storyRef.current.addEventListener('mouseleave', () => {
                anime({
                    targets: storyRef.current,
                    rotateX: 0,
                    rotateY: 0,
                    perspective: '600px',
                    duration: 250,
                    easing: 'easeInOutSine',
                });
            });
        }

        // Subtle animation on the navbar links
        const navbarLinks = document.querySelectorAll('.nav-links li a');
        navbarLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                anime({
                    targets: link,
                    translateY: -3,
                    duration: 150,
                    easing: 'easeOutSine',
                });
            });
            link.addEventListener('mouseleave', () => {
                anime({
                    targets: link,
                    translateY: 0,
                    duration: 150,
                    easing: 'easeOutSine',
                });
            });
        });

        // Subtle pulsing on the hero image background
        const heroBg = heroRef.current?.querySelector('.hero-bg');
        if (heroBg) {
            anime({
                targets: heroBg,
                scale: [1, 1.02, 1],
                opacity: [0.8, 1, 0.8],
                duration: 3000,
                loop: true,
                easing: 'easeInOutQuad',
            });
        }

        // Animate the "Create Memory" button on hover
        const createMemoryButton = heroRef.current?.querySelector('.search-bar button');
        if (createMemoryButton) {
            createMemoryButton.addEventListener('mouseenter', () => {
                anime({
                    targets: createMemoryButton,
                    scale: 1.1,
                    translateZ: 0,
                    duration: 250,
                    easing: 'easeOutQuad',
                });
            });
            createMemoryButton.addEventListener('mouseleave', () => {
                anime({
                    targets: createMemoryButton,
                    scale: 1,
                    translateZ: 0,
                    duration: 250,
                    easing: 'easeOutQuad',
                });
            });
        }

        // Animate the "Explore" button
        const exploreButton = document.querySelector('.explore-btn');
        if (exploreButton) {
            anime({
                targets: exploreButton,
                translateX: [0, 5, 0],
                rotateZ: [0, -3, 0],
                duration: 2000,
                loop: true,
                easing: 'easeInOutSine',
            });
        }

        // Gallery Image Hover Animation
        const galleryImages = document.querySelectorAll('.gallery-grid img');
        galleryImages.forEach(img => {
            img.addEventListener('mouseenter', () => {
                anime({
                    targets: img,
                    rotateZ: '5deg',
                    duration: 400,
                    easing: 'easeInOutQuad',
                });
            });
            img.addEventListener('mouseleave', () => {
                anime({
                    targets: img,
                    rotateZ: '0deg',
                    duration: 400,
                    easing: 'easeInOutQuad',
                });
            });
        });

        // Feature Card Image Hover Animation
        const featureCardImages = featuresRef.current?.querySelectorAll('.feature-card img');
        featureCardImages?.forEach(img => {
            img.addEventListener('mouseenter', () => {
                anime({
                    targets: img,
                    scale: 1.1,
                    duration: 300,
                    easing: 'easeOutSine',
                });
            });
            img.addEventListener('mouseleave', () => {
                anime({
                    targets: img,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutSine',
                });
            });
        });

    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (err) {
            console.error("Error signing out:", err);
        }
    };

    return (
        <div style={{ margin: 0, fontFamily: "'Montserrat', Arial, sans-serif", background: '#fff7f0', color: '#222', overflowX: 'hidden' }}> {/* Removed cursor: 'none' */}
            {/* Removed cursor divs and related state/refs */}
            <nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.03)', position: 'sticky', top: 0, zIndex: 999 }}>
                <div className="logo" style={{ fontFamily: "'Montserrat', Arial, sans-serif", fontWeight: 700, fontSize: '1.5rem' }}>MemoryMist</div>
                <ul className="nav-links" style={{ listStyle: 'none', display: 'flex', gap: '32px', margin: 0, padding: 0 }}>
                    <li><Link to="/" style={{ textDecoration: 'none', color: '#222', fontWeight: 500, fontSize: '1rem', transition: 'color 0.2s' }}>Home</Link></li>
                    <li><Link to="/about" style={{ textDecoration: 'none', color: '#222', fontWeight: 500, fontSize: '1rem', transition: 'color 0.2s' }}>About</Link></li>
                    <li><Link to="/memories" style={{ textDecoration: 'none', color: '#222', fontWeight: 500, fontSize: '1rem', transition: 'color 0.2s' }}>Gallery</Link></li>
                    <li><Link to="/contact" style={{ textDecoration: 'none', color: '#222', fontWeight: 500, fontSize: '1rem', transition: 'color 0.2s' }}>Contact</Link></li>
                    <li><Link to="/explore" className="explore-btn" style={{ background: '#000', color: '#fff', padding: '8px 24px', borderRadius: '20px', fontWeight: 700, textDecoration: 'none' }}>Explore</Link></li>
                    <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 500, fontSize: '1rem', cursor: 'pointer', transition: 'color 0.2s' }}>Log Out</button></li>
                </ul>
            </nav>

            <section ref={heroRef} className="hero" style={{ background: '#f5e7de url(\'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80\') no-repeat center/cover', padding: '100px 0 80px 0', position: 'relative', opacity: 0, transform: 'translateY(50px)' }}>
                <div className="hero-content" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <h1 style={{ fontFamily: heavyCalligraphyFont, fontSize: '3rem', marginBottom: '12px', lineHeight: 1.1, fontWeight: '700' }}>Unlock the Memories: Your <span className="highlight" style={{ color: '#222', fontSize: '2.5rem', display: 'inline-block', opacity: 0.7 }}>Memory</span></h1> {/* Applied heavy calligraphy font */}
                    <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '28px' }}>Discover the power of our memory tiles. Now, you can preserve and relive your cherished moments. Explore our seamless features</p>
                    <Link to="/upload" className="search-bar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '18px', textDecoration: 'none' }}>
                        <div style={{ padding: '14px 28px', borderRadius: '30px 0 0 30px', border: 'none', outline: 'none', fontSize: '1rem', width: '300px', background: '#fff', color: '#777', textAlign: 'left' }}>MemoryMist</div>
                        <button style={{ padding: '14px 32px', borderRadius: '0 30px 30px 0', border: 'none', background: '#000', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Create Memory</button>
                    </Link>
                </div>
                <div className="hero-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.3)', zIndex: 1 }}></div>
            </section>

            <section ref={featuresRef} className="features" style={{ padding: '60px 0 40px 0', background: '#fff', textAlign: 'center', opacity: 0, transform: 'translateY(50px)' }}>
                <h2 style={{ fontFamily: "'UnifrakturCook', cursive", fontSize: '2.5rem', marginBottom: '10px' }}>Embrace the Art of Remembrance</h2>
                <p className="subtitle" style={{ color: '#555', fontSize: '1.1rem', marginBottom: '48px' }}>
                    Elevate your memories with our innovative platform. Seamlessly store, curate, and revisit your most precious moments
                </p>
                <div className="feature-cards" style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
                    <div className="feature-card" style={{ background: '#f9f2ec', borderRadius: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '32px 24px', width: '220px', textAlign: 'center' }}>
                        <img src="https://images.unsplash.com/photo-1662368865036-53d6f1850de0?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Personalized" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '18px', marginBottom: '18px', background: '#ede2d6' }} />
                        <h3 style={{ fontFamily: "'UnifrakturCook', cursive", fontSize: '1.3rem', marginBottom: '8px' }}>Personalized</h3>
                        <p style={{ color: '#666', fontSize: '0.98rem' }}>Crafted with care, our customizable memory tiles allow</p>
                    </div>
                    <div className="feature-card" style={{ background: '#f9f2ec', borderRadius: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '32px 24px', width: '220px', textAlign: 'center' }}>
                        <img src="https://images.unsplash.com/photo-1562537218-26057ef20502?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Timeless" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '18px', marginBottom: '18px', background: '#ede2d6' }} />
                        <h3 style={{ fontFamily: "'UnifrakturCook', cursive", fontSize: '1.3rem', marginBottom: '8px' }}>Timeless</h3>
                        <p style={{ color: '#666', fontSize: '0.98rem' }}>Weave the threads of your life into a tapestry of memories</p>
                    </div>
                    <div className="feature-card" style={{ background: '#f9f2ec', borderRadius: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '32px 24px', width: '220px', textAlign: 'center' }}>
                        <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Elevate" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '18px', marginBottom: '18px', background: '#ede2d6' }} />
                        <h3 style={{ fontFamily: "'UnifrakturCook', cursive", fontSize: '1.3rem', marginBottom: '8px' }}>Elevate</h3>
                        <p style={{ color: '#666', fontSize: '0.98rem' }}>Discover the beauty in the simplest of things</p>
                    </div>
                </div>
            </section>

            <section ref={galleryRef} className="gallery" style={{ padding: '60px 0 40px 0', background: '#fdf6f0', opacity: 0, transform: 'translateY(50px)' }}>
                <div className="gallery-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '900px', margin: '0 auto 24px auto' }}>
                    <h2 style={{ fontFamily: "'UnifrakturCook', cursive", fontSize: '2rem', margin: 0 }}>Your Memories</h2>
                    <Link to="/memories" className="relive-btn" style={{ background: '#fff', border: '1px solid #ccc', borderRadius: '20px', padding: '8px 24px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>Relive and Reflect</Link>
                </div>
                <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', maxWidth: '900px', margin: '0 auto' }}>
                    <img src="https://images.unsplash.com/photo-1602444307048-952df9146135?q=80&w=1926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Memory 1" className="gallery-image" style={{ width: '100%', borderRadius: '18px', background: '#ede2d6', aspectRatio: '1/1', objectFit: 'cover' }} />
                    <img src="https://images.unsplash.com/41/bXoAlw8gT66vBo1wcFoO_IMG_9181.jpg?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Memory 2" className="gallery-image" style={{ width: '100%', borderRadius: '18px', background: '#ede2d6', aspectRatio: '1/1', objectFit: 'cover' }} />
                    <img src="https://images.unsplash.com/photo-1604302880008-a1db633602ad?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Memory 3" className="gallery-image" style={{ width: '100%', borderRadius: '18px', background: '#ede2d6', aspectRatio: '1/1', objectFit: 'cover' }} />
                    <img src="https://images.unsplash.com/photo-1634291090914-98d1a914c34e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Memory 4" className="gallery-image" style={{ width: '100%', borderRadius: '18px', background: '#ede2d6', aspectRatio: '1/1', objectFit: 'cover' }} />
                    <img src="https://images.unsplash.com/photo-1438786657495-640937046d18?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Memory 5" className="gallery-image" style={{ width: '100%', borderRadius: '18px', background: '#ede2d6', aspectRatio: '1/1', objectFit: 'cover' }} />
                    <img src="https://images.unsplash.com/photo-1655786252582-f487513127d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Memory 6" className="gallery-image" style={{ width: '100%', borderRadius: '18px', background: '#ede2d6', aspectRatio: '1/1', objectFit: 'cover' }} />
                </div>
            </section>

            <section ref={storyRef} className="story" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', padding: '70px 0', background: '#fff7f0', maxWidth: '1200px', margin: '0 auto', opacity: 0, transform: 'translateY(50px)', perspective: '600px' }}>
                <div className="story-content" style={{ flex: 1, maxWidth: '440px' }}>
                    <h2 style={{ fontFamily: "'UnifrakturCook', cursive", fontSize: '2rem', marginBottom: '10px' }}><span className="boxed" style={{ border: '2px solid #7b5eaa', padding: '2px 12px', borderRadius: '6px', display: 'inline-block' }}>Preserving the</span></h2>
                    <p style={{ color: '#555', fontSize: '1.05rem', marginBottom: '28px' }}>
                        Escape the clutches of time and immerse yourself in a world where memories become tangible. Our seamless platform enables you to effortlessly curate and revisit your most cherished moments, allowing you to relive the joy
                    </p>
                    <Link to="/upload" className="cta-btn" style={{ background: '#000', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '30px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}>Create Memory</Link>
                </div>
                <div className="story-image" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="https://via.placeholder.com/340" alt="Portrait" style={{ width: '340px', borderRadius: '20px', background: '#fff', padding: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }} />
                </div>
            </section>

            <footer className="footer" style={{ background: '#fff', textAlign: 'center', padding: '20px 0', color: '#777' }}>
                <p>&copy; 2025 MemoryMist. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;