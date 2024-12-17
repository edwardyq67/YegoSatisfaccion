// App.js
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Satisfaccion from './yego/Satisfaccion';
import ProtectedRoutes from './ProtectedRoutes';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoutes />} >
          <Route path="/Satisfaccion" element={<Satisfaccion />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
