import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title = 'The Grrrls Club - Fashion & Lifestyle',
  description = 'Discover unique fashion items, accessories, and lifestyle products at The Grrrls Club. Shop now for the latest trends and exclusive collections.',
  keywords = 'fashion, lifestyle, clothing, accessories, shopping, women, style',
  image = '/logo.png',
  url = window.location.href,
  type = 'website'
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="The Grrrls Club" />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="The Grrrls Club" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#DE5499" />
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" href="/logo.png" />
      <link rel="apple-touch-icon" href="/logo.png" />
    </Helmet>
  );
};

export default SEOHead;
