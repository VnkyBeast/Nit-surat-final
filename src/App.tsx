import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import Map from './components/Map';
import { Crime } from './types';

function App() {
  const [crimes, setCrimes] = useState<Crime[]>([]);

  const handleCrimeReported = (crime: Crime) => {
    setCrimes([...crimes, crime]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              Crime Reporting Map
            </h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-[600px]">
            <Map crimes={crimes} onCrimeReported={handleCrimeReported} />
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Reports ({crimes.length})
            </h2>
            <div className="space-y-4">
              {crimes.map((crime) => (
                <div
                  key={crime.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-medium text-gray-900">
                        {crime.type}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {crime.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        crime.severity === 'high'
                          ? 'bg-red-100 text-red-800'
                          : crime.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {crime.severity.charAt(0).toUpperCase() + crime.severity.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <time dateTime={crime.date}>
                      {new Date(crime.date).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;