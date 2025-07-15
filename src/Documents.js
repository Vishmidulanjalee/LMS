import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import SidebarNew from './SidebarNew';

const documentTypes = [
  { name: 'Paper Mint Papers ', route: '/docs/papermint' },
  { name: 'A පාර Papers', route: '/docs/apara' },
  { name: 'Tutes', route: '/docs/tutes' },
  { name: 'Other', route: '/docs/other' },
];

const Documents = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-serif">
      <div className="flex flex-row flex-grow">
        <SidebarNew activeItem="Documents" />
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <h1 className="text-3xl font-bold text-gray-800 font-mulish">View Documents</h1>
            </div>
          </header>

          <main className="flex-grow px-6 py-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {documentTypes.map((doc, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition font-sans">
                  <h2 className="text-2xl font-bold text-black mb-2 font-serif">{doc.name}</h2>
                  <p className="text-gray-500 mb-4 font-serif text-md">
                    Explore all files related to {doc.name}.
                  </p>
                  <button
                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 font-bold font-sans"
                    onClick={() => navigate(doc.route)}
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

export default Documents;
