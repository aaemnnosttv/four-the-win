import React from 'react';
import Board from './Board';
import { RegistryProvider } from '@wordpress/data';
import { registry } from './data';
import Header from './Header';
import './index.css'

export default function App() {
  return (
    <div className="md:max-w-screen-md max-w-screen-lg mx-auto flex h-full flex-col">
      <RegistryProvider value={registry}>
        <Header />
        <Board />
      </RegistryProvider>
    </div>
  );
}
