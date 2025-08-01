import React, { useState, useRef } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

//const API_BASE = "http://localhost:8000";

export default function ResumeForm({ onResults, onLoading }) {
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState("United States");
  const [jobLimit, setJobLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFile(droppedFile)) {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Please select a valid PDF or DOCX file.");
      }
    }
  };

  const isValidFile = (file) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword"
    ];
    return validTypes.includes(file.type);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid PDF or DOCX file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!file) {
      setError("Please select a PDF or DOCX Resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      onLoading(true);
      
      const { data } = await axios.post(
        `${API_BASE}/search-jobs`,
        formData,
        { 
          params: { location, limit: jobLimit },
          timeout: 120000, // 2 minute timeout for job search
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      console.log('API Response:', data);
      console.log('Number of jobs received:', data.results?.length || 0);
      
      onResults(data.results || []);
    } catch (err) {
      let errorMessage = "An unexpected error occurred.";
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please try again.";
      } else if (err.response?.status === 415) {
        errorMessage = "Invalid file format. Please upload a PDF or DOCX file.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      onResults([]);
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">📄</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Resume</h2>
        <p className="text-gray-600">Get personalized job recommendations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : file 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!file ? (
            <div>
              <div className="text-4xl mb-4">📁</div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your resume here or click to browse
              </p>
              <p className="text-gray-500 mb-4">
                Supports PDF and DOCX files up to 10MB
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Choose File
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-4">
              <div className="text-3xl">✅</div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                ✕
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Location Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Location
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              📍
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., United States, New York, Remote"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Job Limit Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Jobs to Show
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              📊
            </span>
            <select
              value={jobLimit}
              onChange={(e) => setJobLimit(parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value={25}>25 Jobs</option>
              <option value={50}>50 Jobs (Recommended)</option>
              <option value={75}>75 Jobs</option>
              <option value={100}>100 Jobs</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            More jobs = longer search time but more opportunities
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform ${
            loading || !file
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing Resume...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span>🔍</span>
              <span>Find Jobs</span>
            </div>
          )}
        </button>
      </form>

      {/* Features List */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">What you'll get:</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-green-500">✓</span>
            <span>AI-powered job matching</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-green-500">✓</span>
            <span>Real-time job listings</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-green-500">✓</span>
            <span>Direct apply links</span>
          </div>
        </div>
      </div>
    </div>
  );
}
