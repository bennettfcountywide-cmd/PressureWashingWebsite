import { useState } from 'react';
import './RippleEffect.css';

const RippleEffect = ({ children, className = '', ...props }) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples(ripples => ripples.filter(r => r.id !== newRipple.id));
    }, 800);
  };

  return (
    <button
      className={`ripple-button ${className}`}
      onClick={(e) => {
        createRipple(e);
        props.onClick && props.onClick(e);
      }}
      {...props}
    >
      {children}
      <span className="ripple-container">
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size
            }}
          />
        ))}
      </span>
    </button>
  );
};

export default RippleEffect;
