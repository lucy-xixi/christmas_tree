
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Share2, CheckCircle2 } from 'lucide-react';
import { generateChristmasScene } from './services/geminiService';
import Snowfall from './components/Snowfall';
import SpeechBubble from './components/SpeechBubble';
import { GreetingState } from './types';

const App: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<GreetingState>(GreetingState.IDLE);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  
  const treeControls = useAnimation();
  const giftControls = useAnimation();

  // 从 URL 中动态获取收件人姓名
  // 例如: url.com?to=小明 -> 姓名就是 小明
  const recipientName = useMemo(() => {
    if (typeof window === 'undefined') return "Chuan";
    const params = new URLSearchParams(window.location.search);
    return params.get('to') || "Chuan";
  }, []);

  useEffect(() => {
    async function loadScene() {
      const img = await generateChristmasScene();
      setBackgroundImage(img);
      setLoading(false);
    }
    loadScene();
  }, []);

  const handleTreeClick = useCallback(async () => {
    if (state !== GreetingState.IDLE) return;

    setState(GreetingState.ANIMATING);

    // Sequence of animations
    await Promise.all([
      treeControls.start({
        rotate: [0, -1.8, 1.8, -1.8, 1.8, 0],
        scale: [1, 1.04, 1],
        transition: { duration: 0.8, ease: "easeInOut" }
      }),
      giftControls.start({
        y: [0, -25, 0],
        transition: { duration: 0.5, ease: "easeOut" }
      })
    ]);

    setState(GreetingState.SHOW_BUBBLE);

    // Reset bubble after some time
    setTimeout(() => {
      setState(GreetingState.IDLE);
    }, 7000);
  }, [state, treeControls, giftControls]);

  const handleShare = async () => {
    const shareData = {
      title: '圣诞快乐！',
      text: `这是我送给你的圣诞惊喜，快来看看吧！`,
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
        alert('请手动复制浏览器地址栏发送。');
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
        <p className="font-holiday text-2xl animate-pulse">正在为你生成专属圣诞场景...</p>
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

        {/* Share Button */}
        <div className="absolute top-8 left-8 z-50">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-yellow-100 shadow-xl"
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
                链接已复制，粘贴给好友吧！
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Title */}
        <div className="absolute top-10 right-8 z-30 pointer-events-none text-right">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-cursive text-3xl text-yellow-100 drop-shadow-lg"
          >
            Merry Christmas
          </motion.h1>
          <p className="text-white/40 text-[10px] tracking-widest mt-1">2025 HOLIDAY EDITION</p>
        </div>

        {/* Interactive Layer */}
        <motion.div 
          className="absolute inset-0 z-40 flex items-center justify-center cursor-pointer"
          onClick={handleTreeClick}
        >
          <motion.div animate={treeControls} className="absolute inset-0 pointer-events-none" />
        </motion.div>

        <motion.div animate={giftControls} className="absolute bottom-20 left-0 right-0 h-40 pointer-events-none z-30" />

        <SpeechBubble 
          isVisible={state === GreetingState.SHOW_BUBBLE} 
          name={recipientName} 
        />

        {/* Dynamic Light FX */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <motion.div
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,255,200,0.2)_0%,transparent_70%)]"
          />
        </div>

        {/* Tap Hint */}
        {state === GreetingState.IDLE && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 text-white/80 text-xs font-holiday uppercase tracking-[0.3em] pointer-events-none drop-shadow-lg"
          >
            点击圣诞树 开启魔力
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default App;
