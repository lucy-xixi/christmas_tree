
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Share2, CheckCircle2 } from 'lucide-react';
import { generateChristmasScene } from './services/geminiService';
import Snowfall from './components/Snowfall.tsx';
import SpeechBubble from './components/SpeechBubble.tsx';
import { GreetingState } from './types';

const App: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<GreetingState>(GreetingState.IDLE);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  
  const treeControls = useAnimation();
  const giftControls = useAnimation();

  // Dynamically get recipient name from URL
  const recipientName = useMemo(() => {
    if (typeof window === 'undefined') return "Chuan";
    const params = new URLSearchParams(window.location.search);
    return params.get('to') || "Chuan";
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadScene() {
      const img = await generateChristmasScene();
      if (isMounted) {
        setBackgroundImage(img);
        setLoading(false);
      }
    }
    loadScene();
    return () => { isMounted = false; };
  }, []);

  const handleTreeClick = useCallback(async () => {
    if (state !== GreetingState.IDLE) return;

    setState(GreetingState.ANIMATING);

    // Sequence of animations for tree and gifts
    await Promise.all([
      treeControls.start({
        rotate: [0, -2, 2, -2, 2, 0],
        scale: [1, 1.05, 1],
        transition: { duration: 0.8, ease: "easeInOut" }
      }),
      giftControls.start({
        y: [0, -30, 0],
        transition: { duration: 0.6, ease: "easeOut" }
      })
    ]);

    setState(GreetingState.SHOW_BUBBLE);

    // Auto-hide bubble after duration
    setTimeout(() => {
      setState(GreetingState.IDLE);
    }, 8000);
  }, [state, treeControls, giftControls]);

  const handleShare = async () => {
    const shareData = {
      title: 'Christmas Wishes!',
      text: `Merry Christmas! I made this interactive card for you, check it out!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopyTooltip(true);
        setTimeout(() => setShowCopyTooltip(false), 3000);
      } catch (err) {
        alert('Please copy the URL manually from the address bar.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c1421] text-white p-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mb-6"
        />
        <p className="font-holiday text-2xl animate-pulse">Generating your festive world...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black select-none">
      <div 
        className="relative h-full aspect-[9/16] max-w-full overflow-hidden shadow-2xl"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-black/50 pointer-events-none z-10"></div>
        
        <Snowfall />

        {/* Action Buttons */}
        <div className="absolute top-8 left-8 z-50">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-yellow-100 shadow-xl"
            aria-label="Share Greeting"
          >
            <Share2 size={24} />
          </motion.button>
          
          <AnimatePresence>
            {showCopyTooltip && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-14 top-2 flex items-center gap-2 bg-green-600 text-white text-xs px-4 py-2 rounded-full whitespace-nowrap shadow-2xl border border-green-400"
              >
                <CheckCircle2 size={14} />
                Link copied to clipboard!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Top Header */}
        <div className="absolute top-10 right-8 z-30 pointer-events-none text-right">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-cursive text-3xl text-yellow-100 drop-shadow-lg"
          >
            Merry Christmas
          </motion.h1>
          <p className="text-white/40 text-[10px] tracking-widest mt-1">2025 HOLIDAY SPECIAL</p>
        </div>

        {/* Tree Interactive Layer */}
        <div 
          className="absolute inset-0 z-40 flex items-center justify-center cursor-pointer"
          onClick={handleTreeClick}
        >
          {/* Invisible overlay that captures clicks for the "Tree" area */}
          <div className="w-1/2 h-2/3 mt-32 bg-transparent" />
        </div>

        <SpeechBubble 
          isVisible={state === GreetingState.SHOW_BUBBLE} 
          name={recipientName} 
        />

        {/* Static Visual Enhancements */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <motion.div
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,255,200,0.2)_0%,transparent_70%)]"
          />
        </div>

        {/* Tap Interaction Hint */}
        {state === GreetingState.IDLE && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 text-white/80 text-xs font-holiday uppercase tracking-[0.3em] pointer-events-none drop-shadow-lg text-center whitespace-nowrap"
          >
            Tap the Tree for Magic
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default App;
