import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
// import IndexPage from './pages/IndexPage';

import TestPage from './pages/TestPage';


  function App() {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {/* <IndexPage /> */}
          <TestPage />
        </main>
        <Footer />
      </div>
    );
  }
  
  export default App;
