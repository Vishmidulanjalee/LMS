import React from 'react';
import { Hexagon } from 'lucide-react';
import './App.css';
import Footer from './Footer';

const GradeSelect = () => {
  const GradeCard = ({ grade, className }) => (
    <div
      className={`w-56 h-48 bg-primary shadow-lg flex flex-col items-center justify-center cursor-pointer  relative ${className}`}
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
      className={`w-56 h-48 bg-primary shadow-lg flex flex-col items-center justify-center cursor-pointer  relative ${className}`}
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
          Select your grade to access courses <br /> and start learning.
        </h1>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-24 gap-y-10 justify-items-center mb-4">
          <GradeCard grade={6} />
          <GradeCard grade={7} />
          <GradeCard grade={8} />
          <GradeCard grade={9} />
          <GradeCard grade={10} />
          <GradeCard grade={11} />
          <OtherCard />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GradeSelect;
