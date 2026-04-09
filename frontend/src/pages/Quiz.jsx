import React, { useState } from 'react';
import * as THREE from 'three';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import FluidBackground from '../components/FluidBackground';
 
const Quiz = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [projectInput, setProjectInput] = useState('');
 
  const styleCards = [
    { title: 'Minimalistic', image: 'https://wohnenimkleinformat.de/wp-content/uploads/kueche-mit-kochinsel-boho.png' },
    { title: 'Modern', image: 'https://i.pinimg.com/1200x/b0/0d/8b/b00d8bef45550c2ac16a11ca7915da92.jpg' },
    { title: 'Industrial', image: 'https://hauszi.de/wp-content/uploads/2025/05/1__Insel-Liebe__Dein_Industrial-Hub_f_r_Genuss___Gespr_ch-1.png' },
    { title: 'Maximalistic', image: 'https://i.pinimg.com/736x/2b/41/5d/2b415d0e89cb0d75039d5af3ea34650f.jpg' },
    { title: 'Traditional', image: 'https://i.pinimg.com/736x/47/e0/93/47e093a147bd6c6c34813c934d2512d5.jpg' },
    { title: 'Vintage / Art Deco', image: 'https://i.pinimg.com/736x/d8/fd/e7/d8fde767bc0870d3da26cf00a74a1edb.jpg' },
    { title: 'Cottagecore', image: 'https://i.pinimg.com/736x/6f/a0/5f/6fa05f94fc64226ea2d6b79ce1dfda56.jpg' },
  ];

  const vibeCards = [
    { title: 'Cosy & Inviting', image: 'https://i.pinimg.com/736x/1a/1e/5a/1a1e5a8116f7a16acaa2874c11bf0b03.jpg' },
    { title: 'Sleek & Modern', image: 'https://fancyhouse-design.com/wp-content/uploads/2023/11/A-contemporary-bedroom-design-pairs-a-minimalist-aesthetic-with-luxurious-textures..jpg' },
    { title: 'Serene & Calm', image: 'https://i.pinimg.com/1200x/4e/34/33/4e34332a13d46736f0e37721d72ef43a.jpg' },
    { title: 'Rustic & Warm', image: 'https://i.pinimg.com/1200x/fd/98/c2/fd98c23edcb3d1625f434a30ee5c2780.jpg' },
    { title: 'Luxurious & Opulent', image: 'https://i.pinimg.com/1200x/35/1c/2d/351c2d8c81f5ecfc1719c33ec26a3e01.jpg' },
    { title: 'Natural & Organic', image: 'https://i.pinimg.com/1200x/32/89/95/328995c858d9bd65eb88f388d052b54c.jpg' },
  ];

  const budgetCards = [
    { title: 'Under $50', dbValue: 'Budget', image: 'https://images.unsplash.com/photo-1526587191635-f37191f3f40d?auto=format&fit=crop&w=800&q=80' },
    { title: '$50–$150', dbValue: 'Standard', image: 'https://images.unsplash.com/photo-1532452782176-eef575dc3688?auto=format&fit=crop&w=800&q=80' },
    { title: '$150–$500', dbValue: 'Premium', image: 'https://images.unsplash.com/photo-1589939705066-5470362aaee4?auto=format&fit=crop&w=800&q=80' },
    { title: '$500+', dbValue: 'Luxury', image: 'https://images.unsplash.com/photo-1584659157506-e3a2e2c0c900?auto=format&fit=crop&w=800&q=80' },
  ];

  const cards = step === 1 ? styleCards : step === 2 ? vibeCards : budgetCards;

  const handleCardClick = async (cardTitle, dbValue = null) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setSelectedCard(cardTitle);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        setSelectedCard(null);
        return;
      }

      let payload = {};
      if (step === 1) {
        payload = { aesthetic_style: cardTitle };
      } else if (step === 2) {
        payload = { mood_feel: cardTitle };
      } else if (step === 3) {
        payload = { budget: dbValue || cardTitle };
      }

      const response = await axios.put('/api/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        if (step === 1) {
          setSelectedCard(null);
          setStep(2);
        } else if (step === 2) {
          setSelectedCard(null);
          setStep(3);
        } else if (step === 3) {
          setSelectedCard(null);
          setStep(4); // FIX: was setStep(5), skipping the project step
        }
      } else {
        toast.error('Failed to save your selection. Please try again.');
        setSelectedCard(null);
      }
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message || error);
      const message = error.response?.data?.message || 'Failed to save your selection. Please try again.';
      toast.error(message);
      setSelectedCard(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectSubmit = async () => {
    if (!projectInput.trim()) {
      toast.error("Please enter what you're working on.");
      return;
    }

    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const response = await axios.put(
        '/api/auth/profile',
        { project: projectInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success('Quiz completed successfully!');
        navigate('/home');
      } else {
        toast.error('Failed to save your project. Please try again.');
      }
    } catch (error) {
      console.error('Error updating project:', error.response?.data || error.message || error);
      const message = error.response?.data?.message || 'Failed to save your project. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const imageStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  };

  const cardStyle = (cardTitle) => ({
    width: '280px',
    height: '280px',
    padding: '3px',
    position: 'relative',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    textAlign: 'center',
    fontSize: '1rem',
    color: selectedCard === cardTitle ? 'rgb(88 199 250 / 100%)' : 'rgb(88 199 250 / 0%)',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    fontFamily: 'cursive',
    overflow: 'hidden',
    minWidth: '160px',
    opacity: isLoading && selectedCard !== cardTitle ? 0.6 : 1,
    transform: selectedCard === cardTitle ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.3s ease',
    border: selectedCard === cardTitle ? '2px solid rgb(88 199 250)' : '2px solid transparent',
  });

  const labelStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(0, 0, 0, 0.55)',
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    zIndex: 1,
  };

  return (
    <>
      <style>{`
        @property --rotate {
          syntax: "<angle>";
          initial-value: 132deg;
          inherits: false;
        }
        .magic-card::before {
          content: "";
          width: 104%; height: 102%;
          border-radius: 8px;
          background-image: linear-gradient(var(--rotate), #5ddcff, #3c67e3 43%, #4e00c2);
          position: absolute; z-index: -1;
          top: -1%; left: -2%;
          animation: spin 2.5s linear infinite;
        }
        .magic-card::after {
          position: absolute; content: "";
          top: calc(35vh / 6); left: 0; right: 0;
          z-index: -1; height: 100%; width: 100%;
          margin: 0 auto; transform: scale(0.8);
          filter: blur(calc(35vh / 6));
          background-image: linear-gradient(var(--rotate), #5ddcff, #3c67e3 43%, #4e00c2);
          opacity: 1; transition: opacity 0.5s;
          animation: spin 2.5s linear infinite;
        }
        .magic-card:hover { color: rgb(88 199 250 / 100%) !important; transition: color 1s; }
        .magic-card:hover::before, .magic-card:hover::after { animation: none; opacity: 0; }
        @keyframes spin {
          0%   { --rotate: 0deg; }
          100% { --rotate: 360deg; }
        }
      `}</style>

      {/* ── Layer 0: Three.js shader fills viewport behind everything ── */}
      <FluidBackground />

      {/* ── Layer 1: Cards UI sits above the shader ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {step === 1 ? (
          <>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
              {cards.slice(0, 3).map((card) => (
                <div
                  key={card.title}
                  className="magic-card"
                  style={cardStyle(card.title)}
                  onClick={() => handleCardClick(card.title)}
                >
                  <img src={card.image} alt={card.title} style={imageStyle} />
                </div>
              ))}
            </div>

            <div style={{
              color: '#ffffff',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 'bold',
              letterSpacing: '2px',
              margin: '1rem 0',
              textShadow: '0 0 15px rgba(93, 220, 255, 0.4)',
            }}>
              Pick the kitchen that feels most like you
            </div>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
              {cards.slice(3).map((card) => (
                <div
                  key={card.title}
                  className="magic-card"
                  style={cardStyle(card.title)}
                  onClick={() => handleCardClick(card.title)}
                >
                  <img src={card.image} alt={card.title} style={imageStyle} />
                </div>
              ))}
            </div>
          </>
        ) : step === 2 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
            <div style={{
              color: '#ffffff',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textShadow: '0 0 15px rgba(93, 220, 255, 0.4)',
            }}>
              Choose your dream bedroom vibe
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 280px)',
              gap: '2rem',
              justifyContent: 'center',
              width: '100%',
            }}>
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="magic-card"
                  style={cardStyle(card.title)}
                  onClick={() => handleCardClick(card.title)}
                >
                  <img src={card.image} alt={card.title} style={imageStyle} />
                </div>
              ))}
            </div>
          </div>
        ) : step === 3 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%', overflow: 'auto' }}>
            <div style={{
              color: '#ffffff',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textShadow: '0 0 15px rgba(93, 220, 255, 0.4)',
            }}>
              What's your approximate budget range?
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 200px)',
              gap: '1.5rem',
              justifyContent: 'center',
              width: '100%',
              marginBottom: '2rem',
            }}>
              {/* FIX 3: rgba() values now have correct commas between RGB channels */}
              {cards.slice(0, 4).map((card) => (
                <div
                  key={card.title}
                  style={{
                    padding: '20px',
                    backgroundColor: selectedCard === card.title ? 'rgb(88, 199, 250)' : 'rgba(88, 199, 250, 0.1)',
                    border: selectedCard === card.title ? '2px solid rgb(88, 199, 250)' : '2px solid rgba(88, 199, 250, 0.3)',
                    borderRadius: '8px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    color: selectedCard === card.title ? '#000' : '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    opacity: isLoading && selectedCard !== card.title ? 0.6 : 1,
                  }}
                  onClick={() => handleCardClick(card.title, card.dbValue)}
                >
                  {card.title}
                </div>
              ))}
            </div>
          </div>
        ) : step === 4 ? (
          // FIX 2: was duplicate step === 5; now step 4 = project input
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%', overflow: 'auto' }}>
            <div style={{
              color: '#ffffff',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textShadow: '0 0 15px rgba(93, 220, 255, 0.4)',
              marginTop: '1rem',
            }}>
              What are you currently working on?
            </div>
            <input
              type="text"
              value={projectInput}
              onChange={(e) => setProjectInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleProjectSubmit()}
              placeholder="e.g.: Home renovation, Event Planning, Interior Design"
              style={{
                width: '100%',
                maxWidth: '500px',
                padding: '12px 16px',
                fontSize: '1rem',
                border: '2px solid rgb(88, 199, 250)',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#ffffff',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 15px rgba(93, 220, 255, 0.2)',
                marginBottom: '1.5rem',
              }}
              onFocus={(e) => { e.target.style.boxShadow = '0 0 25px rgba(93, 220, 255, 0.5)'; }}
              onBlur={(e) => { e.target.style.boxShadow = '0 0 15px rgba(93, 220, 255, 0.2)'; }}
            />
            <button
              onClick={handleProjectSubmit}
              disabled={isLoading}
              style={{
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: 'rgb(88, 199, 250)',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                transition: 'all 0.3s ease',
                marginBottom: '2rem',
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = 'rgb(60, 180, 240)')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = 'rgb(88, 199, 250)')}
            >
              {isLoading ? 'Saving...' : 'Complete Quiz'}
            </button>
          </div>
        ) : step === 5 ? (
          // FIX 2: step 5 = completion message (was unreachable duplicate)
          <div style={{
            color: '#d1d5db',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: '1.7',
          }}>
            All set! Your preferences have been saved. Let's find you the perfect design!
          </div>
        ) : (
          // FIX 1: removed literal \n escape sequences — proper JSX formatting restored
          <div style={{
            color: '#d1d5db',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: '1.7',
          }}>
            Thank you for completing the quiz!
          </div>
        )}
      </div>
    </>
  );
};

export default Quiz;