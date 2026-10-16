import React, { useState } from 'react';
import PortfolioHero from '../components/PortfolioHero/PortfolioHero';
import PortfolioGrid from '../components/PortfolioGrid/PortfolioGrid';

const Portfolio = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  return (
    <div className="portfolio-page">
      <PortfolioHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
      <PortfolioGrid 
        externalCategory={selectedTag}
        externalSearch={searchQuery}
      />
    </div>
  );
};

export default Portfolio;
