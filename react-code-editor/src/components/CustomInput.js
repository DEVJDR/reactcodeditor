import React from "react";
import { classnames } from "../utils/general";

const CustomInput = ({ customInput, setCustomInput }) => {
  return (
    <>
      {" "}
      <textarea
        rows="5"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder={`Custom input`}
        className={classnames(
          "focus:outline-none w-full  rounded-md  px-4 py-2 hover:shadow transition duration-200 bg-[#1e1e1e] mt-2"
        )}
      ></textarea>
    </>
  );
};

export default CustomInput;
