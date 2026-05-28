import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Service worker dimatikan permanen. Versi lama (cache-first) sempat menahan
// JS bundle lama di browser. Kita hanya register /sw.js (yang sekarang adalah
// self-destruct) bila browser masih punya SW lama yang aktif — supaya tidak
// terjadi loop register-activate-reload pada user yang sudah bersih.
if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (_) {
      // Abaikan — kalau gagal register, browser tetap fetch dari network.
    }
  });
}
