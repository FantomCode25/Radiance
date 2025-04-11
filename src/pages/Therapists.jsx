import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TherapistCard from '@/components/therapists/TherapistCard';
import TherapistFilters from '@/components/therapists/TherapistFilters';
import { useAuth } from '@/hooks/useAuth';

// Mock data for therapists
const therapistsData = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    age: 38,
    image: '/therapist-1.jpg',
    rating: 4.9,
    specialization: 'Anxiety',
    experience: 12,
    education: 'Ph.D. in Clinical Psychology, Stanford University',
    languages: ['English', 'Spanish'],
    pricePerSession: 120,
    availability: 'Weekdays, Evenings'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    age: 45,
    image: '/therapist-2.jpg',
    rating: 4.7,
    specialization: 'Depression',
    experience: 15,
    education: 'Ph.D. in Psychology, Harvard University',
    languages: ['English', 'Mandarin'],
    pricePerSession: 130,
    availability: 'Weekdays, Weekends'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    age: 32,
    image: '/therapist-3.jpg',
    rating: 4.8,
    specialization: 'Relationship Issues',
    experience: 8,
    education: 'Psy.D. in Clinical Psychology, UCLA',
    languages: ['English', 'Spanish'],
    pricePerSession: 110,
    availability: 'Evenings, Weekends'
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    age: 41,
    image: '/therapist-4.jpg',
    rating: 4.5,
    specialization: 'Trauma & PTSD',
    experience: 14,
    education: 'Ph.D. in Clinical Psychology, Columbia University',
    languages: ['English'],
    pricePerSession: 135,
    availability: 'Weekdays, Early Morning'
  },
  {
    id: '5',
    name: 'Dr. Aisha Patel',
    age: 36,
    image: '/therapist-5.jpg',
    rating: 4.9,
    specialization: 'Stress Management',
    experience: 10,
    education: 'Ph.D. in Counseling Psychology, University of Michigan',
    languages: ['English', 'Hindi', 'Gujarati'],
    pricePerSession: 125,
    availability: 'Weekdays, Evenings'
  },
  {
    id: '6',
    name: 'Dr. Robert Kim',
    age: 48,
    image: '/therapist-6.jpg',
    rating: 4.6,
    specialization: 'Grief',
    experience: 20,
    education: 'Ph.D. in Clinical Psychology, NYU',
    languages: ['English', 'Korean'],
    pricePerSession: 140,
    availability: 'Weekdays'
  },
  {
    id: '7',
    name: 'Dr. Lisa Thompson',
    age: 39,
    image: '/therapist-7.jpg',
    rating: 4.8,
    specialization: 'Self-Esteem',
    experience: 11,
    education: 'Ph.D. in Psychology, University of Chicago',
    languages: ['English', 'French'],
    pricePerSession: 115,
    availability: 'Evenings, Weekends'
  },
  {
    id: '8',
    name: 'Dr. David Martinez',
    age: 43,
    image: '/therapist-8.jpg',
    rating: 4.7,
    specialization: 'Addiction',
    experience: 16,
    education: 'Psy.D. in Clinical Psychology, Rutgers University',
    languages: ['English', 'Spanish'],
    pricePerSession: 130,
    availability: 'Weekdays, Weekends'
  }
];

const Therapists = () => {
  const [filteredTherapists, setFilteredTherapists] = useState(therapistsData);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/therapists' } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Apply filters
  const handleFilterChange = (newFilters) => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let results = [...therapistsData];
      
      // Apply search query filter
      if (newFilters.searchQuery) {
        const query = newFilters.searchQuery.toLowerCase();
        results = results.filter(
          therapist =>
            therapist.name.toLowerCase().includes(query) ||
            therapist.specialization.toLowerCase().includes(query)
        );
      }
      
      // Apply specialization filter
      if (newFilters.specialization) {
        results = results.filter(
          therapist => therapist.specialization === newFilters.specialization
        );
      }
      
      // Apply price range filter
      if (newFilters.priceRange) {
        results = results.filter(
          therapist =>
            therapist.pricePerSession >= newFilters.priceRange[0] &&
            therapist.pricePerSession <= newFilters.priceRange[1]
        );
      }
      
      // Apply rating filter
      if (newFilters.minRating) {
        results = results.filter(
          therapist => therapist.rating >= newFilters.minRating
        );
      }
      
      // Apply languages filter
      if (newFilters.languages && newFilters.languages.length > 0) {
        results = results.filter(therapist =>
          newFilters.languages.some(lang =>
            therapist.languages.includes(lang)
          )
        );
      }
      
      // Apply availability filter
      if (newFilters.availability && newFilters.availability.length > 0) {
        results = results.filter(therapist =>
          newFilters.availability.some(avail =>
            therapist.availability.includes(avail)
          )
        );
      }
      
      setFilteredTherapists(results);
      setFilters(newFilters);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-oasis-dark mb-4">Find Your Therapist</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with licensed therapists who specialize in a variety of areas.
              Our professionals are here to support your mental health journey.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar filters */}
            <div className="w-full md:w-64 flex-shrink-0">
              <TherapistFilters onFilterChange={handleFilterChange} />
            </div>
            
            {/* Therapist cards grid */}
            <div className="flex-grow">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oasis-primary"></div>
                </div>
              ) : filteredTherapists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTherapists.map(therapist => (
                    <TherapistCard key={therapist.id} {...therapist} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No therapists found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any therapists matching your criteria.
                    Try adjusting your filters to see more results.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Therapists;
