import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useWebsiteContent } from '../context/WebsiteContentContext';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBuilding, faSprayCanSparkles, faScrewdriverWrench, faPlus, faCar, faTruck, faBroom, faWater, faTree, faIndustry } from '@fortawesome/free-solid-svg-icons';
import EditableText from '../components/EditableText';
import EditableImage from '../components/EditableImage';
import EditableBackgroundImage from '../components/EditableBackgroundImage';
import ModernGallery from '../components/ModernGallery';
import WaterDroplets from '../components/WaterDroplets';
import RippleEffect from '../components/RippleEffect';
import FloatingButton from '../components/FloatingButton';
import ScrollProgress from '../components/ScrollProgress';
import WaveDivider from '../components/WaveDivider';
import ServiceCard3D from '../components/ServiceCard3D';
import './ModernHome.css';

const ModernHome = () => {
  const { content, editMode, addServiceItem } = useWebsiteContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
  const [serviceIcons, setServiceIcons] = useState([faHouse, faBuilding, faSprayCanSparkles, faScrewdriverWrench]);
  const [showAddService, setShowAddService] = useState(false);
  const [showOverlaySettings, setShowOverlaySettings] = useState(false);
  const [overlaySettings, setOverlaySettings] = useState({
    color1: '#7CB342',
    color2: '#00D9FF',
    color3: '#558B2F',
    opacity: 0.35
  });
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);

  const availableIcons = [
    { icon: faHouse, name: 'House' },
    { icon: faBuilding, name: 'Building' },
    { icon: faSprayCanSparkles, name: 'Spray' },
    { icon: faScrewdriverWrench, name: 'Tools' },
    { icon: faCar, name: 'Car' },
    { icon: faTruck, name: 'Truck' },
    { icon: faBroom, name: 'Broom' },
    { icon: faWater, name: 'Water' },
    { icon: faTree, name: 'Tree' },
    { icon: faIndustry, name: 'Industry' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observers = [];
    const sections = ['about', 'services', 'contact'];

    sections.forEach(sectionId => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
          }
        },
        { threshold: 0.3 }
      );

      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new'
      });

      setSubmitStatus({
        type: 'success',
        message: 'Thank you! We\'ll get back to you soon.'
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIconChange = (index) => {
    setSelectedServiceIndex(index);
    setShowIconSelector(true);
  };

  const handleIconSelect = (icon) => {
    const newIcons = [...serviceIcons];
    newIcons[selectedServiceIndex] = icon;
    setServiceIcons(newIcons);
    setShowIconSelector(false);
  };

  const handleAddService = async () => {
    await addServiceItem({
      title: 'New Service',
      description: 'Click to edit this service description'
    });
    // Add a default icon for the new service
    setServiceIcons([...serviceIcons, faSprayCanSparkles]);
    setShowAddService(false);
  };

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getOverlayStyle = () => {
    return {
      background: `linear-gradient(135deg,
        ${hexToRgba(overlaySettings.color1, overlaySettings.opacity)} 0%,
        ${hexToRgba(overlaySettings.color2, overlaySettings.opacity * 0.85)} 50%,
        ${hexToRgba(overlaySettings.color3, overlaySettings.opacity)} 100%
      )`,
      backgroundSize: '200% 200%',
      animation: 'gradientShift 15s ease infinite'
    };
  };

  return (
    <div className="modern-home">
      <WaterDroplets />
      <ScrollProgress />
      <FloatingButton />

      {/* Hero Section */}
      <EditableBackgroundImage
        section="hero"
        field="backgroundImage"
        className="modern-hero"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      >
        {/* Floating particles */}
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{
                opacity: 0,
                y: 100,
                x: Math.random() * 100 - 50
              }}
              animate={{
                opacity: [0, 0.6, 0],
                y: -200,
                x: Math.random() * 100 - 50
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 3,
                repeat: Infinity,
                ease: "easeOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                bottom: 0
              }}
            />
          ))}
        </div>

        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.2,
              type: "spring",
              stiffness: 100
            }}
          >
            {/* Typewriter effect for title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <EditableText section="hero" field="title" as="h1" className="hero-title">
                {content.hero.title}
              </EditableText>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <EditableText section="hero" field="subtitle" as="p" className="hero-subtitle">
                {content.hero.subtitle}
              </EditableText>
            </motion.div>
            <RippleEffect
              className="hero-cta"
              onClick={() => {
                const contact = document.getElementById('contact');
                contact?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Started →
            </RippleEffect>
          </motion.div>
        </div>
        <div className="hero-overlay animated-gradient" style={getOverlayStyle()}></div>

        {/* Overlay Settings Button (only visible in edit mode) */}
        {editMode && (
          <button
            className="overlay-settings-btn"
            onClick={() => setShowOverlaySettings(true)}
            title="Edit overlay settings"
          >
            🎨 Edit Overlay
          </button>
        )}

        {/* Wave divider at bottom of hero */}
        <div className="hero-wave">
          <WaveDivider color="gray" />
        </div>
      </EditableBackgroundImage>

      {/* About Section */}
      <section id="about" className="modern-about">
        <div className="container">
          <motion.div className="about-grid">
            <motion.div
              className="about-content"
              initial={{ opacity: 0, x: -100 }}
              animate={visibleSections.about ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 1,
                type: "spring",
                stiffness: 80
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={visibleSections.about ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="section-tag">WHO WE ARE</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.about ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <EditableText section="about" field="title" as="h2" className="section-title">
                  {content.about.title}
                </EditableText>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.about ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <EditableText section="about" field="subtitle" as="h3" className="about-subtitle">
                  {content.about.subtitle}
                </EditableText>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.about ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <EditableText section="about" field="text1" as="p" multiline className="about-text">
                  {content.about.text1}
                </EditableText>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.about ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <EditableText section="about" field="text2" as="p" multiline className="about-text">
                  {content.about.text2}
                </EditableText>
              </motion.div>
            </motion.div>

            <motion.div
              className="about-image-wrapper"
              initial={{ opacity: 0, x: 100, rotate: 5 }}
              animate={visibleSections.about ? { opacity: 1, x: 0, rotate: 0 } : {}}
              transition={{
                duration: 1,
                delay: 0.3,
                type: "spring",
                stiffness: 80
              }}
            >
              <motion.div
                className="image-decoration"
                initial={{ scale: 0, rotate: -45 }}
                animate={visibleSections.about ? { scale: 1, rotate: 0 } : {}}
                transition={{ duration: 1, delay: 0.5, type: "spring" }}
              ></motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.4 }}
              >
                <EditableImage
                  section="about"
                  field="image"
                  alt="About Us"
                  className="about-image"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section with 3D Flip Cards */}
      <section id="services" className="modern-services">
        <WaveDivider flip color="green" />
        <div className="container">
          <motion.div
            className="services-header"
            initial={{ opacity: 0, y: 60 }}
            animate={visibleSections.services ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={visibleSections.services ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="section-tag">WHAT WE DO</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={visibleSections.services ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <EditableText section="services" field="title" as="h2" className="section-title">
                {content.services.title}
              </EditableText>
            </motion.div>
          </motion.div>

          <div className="services-grid">
            {content.services.items.map((service, index) => (
              <ServiceCard3D
                key={service.id}
                service={service}
                index={index}
                icon={serviceIcons[index] || faSprayCanSparkles}
                visibleSections={visibleSections.services}
                onIconChange={handleIconChange}
              />
            ))}
          </div>

          {/* Add Service Button (only visible in edit mode) */}
          {editMode && (
            <motion.button
              className="add-service-btn"
              onClick={handleAddService}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Service
            </motion.button>
          )}
        </div>
        <WaveDivider color="gray" />
      </section>

      {/* Gallery Section */}
      <ModernGallery />

      {/* Contact Section */}
      <section id="contact" className="modern-contact">
        <WaveDivider flip color="green" />
        <div className="container">
          <motion.div className="contact-grid">
            <motion.div
              className="contact-info-side"
              initial={{ opacity: 0, x: -100 }}
              animate={visibleSections.contact ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, type: "spring", stiffness: 80 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={visibleSections.contact ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="section-tag">GET IN TOUCH</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.contact ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <EditableText section="contact" field="title" as="h2" className="section-title">
                  {content.contact.title}
                </EditableText>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={visibleSections.contact ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <EditableText section="contact" field="subtitle" as="h3" className="contact-subtitle">
                  {content.contact.subtitle}
                </EditableText>
              </motion.div>

              <div className="contact-details">
                {[
                  { icon: '📍', title: 'Address', field: 'address' },
                  { icon: '📞', title: 'Phone', field: 'phone' },
                  { icon: '🕐', title: 'Hours', field: 'hours' }
                ].map((detail, index) => (
                  <motion.div
                    key={detail.field}
                    className="detail-item"
                    initial={{ opacity: 0, x: -50 }}
                    animate={visibleSections.contact ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    whileHover={{
                      x: 10,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <motion.div
                      className="detail-icon"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {detail.icon}
                    </motion.div>
                    <div className="detail-content">
                      <h4>{detail.title}</h4>
                      <EditableText section="contact" field={detail.field} as="p" multiline={detail.field === 'address'}>
                        {content.contact[detail.field]}
                      </EditableText>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="contact-form-side"
              initial={{ opacity: 0, x: 100 }}
              animate={visibleSections.contact ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 80 }}
            >
              <form onSubmit={handleSubmit} className="modern-contact-form">
                <div className="form-row">
                  <motion.div
                    className="form-group"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name *"
                      required
                      className="animated-input"
                    />
                  </motion.div>
                  <motion.div
                    className="form-group"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email *"
                      required
                      className="animated-input"
                    />
                  </motion.div>
                </div>

                <motion.div
                  className="form-group"
                  whileFocus={{ scale: 1.02 }}
                >
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone"
                    className="animated-input"
                  />
                </motion.div>

                <motion.div
                  className="form-group"
                  whileFocus={{ scale: 1.02 }}
                >
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message *"
                    rows="5"
                    required
                    className="animated-input"
                    maxLength={500}
                  ></textarea>
                  <div className="character-count">
                    {formData.message.length}/500
                  </div>
                </motion.div>

                {submitStatus.message && (
                  <motion.div
                    className={`status-message ${submitStatus.type}`}
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {submitStatus.type === 'success' && (
                      <motion.span
                        className="success-icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        ✓
                      </motion.span>
                    )}
                    {submitStatus.message}
                  </motion.div>
                )}

                <RippleEffect
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-btn"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message →'}
                </RippleEffect>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Icon Selector Modal */}
      {showIconSelector && (
        <div className="modal-overlay" onClick={() => setShowIconSelector(false)}>
          <div className="modal-content icon-selector-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select an Icon</h3>
            <div className="icon-grid">
              {availableIcons.map((item, idx) => (
                <button
                  key={idx}
                  className="icon-option"
                  onClick={() => handleIconSelect(item.icon)}
                  title={item.name}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
            <button className="close-modal-btn" onClick={() => setShowIconSelector(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Overlay Settings Modal */}
      {showOverlaySettings && (
        <div className="modal-overlay" onClick={() => setShowOverlaySettings(false)}>
          <div className="modal-content overlay-settings-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Hero Overlay Settings</h3>
            <div className="overlay-controls">
              <div className="control-group">
                <label>Color 1 (Left)</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={overlaySettings.color1}
                    onChange={(e) => setOverlaySettings({ ...overlaySettings, color1: e.target.value })}
                  />
                  <span>{overlaySettings.color1}</span>
                </div>
              </div>
              <div className="control-group">
                <label>Color 2 (Center)</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={overlaySettings.color2}
                    onChange={(e) => setOverlaySettings({ ...overlaySettings, color2: e.target.value })}
                  />
                  <span>{overlaySettings.color2}</span>
                </div>
              </div>
              <div className="control-group">
                <label>Color 3 (Right)</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={overlaySettings.color3}
                    onChange={(e) => setOverlaySettings({ ...overlaySettings, color3: e.target.value })}
                  />
                  <span>{overlaySettings.color3}</span>
                </div>
              </div>
              <div className="control-group">
                <label>Opacity: {Math.round(overlaySettings.opacity * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={overlaySettings.opacity}
                  onChange={(e) => setOverlaySettings({ ...overlaySettings, opacity: parseFloat(e.target.value) })}
                  className="opacity-slider"
                />
              </div>
              <div className="overlay-preview" style={getOverlayStyle()}>
                <p>Preview</p>
              </div>
            </div>
            <button className="close-modal-btn" onClick={() => setShowOverlaySettings(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernHome;
