import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

const FRAMES = 20;

export default function FilmReel() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], ['-50%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.6, 1, 1, 0.6]);

  return (
    <div ref={ref} className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] pointer-events-none h-screen">
      <motion.div
        className="flex flex-col items-center gap-1.5 pr-3"
        style={{ y: translateY, opacity }}
      >
        {/* Top reel */}
        <div className="w-12 h-12 rounded-full border-2 border-cinema-red/40 flex items-center justify-center mb-2 bg-cinema-black/80 backdrop-blur-sm shadow-[0_0_15px_rgba(229,9,20,0.2)]">
          <div className="w-4 h-4 rounded-full bg-cinema-red/60" />
          <div className="absolute w-3 h-3 rounded-full bg-cinema-red/20 animate-ping" />
        </div>

        {/* Film strip */}
        <div className="flex flex-col gap-3">
          {Array.from({ length: FRAMES }).map((_, i) => (
            <motion.div
              key={i}
              className="relative group"
              initial={{ opacity: 0.4, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              {/* Film frame */}
              <div className="w-10 h-8 rounded border border-cinema-red/30 bg-cinema-black/60 backdrop-blur-sm overflow-hidden
                hover:border-cinema-red/60 hover:shadow-[0_0_10px_rgba(229,9,20,0.3)] transition-all duration-300">
                <div className="w-full h-full bg-gradient-to-br from-cinema-red/10 to-transparent flex items-center justify-center">
                  {/* Sprocket holes */}
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                    <div className="w-1.5 h-1.5 rounded-full border border-cinema-red/40" />
                    <div className="w-1.5 h-1.5 rounded-full border border-cinema-red/40" />
                    <div className="w-1.5 h-1.5 rounded-full border border-cinema-red/40" />
                  </div>
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                    <div className="w-1.5 h-1.5 rounded-full border border-cinema-red/40" />
                    <div className="w-1.5 h-1.5 rounded-full border border-cinema-red/40" />
                    <div className="w-1.5 h-1.5 rounded-full border border-cinema-red/40" />
                  </div>
                  <span className="text-[6px] text-cinema-red/40 font-bold tracking-widest">{i + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom reel */}
        <div className="w-12 h-12 rounded-full border-2 border-cinema-red/40 flex items-center justify-center mt-2 bg-cinema-black/80 backdrop-blur-sm shadow-[0_0_15px_rgba(229,9,20,0.2)]">
          <div className="w-4 h-4 rounded-full bg-cinema-red/60" />
        </div>

        {/* Connecting line */}
        <div className="absolute top-0 bottom-0 right-6 w-px bg-gradient-to-b from-transparent via-cinema-red/20 to-transparent" />
      </motion.div>
    </div>
  );
}
