import React from "react";

export default function IntroSection({ onGetStarted }) {
  return (
    <div className="flex flex-col justify-center h-full space-y-8">
      {/* Main Heading */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">🚀</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Job Finder
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
          Upload your resume and instantly discover matching job postings – 
          <span className="font-semibold text-blue-600"> powered by AI & real-time search</span>.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg border border-blue-100">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-lg">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI-Powered Matching</h3>
            <p className="text-sm text-gray-600">Smart analysis of your skills</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg border border-blue-100">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 text-lg">⚡</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Real-Time Results</h3>
            <p className="text-sm text-gray-600">Latest job opportunities</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg border border-blue-100">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-lg">🎯</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Personalized Results</h3>
            <p className="text-sm text-gray-600">Tailored to your profile</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg border border-blue-100">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <span className="text-orange-600 text-lg">🔗</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Direct Apply</h3>
            <p className="text-sm text-gray-600">One-click applications</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center space-x-8 py-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">10K+</div>
          <div className="text-sm text-gray-600">Jobs Available</div>
        </div>
        <div className="w-px h-8 bg-gray-300"></div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">95%</div>
          <div className="text-sm text-gray-600">Match Accuracy</div>
        </div>
        <div className="w-px h-8 bg-gray-300"></div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">24/7</div>
          <div className="text-sm text-gray-600">Real-Time Search</div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-4">
        <button
          onClick={onGetStarted}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
        >
          <span className="flex items-center space-x-2">
            <span>Get Started</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          Free • No registration required • Instant results
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center space-x-6 pt-8 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-gray-500">
          <span className="text-green-500">✓</span>
          <span className="text-sm">Secure Upload</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <span className="text-green-500">✓</span>
          <span className="text-sm">Privacy Protected</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <span className="text-green-500">✓</span>
          <span className="text-sm">No Spam</span>
        </div>
      </div>
    </div>
  );
}
