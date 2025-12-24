
import React, { useState, useEffect, useRef } from 'react';
import { AppStatus } from './types';
import { generateSantaImage } from './services/geminiService';
import Snowfall from './components/Snowfall';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [santaImage, setSantaImage] = useState<string | null>(null);
  const [isWaving, setIsWaving] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const init = async () => {
      setStatus(AppStatus.GENERATING);
      const img = await generateSantaImage();
      if (img) setSantaImage(img);
      setStatus(AppStatus.IDLE);
    };
    init();

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleSantaClick = () => {
    if (isWaving) return;

    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    setIsWaving(true);
    setShowBubble(true);

    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => {
      setShowBubble(false);
      setIsWaving(false);
    }, 4000);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 15;
    const y = (e.clientY / window.innerHeight - 0.5) * 15;
    setRotation({ x: -y, y: x });
  };

  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div 
      className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none touch-none"
      onMouseMove={handleMouseMove}
    >
      <Snowfall />
      
      {/* Share Button */}
      <button 
        onClick={() => setShowShareModal(true)}
        className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/20 transition-all active:scale-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {/* Main Greeting Container */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        <h1 className="text-white font-black text-4xl md:text-6xl mb-2 text-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] tracking-tight">
          Merry <span className="text-red-500">Christmas</span>
        </h1>
        <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.4em] mb-8 md:mb-12 font-bold">Interactive Holiday Card</p>

        {/* Santa Stage */}
        <div 
          className="relative perspective-container cursor-pointer transition-transform duration-500 ease-out"
          style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
          onClick={handleSantaClick}
        >
          <div className="absolute inset-0 bg-red-500/20 blur-[60px] rounded-full scale-75 animate-pulse" />

          {/* Speech Bubble */}
          <div className={`absolute -top-36 left-1/2 -translate-x-1/2 w-72 z-50 transition-all duration-500 transform ${showBubble ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'}`}>
             <div className="bg-white text-slate-800 p-5 rounded-[2rem] shadow-2xl relative border-4 border-red-500">
                <p className="text-sm font-black text-center leading-relaxed italic">
                   "🎅 Ho Ho Ho! Merry Christmas! Wishing you luck and happiness!"
                </p>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-red-500" />
             </div>
          </div>

          <div className={`relative transition-all duration-500 ${isWaving ? 'animate-bounce' : 'animate-[float_4s_ease-in-out_infinite]'}`}>
            {santaImage ? (
              <div className="relative">
                <img 
                  src={santaImage} 
                  alt="Santa Claus" 
                  className={`max-w-[260px] md:max-w-[350px] rounded-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-8 border-white/10 transition-all duration-700 ${isBlinking ? 'scale-y-[0.98]' : ''}`}
                />
                <div className={`absolute top-[35%] -right-4 text-7xl transition-all duration-300 transform origin-bottom-left ${isWaving ? 'animate-[wave_0.8s_infinite]' : 'opacity-0 scale-0'}`}>
                  👋
                </div>
              </div>
            ) : (
              <div className="w-64 h-80 bg-white/5 rounded-[4rem] flex items-center justify-center border border-white/10 backdrop-blur-md">
                <div className="w-10 h-10 border-4 border-white/10 border-t-red-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center space-y-4">
          <button 
            onClick={handleSantaClick}
            className="px-10 py-5 bg-red-600 hover:bg-red-500 text-white rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-[0_15px_35px_rgba(220,38,38,0.5)] active:scale-95 transition-all"
          >
            Tap Santa!
          </button>
        </div>
      </div>

      {/* Share Modal Overlay */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1f2e] border border-white/10 rounded-[3rem] p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl">
            {/* Modal Decorations */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-red-500" />
            
            <button 
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-white text-2xl font-black mb-2">Send to Phone</h2>
            <p className="text-white/60 text-sm mb-8 italic">Scan this code to share the magic!</p>
            
            <div className="bg-white p-4 rounded-3xl inline-block shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
            </div>

            <div className="mt-8 space-y-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(currentUrl);
                  alert("Link copied to clipboard! 🎄");
                }}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition-all active:scale-95"
              >
                Copy Web Link
              </button>
              <button 
                onClick={() => setShowShareModal(false)}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(25deg); }
          75% { transform: rotate(-10deg); }
        }
        .perspective-container {
          perspective: 1200px;
        }
      `}</style>
    </div>
  );
};

export default App;
