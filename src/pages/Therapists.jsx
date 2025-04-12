import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TherapistCard from '@/components/therapists/TherapistCard';
import TherapistFilters from '@/components/therapists/TherapistFilters';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

const Therapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Fetch therapists from backend
  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/therapist/all-therapists');
      setTherapists(response.data.therapists);
      setFilteredTherapists(response.data.therapists);
      console.log(filteredTherapists);
      
    } catch (err) {
      console.error('Failed to fetch therapists:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/therapists' } });
    } else if (!isLoading && isAuthenticated) {
      fetchTherapists();
    }
  }, [isAuthenticated, isLoading]);

  // Filter logic
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setLoading(true);

    setTimeout(() => {
      let results = [...therapists];

      const {
        searchQuery,
        specialization,
        priceRange,
        minRating,
        languages,
        availability
      } = newFilters;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        results = results.filter(
          t => t.name.toLowerCase().includes(q) || t.specialization.toLowerCase().includes(q)
        );
      }

      if (specialization) {
        results = results.filter(t => t.specialization === specialization);
      }

      if (priceRange) {
        results = results.filter(
          t =>
            t.pricePerSession >= priceRange[0] &&
            t.pricePerSession <= priceRange[1]
        );
      }

      if (minRating) {
        results = results.filter(t => t.rating >= minRating);
      }

      if (languages?.length) {
        results = results.filter(t =>
          languages.some(lang => t.languages.includes(lang))
        );
      }

      if (availability?.length) {
        results = results.filter(t =>
          availability.some(slot => t.availability.includes(slot))
        );
      }

      setFilteredTherapists(results);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-oasis-dark mb-4">Find Your Therapist</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with licensed therapists who specialize in a variety of areas.
              Our professionals are here to support your mental health journey.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 flex-shrink-0">
              <TherapistFilters onFilterChange={handleFilterChange} />
            </div>

            <div className="flex-grow">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oasis-primary"></div>
                </div>
              ) : filteredTherapists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTherapists.map(therapist => (
                    <TherapistCard key={therapist._id} {...therapist} />
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
