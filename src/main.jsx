import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/Css/bootstrap.min.css';
import './assets/Css/animate.css'
import "./assets/Css/index.css"
import './assets/Css/responsive.css'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)