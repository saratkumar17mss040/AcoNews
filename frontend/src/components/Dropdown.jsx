const Dropdown = ({ options, value, onChange, placeholder }) => {
  return (
    <select value={value} onChange={onChange} className="border-2 rounded p-2">
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
