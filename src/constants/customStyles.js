export const customStyles = {
  control: (styles, state) => ({
    ...styles,
    width: "100%",
    maxWidth: "14rem",
    minWidth: "12rem",
    borderRadius: "4px",
    backgroundColor: "#1e1e1e", 
    border: state.isFocused ? "2px solid #007acc" : "1.5px solid #3c3c3c",
    color: "#d4d4d4",
    fontSize: "0.85rem",
    boxShadow: "none",
    ":hover": {
      border: "2px solid #007acc",
    },
    cursor: "pointer",
  }),

  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#007acc"
      : isFocused
      ? "#2c2c2c"
      : "#1e1e1e",
    color: isSelected ? "#fff" : "#d4d4d4",
    fontSize: "0.85rem",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#007acc",
    },
  }),

  menu: (styles) => ({
    ...styles,
    backgroundColor: "#1e1e1e",
    border: "1.5px solid #3c3c3c",
    borderRadius: "4px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    marginTop: "4px",
  }),

  singleValue: (styles) => ({
    ...styles,
    color: "#d4d4d4",
  }),

  placeholder: (styles) => ({
    ...styles,
    color: "#888",
    fontSize: "0.85rem",
  }),

  dropdownIndicator: (styles) => ({
    ...styles,
    color: "#ccc",
    ":hover": {
      color: "#fff",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),
};
