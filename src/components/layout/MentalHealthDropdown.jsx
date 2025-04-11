
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const MentalHealthDropdown = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${isMobile ? 'w-full' : ''}`}>
      <button 
        onClick={toggleDropdown}
        className={`flex items-center text-gray-700 hover:text-oasis-primary focus:outline-none ${
          isMobile ? 'w-full justify-between py-2' : ''
        }`}
      >
        <span>Mental Health Resources</span>
        {isOpen ? 
          <ChevronUp className={`h-4 w-4 ml-1 ${isMobile ? 'ml-2' : ''}`} /> : 
          <ChevronDown className={`h-4 w-4 ml-1 ${isMobile ? 'ml-2' : ''}`} />
        }
      </button>
      
      {isOpen && (
        <div className={`
          ${isMobile 
            ? 'mt-2 bg-gray-50 rounded-md p-4' 
            : 'absolute left-0 mt-2 w-72 bg-white rounded-md shadow-lg p-4 z-50'
          }
        `}>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-oasis-primary mb-2">Common Disorders</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-700 hover:text-oasis-primary text-sm">Anxiety Disorders</a></li>
                <li><a href="#" className="text-gray-700 hover:text-oasis-primary text-sm">Depression</a></li>
                <li><a href="#" className="text-gray-700 hover:text-oasis-primary text-sm">PTSD</a></li>
                <li><a href="#" className="text-gray-700 hover:text-oasis-primary text-sm">Bipolar Disorder</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-oasis-primary mb-2">Self-Care Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-700 hover:text-oasis-primary text-sm">Meditation Guides</a></li>
                <li><a href="#" className="text-gray-700 hover:text-oasis-primary text-sm">Stress Management</a></li>
                <li><a href="#" className="text-gray-700 hover:text-oasis-primary text-sm">Sleep Hygiene</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-oasis-primary mb-2">Emergency Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-700 hover:text-oasis-primary text-sm">Crisis Hotlines</a></li>
                <li><a href="#" className="text-gray-700 hover:text-oasis-primary text-sm">Suicide Prevention</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentalHealthDropdown;
