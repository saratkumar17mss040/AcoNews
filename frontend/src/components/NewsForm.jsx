import { useState } from "react";
import Dropdown from "./Dropdown";

const languageOptions = [
  { value: "", label: "Select Language" },
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "ta", label: "Tamil" },
];

const countryOptions = [
  { value: "", label: "Select Country" },
  { value: "us", label: "United States" },
  { value: "in", label: "India" },
  { value: "au", label: "Australia" },
  { value: "gb", label: "United Kingdom" },
];

function NewsForm({ handleQueryChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    if (!searchTerm) {
      alert("Please enter a search term");
      return;
    }
    handleQueryChange({ searchTerm, language, country });
  };

  return (
    <div>
      <input
        className="mt-4 border-2 rounded cursor-pointer w-full sm:m-4 sm:w-1/2 sm:mx-auto sm:flex p-4"
        type="text"
        placeholder="🔍 Search news by keyword, region or category"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <div className="gap-4 mt-4 flex flex-col justify-center sm:flex-row sm:gap-6">
        <Dropdown
          options={languageOptions}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Select Language"
        />
        <Dropdown
          options={countryOptions}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Select Country"
        />
        <button
          onClick={handleSearchClick}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default NewsForm;
