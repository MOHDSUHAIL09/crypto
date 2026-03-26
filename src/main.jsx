import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/Css/animate.css'
import './assets/Css/responsive.css'
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <App />
    </BrowserRouter>
)
