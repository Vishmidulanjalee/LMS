import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import SidebarNew from './SidebarNew';

const months = [
  { name: 'July', route: '/marks/july' },
  { name: 'August', route: '/marks/august' },
  { name: 'September', route: '/marks/september' },
  
  // Add more months as needed
];

const Marks = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-serif">
      <div className="flex flex-row flex-grow">
        <SidebarNew activeItem="Marks" />
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <h1 className="text-3xl font-bold text-gray-800 font-mulish text align-middle">View Mark Sheets</h1>
            </div>
          </header>

          <main className="flex-grow px-6 py-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {months.map((month, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition font-sans"
                >
                  <h2 className="text-2xl font-bold text-black mb-2 font-serif">{month.name}</h2>
                  <p className="text-gray-500 mb-4 font-serif">
                    Explore all mark sheets related to {month.name}.
                  </p>
                  <button
                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 font-bold font-sans"
                    onClick={() => navigate(month.route)}
                  >
                    View Now
                  </button>
                </div>
              ))}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Marks;
