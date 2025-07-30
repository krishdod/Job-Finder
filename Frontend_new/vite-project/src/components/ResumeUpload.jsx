import React, { useState } from "react";
import { uploadResume } from "../api/jobApi";

export default function ResumeUpload() {
  const [file, setFile]     = useState(null);
  const [loc, setLoc]       = useState("India");
  const [jobs, setJobs]     = useState([]);
  const [loading,setLoading]= useState(false);
  const handle = async () => {
    if (!file) return alert("Choose a file");
    setLoading(true);
    try     { setJobs(await uploadResume(file, loc)); }
    catch(e){ alert(e.message); }
    setLoading(false);
  };
  return (
    <div className="p-6 bg-[#232946] rounded-lg shadow mb-8">
      <h2 className="text-2xl font-bold text-purple-400 mb-3">📄 Resume-Based Search</h2>
      <input type="file" accept=".pdf,.docx" onChange={e=>setFile(e.target.files[0])}
             className="mb-3"/>
      <input value={loc} onChange={e=>setLoc(e.target.value)}
             className="mb-3 px-2 py-1 text-black rounded"
             placeholder="Preferred Location"/>
      <button onClick={handle}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white">
        {loading? "Searching…" : "Find Jobs"}
      </button>
      <div className="mt-6 space-y-4">
        {jobs.map((j,i)=>(
          <div key={i} className="bg-gray-800 p-4 rounded job-card">
            <h3 className="text-lg font-semibold text-purple-300">{j.title}</h3>
            <p><b>Company:</b> {j.company}</p>
            <p><b>Location:</b> {j.location}</p>
            <a href={j.apply_link} target="_blank" rel="noreferrer"
               className="text-yellow-400 underline">Apply Now</a>
          </div>
        ))}
      </div>
    </div>
  );
}
