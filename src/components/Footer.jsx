import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/home" className="navbar-logo">
              <img 
                src="/logo.png" 
                alt="NextLevelPC" 
                className="footer-logo" 
              />
            </Link>
            <p className="footer-message">
              "Potencia tu experiencia gaming con tecnología de vanguardia y rendimiento excepcional."
            </p>
          </div>
          
          {/* Contact Section */}
          <div className="footer-contact">
            <h4>Contacto</h4>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>NextLevelPC@gmail.com</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-tools"></i>
                <span>Soporte Técnico</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <span>Lun-Vie: 9:00-18:00</span>
              </div>
            </div>
          </div>
          
          {/* Social Media Section */}
          <div className="footer-social">
            <h4>Síguenos</h4>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Mocoa, Colombia</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-shipping-fast"></i>
                <span>Envíos Nacionales</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NextLevelPC. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;