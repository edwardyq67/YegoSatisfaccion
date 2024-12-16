// App.js
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Inicio from './Inicio';
import ProtectedRoutes from './ProtectedRoutes';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />} >
          <Route path="/Inicio" element={<Inicio />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
