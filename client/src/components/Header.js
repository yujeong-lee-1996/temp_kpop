import React from 'react';
import '../styles/Header.css';

export default function Header() {
  return (
    <header className="bg-red-200 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Kpop Dance Feedback</h1>
      <nav className="space-x-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/upload" className="hover:underline">Upload</a>
        <a href="/history" className="hover:underline">History</a>
        <a href="/settings" className="hover:underline">Settings</a>
      </nav>
    </header>
  );
}
