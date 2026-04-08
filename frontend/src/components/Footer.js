import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon,
  MailIcon, 
  PhoneIcon, 
  LocationMarkerIcon,
  GlobeAltIcon
} from '@heroicons/react/outline';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <SparklesIcon className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold">CropResidue</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              AI-powered platform connecting farmers with buyers for sustainable crop residue management, 
              promoting environmental benefits and increased farmer income.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-green-400 transition-colors">
                <GlobeAltIcon className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-green-400 transition-colors">
                <MailIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-300 hover:text-green-400 transition-colors">
                  {t('common.marketplace')}
                </Link>
              </li>
              <li>
                <Link to="/residue-estimation" className="text-gray-300 hover:text-green-400 transition-colors">
                  {t('common.residue_estimation')}
                </Link>
              </li>
              <li>
                <Link to="/environmental-impact" className="text-gray-300 hover:text-green-400 transition-colors">
                  {t('common.environmental_impact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MailIcon className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">info@cropresidue.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">+91 1234567890</span>
              </div>
              <div className="flex items-center space-x-2">
                <LocationMarkerIcon className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              2024 CropResidue Management System. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                Terms of Service
              </button>
              <button className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
