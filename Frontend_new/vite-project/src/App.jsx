import React, { useRef, useState } from "react";
import IntroSection from "./components/IntroSection";
import ResumeForm from "./components/ResumeForm";

function App() {
  const formRef = useRef(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResults = (newResults) => {
    setResults(newResults);
    if (newResults.length > 0) {
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JF</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Job Finder</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-600 hover:text-blue-600 transition">Home</a>
              <a href="#upload" className="text-gray-600 hover:text-blue-600 transition">Upload</a>
              <a href="#results" className="text-gray-600 hover:text-blue-600 transition">Results</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div id="home" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <IntroSection onGetStarted={scrollToForm} />
          <div id="upload" ref={formRef} className="transform transition-all duration-500 hover:scale-105">
            <ResumeForm onResults={handleResults} onLoading={handleLoading} />
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div id="results-section" className="mt-16 space-y-6">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  🎯 Found {results.length} Job Opportunities
                </h2>
                <p className="text-gray-600">
                  Based on your resume analysis and current market data
                </p>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((job, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="text-blue-600 font-medium mb-1">{job.company}</p>
                      <p className="text-gray-600 text-sm mb-3">📍 {job.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.source === 'RapidAPI' ? 'bg-green-100 text-green-800' :
                      job.source === 'DuckDuckGo' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.source}
                    </span>
                  </div>
                  
                  {job.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {job.description}
                    </p>
                  )}
                  
                  {job.posted && (
                    <p className="text-gray-500 text-xs mb-4">
                      📅 Posted: {new Date(job.posted).toLocaleDateString()}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <a
                      href={job.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                    >
                      Apply Now
                    </a>
                    <button className="px-3 py-2 text-gray-600 hover:text-blue-600 transition">
                      💾
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results Message */}
            {results.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try uploading a different resume or changing the location</p>
              </div>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Analyzing your resume...</h3>
                  <p className="text-gray-600">Searching for the best job matches</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 Job Finder. Real-time search technology MADE by KRISH DODIYA.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
