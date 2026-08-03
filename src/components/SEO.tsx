import React, { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  image?: string;
}

export function SEO({ 
  title, 
  description, 
  keywords = 'Smart Restaurant Menu, QR Code Menu, NFC Menu, Digital Menu, Restaurant Management', 
  url = 'https://smart-restaurant-menu.app', 
  image = 'https://smart-restaurant-menu.app/og-image.jpg' 
}: SEOProps) {
  useEffect(() => {
    // 1. Basic Meta Tags
    document.title = title;
    
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);

    // 2. Open Graph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:image', image);

    // 3. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // 4. JSON-LD Structured Data
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    
    const jsonLdData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": title,
          "description": description,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "url": url
        },
        {
          "@type": "ProfessionalService",
          "name": "Smart Restaurant Solutions",
          "description": "Digital menu and restaurant management platform",
          "url": url,
          "telephone": "+1-555-0100",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dubai",
            "addressRegion": "Dubai",
            "addressCountry": "AE"
          }
        }
      ]
    };
    script.textContent = JSON.stringify(jsonLdData);
    
  }, [title, description, keywords, url, image]);

  return null;
}
