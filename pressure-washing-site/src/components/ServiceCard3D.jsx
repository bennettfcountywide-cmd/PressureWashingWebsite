import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditableText from './EditableText';

const ServiceCard3D = ({ service, index, icon, visibleSections }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardRotate, setCardRotate] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setCardRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setCardRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={`service-card-3d ${isFlipped ? 'flipped' : ''}`}
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={visibleSections ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.4 + index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: !isFlipped && !prefersReducedMotion
          ? `perspective(1000px) rotateX(${cardRotate.x}deg) rotateY(${cardRotate.y}deg)`
          : 'none'
      }}
    >
      <div className="card-inner">
        {/* Front of card */}
        <div className="card-front">
          <motion.div
            className="service-icon-large"
            initial={{ scale: 0, rotate: -180 }}
            animate={visibleSections ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 + index * 0.1, type: "spring" }}
          >
            <FontAwesomeIcon icon={icon} />
          </motion.div>
          <h3 className="service-title-front">
            <EditableText
              section="services"
              field={`items.${index}.title`}
              as="span"
            >
              {service.title}
            </EditableText>
          </h3>
          <p className="flip-hint">Click to learn more</p>
        </div>

        {/* Back of card */}
        <div className="card-back">
          <EditableText
            section="services"
            field={`items.${index}.description`}
            as="p"
            multiline
            className="service-description-back"
          >
            {service.description}
          </EditableText>
          <button className="learn-more-btn">
            Learn More →
          </button>
        </div>
      </div>
      <div className="card-glow"></div>
    </motion.div>
  );
};

export default ServiceCard3D;
