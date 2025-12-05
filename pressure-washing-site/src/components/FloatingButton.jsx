import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FloatingButton.css';

const FloatingButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show button when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  const scrollToContact = () => {
    const contact = document.getElementById('contact');
    contact?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="floating-action-button"
          onClick={scrollToContact}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: [0, -10, 0]
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 20px 60px rgba(124, 179, 66, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="fab-icon">💧</span>
          <span className="fab-text">Get Quote</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingButton;
