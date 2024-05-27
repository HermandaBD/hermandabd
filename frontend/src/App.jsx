import React from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}

export default App;
