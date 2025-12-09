import { createContext, useContext, useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import { useAuth } from './AuthContext';

const WebsiteContentContext = createContext();

export const useWebsiteContent = () => {
  const context = useContext(WebsiteContentContext);
  if (!context) {
    throw new Error('useWebsiteContent must be used within WebsiteContentProvider');
  }
  return context;
};

const defaultContent = {
  hero: {
    title: 'CountyWide Pressure Washing',
    subtitle: 'Professional Pressure Washing Services',
    backgroundImage: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1920&q=80',
    overlayColor1: '#7CB342',
    overlayColor2: '#00D9FF',
    overlayColor3: '#558B2F',
    overlayOpacity: 0.35
  },
  about: {
    title: 'About Us',
    subtitle: 'Your Trusted Pressure Washing Professionals',
    text1: 'CountyWide Pressure Washing provides professional pressure washing services for residential and commercial properties. We use state-of-the-art equipment and eco-friendly cleaning solutions to deliver exceptional results.',
    text2: 'Our experienced team is dedicated to restoring and maintaining the beauty of your property. From driveways and sidewalks to building exteriors and decks, we handle it all with precision and care.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    logoOpacity: 1
  },
  services: {
    title: 'Our Services',
    items: [
      { id: 1, title: 'Residential Pressure Washing', description: 'Complete exterior cleaning for homes, driveways, and patios' },
      { id: 2, title: 'Commercial Cleaning', description: 'Professional cleaning services for commercial properties and buildings' },
      { id: 3, title: 'Deck & Fence Cleaning', description: 'Restore and protect your outdoor wood structures' },
      { id: 4, title: 'Gutter Cleaning', description: 'Keep your gutters clean and functioning properly' }
    ]
  },
  gallery: {
    title: 'Our Work',
    subtitle: 'See the difference professional pressure washing makes',
    images: [
      { id: 1, url: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&q=80', caption: 'House Exterior Cleaning' },
      { id: 2, url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80', caption: 'Driveway Cleaning' },
      { id: 3, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', caption: 'Deck Restoration' },
      { id: 4, url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', caption: 'Commercial Building' },
      { id: 5, url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80', caption: 'Patio Cleaning' },
      { id: 6, url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&q=80', caption: 'Fence Cleaning' }
    ]
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'Get A Free Quote Today',
    address: '123 Main Street\nYour City, ST 12345',
    phone: '(555) 123-4567',
    hours: 'Monday - Saturday: 8:00 AM - 6:00 PM'
  },
  navbar: {
    companyName: 'CountyWide Pressure Washing',
    phone: '(555) 123-4567'
  }
};

export const WebsiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [pendingContent, setPendingContent] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Load content from content.json in public folder with cache-busting
      const response = await fetch(`/content.json?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        // Use default content if file doesn't exist
        setContent(defaultContent);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContent(defaultContent);
    } finally {
      setLoading(false);
    }
  };

  const commitToGitHub = async (newContent, commitMessage) => {
    // Check if another save is in progress
    if (isSaving) {
      return {
        success: false,
        error: 'Please wait until the previous change has finished deploying before making another edit.'
      };
    }

    setIsSaving(true);

    try {
      const maxRetries = 3;
      let attempt = 0;

      while (attempt < maxRetries) {
        try {
          const token = import.meta.env.VITE_GITHUB_TOKEN;
          const owner = import.meta.env.VITE_GITHUB_OWNER;
          const repo = import.meta.env.VITE_GITHUB_REPO;
          const path = 'pressure-washing-site/public/content.json';
          const branch = 'main';

          if (!token || !owner || !repo) {
            throw new Error('Missing GitHub configuration. Please check environment variables.');
          }

          const octokit = new Octokit({
            auth: token
          });

          // Get the latest file SHA right before committing
          const { data: currentFile } = await octokit.repos.getContent({
            owner,
            repo,
            path,
            ref: branch
          });

          // Update the file with the latest SHA
          await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: commitMessage,
            content: btoa(JSON.stringify(newContent, null, 2)),
            sha: currentFile.sha,
            branch
          });

          console.log('Commit successful! Waiting for Vercel deployment...');

          // Wait 5 seconds for Vercel to start deploying, then reload content
          await new Promise(resolve => setTimeout(resolve, 5000));
          await loadContent();

          setIsSaving(false);
          return { success: true };
        } catch (error) {
          attempt++;
          console.error(`Commit attempt ${attempt} failed:`, error.message);

          // If it's a SHA mismatch error and we have retries left, try again
          if (error.message.includes('does not match') && attempt < maxRetries) {
            console.log('SHA mismatch detected, retrying...');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
            continue;
          }

          // If it's a different error or we're out of retries, give up
          console.error('Error committing to GitHub:', error);
          setIsSaving(false);

          // Return user-friendly error message
          if (error.message.includes('does not match')) {
            return {
              success: false,
              error: 'Please wait until the previous change has finished deploying before making another edit.'
            };
          }

          return { success: false, error: 'Failed to save changes. Please try again.' };
        }
      }

      setIsSaving(false);
      return {
        success: false,
        error: 'Please wait until the previous change has finished deploying before making another edit.'
      };
    } catch (error) {
      setIsSaving(false);
      return { success: false, error: 'Failed to save changes. Please try again.' };
    }
  };

  const updateContent = async (section, field, value) => {
    try {
      const newContent = { ...content };

      if (field.includes('.')) {
        // Handle nested fields like "items.0.title"
        const parts = field.split('.');
        let current = newContent[section];
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
      } else {
        newContent[section][field] = value;
      }

      // Save locally only
      setContent(newContent);
      setPendingContent(newContent);
      setHasPendingChanges(true);

      return { success: true };
    } catch (error) {
      console.error('Error updating content:', error);
      return { success: false, error: error.message };
    }
  };

  const addServiceItem = async (newService) => {
    try {
      const newContent = { ...content };
      const maxId = Math.max(...newContent.services.items.map(s => s.id), 0);
      newContent.services.items.push({
        id: maxId + 1,
        ...newService
      });

      setContent(newContent);
      setPendingContent(newContent);
      setHasPendingChanges(true);

      return { success: true };
    } catch (error) {
      console.error('Error adding service:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteServiceItem = async (serviceId) => {
    try {
      const newContent = { ...content };
      newContent.services.items = newContent.services.items.filter(s => s.id !== serviceId);

      setContent(newContent);
      setPendingContent(newContent);
      setHasPendingChanges(true);

      return { success: true };
    } catch (error) {
      console.error('Error deleting service:', error);
      return { success: false, error: error.message };
    }
  };

  const addGalleryImage = async (newImage) => {
    try {
      const newContent = { ...content };
      const maxId = Math.max(...newContent.gallery.images.map(img => img.id), 0);
      newContent.gallery.images.push({
        id: maxId + 1,
        ...newImage
      });

      setContent(newContent);
      setPendingContent(newContent);
      setHasPendingChanges(true);

      return { success: true };
    } catch (error) {
      console.error('Error adding gallery image:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteGalleryImage = async (imageId) => {
    try {
      const newContent = { ...content };
      newContent.gallery.images = newContent.gallery.images.filter(img => img.id !== imageId);

      setContent(newContent);
      setPendingContent(newContent);
      setHasPendingChanges(true);

      return { success: true };
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      return { success: false, error: error.message };
    }
  };

  const updateGalleryImage = async (imageId, updates) => {
    try {
      const newContent = { ...content };
      const imageIndex = newContent.gallery.images.findIndex(img => img.id === imageId);
      if (imageIndex !== -1) {
        newContent.gallery.images[imageIndex] = {
          ...newContent.gallery.images[imageIndex],
          ...updates
        };
      }

      setContent(newContent);
      setPendingContent(newContent);
      setHasPendingChanges(true);

      return { success: true };
    } catch (error) {
      console.error('Error updating gallery image:', error);
      return { success: false, error: error.message };
    }
  };

  const publishChanges = async () => {
    if (!hasPendingChanges || !pendingContent) {
      return { success: false, error: 'No pending changes to publish' };
    }

    const commitMessage = `Publish changes via admin panel`;
    const result = await commitToGitHub(pendingContent, commitMessage);

    if (result.success) {
      setHasPendingChanges(false);
      setPendingContent(null);
    }

    return result;
  };

  const discardChanges = async () => {
    // Reload content from server
    await loadContent();
    setHasPendingChanges(false);
    setPendingContent(null);
  };

  const toggleEditMode = () => {
    if (isAdmin) {
      setEditMode(!editMode);
    }
  };

  const value = {
    content,
    loading,
    editMode,
    isSaving,
    hasPendingChanges,
    toggleEditMode,
    updateContent,
    addServiceItem,
    deleteServiceItem,
    addGalleryImage,
    deleteGalleryImage,
    updateGalleryImage,
    publishChanges,
    discardChanges
  };

  return (
    <WebsiteContentContext.Provider value={value}>
      {children}
    </WebsiteContentContext.Provider>
  );
};
