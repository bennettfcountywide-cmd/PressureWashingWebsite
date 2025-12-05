import { useEffect, useState } from 'react';
import './WaterDroplets.css';

const WaterDroplets = () => {
  const [droplets, setDroplets] = useState([]);

  useEffect(() => {
    // Generate random droplets
    const generateDroplets = () => {
      const newDroplets = [];
      for (let i = 0; i < 30; i++) {
        newDroplets.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 3 + Math.random() * 4,
          size: 2 + Math.random() * 4,
          opacity: 0.1 + Math.random() * 0.3
        });
      }
      setDroplets(newDroplets);
    };

    generateDroplets();
  }, []);

  return (
    <div className="water-droplets-container">
      {droplets.map(droplet => (
        <div
          key={droplet.id}
          className="water-droplet"
          style={{
            left: `${droplet.left}%`,
            animationDelay: `${droplet.delay}s`,
            animationDuration: `${droplet.duration}s`,
            width: `${droplet.size}px`,
            height: `${droplet.size * 1.5}px`,
            opacity: droplet.opacity
          }}
        />
      ))}
    </div>
  );
};

export default WaterDroplets;
