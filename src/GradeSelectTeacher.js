import React from 'react';
import { Hexagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './App.css';
import Footer from './Footer';

const GradeSelect = () => {
  const navigate = useNavigate(); // Initialize navigate

  const GradeCard = ({ grade, route, className }) => (
    <div
      className={`w-56 h-48 bg-primary shadow-lg flex flex-col items-center justify-center cursor-pointer relative ${className}`}
      onClick={() => navigate(route)} // Navigate to the specified route
    >
      <div className="absolute inset-0 flex flex-wrap justify-center items-center pointer-events-none">
        {[...Array(10)].map((_, index) => (
          <Hexagon key={index} className="h-10 w-10 text-white opacity-20" />
        ))}
      </div>
      <p className="text-6xl font-bold mb-4 text-white z-10">{grade}</p>
      <p className="text-2xl font-semibold mb-4 text-white z-10">Grade</p>
    </div>
  );

  const OtherCard = ({ className }) => (
    <div
      className={`w-56 h-48 bg-primary shadow-lg flex flex-col items-center justify-center cursor-pointer relative ${className}`}
    >
      <div className="absolute inset-0 flex flex-wrap justify-center items-center pointer-events-none">
        {[...Array(10)].map((_, index) => (
          <Hexagon key={index} className="h-10 w-10 text-white opacity-20" />
        ))}
      </div>
      <p className="text-5xl font-semibold mb-4 text-white z-10">Other</p>
    </div>
  );

  return (
    <div className="mx-auto min-h-screen flex flex-col pb-20">
      <div className="container mx-auto flex flex-col h-full">
        <h1 className="text-4xl font-semibold text-center mb-10 mt-4">
          Select your grade to <br /> add learning resources.
        </h1>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-24 gap-y-10 justify-items-center mb-4">
          <GradeCard grade={6} route="/Teacher6/Dashboard" /> {/* Specify the route for Grade 6 */}
          <GradeCard grade={7} route="/Teacher7/Dashboard" /> {/* Specify the route for Grade 7 */}
          <GradeCard grade={8} route="/Teacher8/Dashboard" /> {/* Specify the route for Grade 8 */}
          <GradeCard grade={9} route="/Grade9/Dashboard9" /> {/* Specify the route for Grade 9 */}
          <GradeCard grade={10} route="/Grade10/Dashboard10" /> {/* Specify the route for Grade 10 */}
          <GradeCard grade={11} route="/Grade11/Dashboard11" /> {/* Specify the route for Grade 11 */}
          <OtherCard />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GradeSelect;