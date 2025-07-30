import React, { useState } from "react";
import { manualSearch } from "../api/jobApi";

export default function ManualSearch() {
  const [form,setForm]=useState({job:"Software Engineer",location:"Kochi",
                                 experience:"experienced",category:"full-time"});
  const [jobs,setJobs]=useState([]); const [loading,setLoading]=useState(false);

  const handle = async (e) => {
    e.preventDefault(); setLoading(true);
    try{ setJobs(await manualSearch(form)); }
    catch(err){ alert(err.message); }
    setLoading(false);
  };
  return(
    <div className="p-6 bg-[#232946] rounded-lg shadow mb-8">
      <h2 className="text-2xl font-bold text-purple-400 mb-3">🔤 Manual Search</h2>
      <form onSubmit={handle} className="grid grid-cols-2 gap-3 mb-4">
        {["job","location","experience","category"].map(k=>(
          <input key={k} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
            className="px-2 py-1 text-black rounded" placeholder={k}/>
        ))}
        <button type="submit"
          className="col-span-2 bg-purple-600 text-white rounded py-2 hover:bg-purple-700">
          {loading? "Searching…" : "Search Jobs"}
        </button>
      </form>
      <div className="space-y-4">
        {jobs.map((j,i)=>(
          <div key={i} className="bg-gray-800 p-4 rounded">
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
