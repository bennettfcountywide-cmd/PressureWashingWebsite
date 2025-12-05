import { motion } from 'framer-motion';
import './WaveDivider.css';

const WaveDivider = ({ flip = false, color = "green" }) => {
  return (
    <div className={`wave-divider ${flip ? 'flip' : ''}`}>
      <motion.svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="wave-svg"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <motion.path
          d="M0,0 C300,100 600,0 900,50 C1050,75 1150,100 1200,80 L1200,120 L0,120 Z"
          className={`wave-path wave-${color}`}
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            d: [
              "M0,0 C300,100 600,0 900,50 C1050,75 1150,100 1200,80 L1200,120 L0,120 Z",
              "M0,0 C300,0 600,100 900,50 C1050,25 1150,0 1200,40 L1200,120 L0,120 Z",
              "M0,0 C300,100 600,0 900,50 C1050,75 1150,100 1200,80 L1200,120 L0,120 Z"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.svg>
    </div>
  );
};

export default WaveDivider;
