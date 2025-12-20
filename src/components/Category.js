import React from "react";

const Category = ({ value, onChange }) => {
  return (
    <div className="mt-3 mb-3">
      <label className="block font-semibold mb-1">Category</label>

      <select
        value={value}
        onChange={onChange}
        className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select Category</option>
        <option value="Work">Work</option>
        <option value="Study">Study</option>
        <option value="Personal">Personal</option>
      </select>
    </div>
  );
};

export default Category;
