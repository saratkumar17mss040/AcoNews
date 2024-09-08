import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      className="mt-4 border-2 rounded cursor-pointer w-full sm:m-4 sm:w-1/2 sm:mx-auto sm:flex p-4"
      type="text"
      placeholder="🔍 Search news"
      value={searchTerm}
      onChange={handleInputChange}
    />
  );
}
