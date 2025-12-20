import React, { useState } from "react";
import Category from "./Category";

const TaskForm = ({ onCreateTask }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "work",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCategoryComponentChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Task title is required");
      return;
    }

    const success = await onCreateTask(formData);
    if (success) {
      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        category: "work",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="block text-gray-700 text-sm font-medium mb-2"
          htmlFor="title"
        >
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Enter task title"
        />
      </div>
      <Category
        value={formData.category}
        onChange={handleCategoryComponentChange}
      />

      <div>
        <label
          className="block text-gray-700 text-sm font-medium mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Enter task description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="priority"
          >
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-900 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <i className="fas fa-plus mr-2"></i>Add Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
