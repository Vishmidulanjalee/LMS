import React from 'react'
import Sidebar from './Sidebar'
import Logo from "./assets/Logo.png"

function Other() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 md:px-8 lg:px-16">
          <div className="w-full max-w-2xl mx-auto">
            <div className="flex flex-col items-center p-6 md:p-8 lg:p-10">
              <div className="text-center mb-10">
                <p className="text-gray-600 text-sm md:text-base lg:text-lg">
                  Check back later for more information.
                </p>
              </div>
              
              <div className="opacity-60">
                <img
                  src={Logo}
                  alt="Bee Academy Logo"
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Other