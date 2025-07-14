import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";

const javascriptDefault = `/**
 * Problem: Compute the nth Fibonacci number using recursion with memoization.
 */

// Time: O(n)
const fibonacci = (n, memo = {}) => {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
};

const n = 10;
console.log(\`Fibonacci of \${n} is:\`, fibonacci(n));
`;


const Landing = () => {
  const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);
  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
  console.error("API Error:", err);
  setProcessing(false);

  if (err.response) {
    const status = err.response.status;
    const error = err.response.data;

    if (status === 429) {
      showErrorToast(
        `Quota exceeded. Please wait or set up your own Judge0 instance.`,
        10000
      );
    } else {
      showErrorToast(`Error ${status}: ${error.message || "Unexpected error"}`);
    }
  } else if (err.request) {
    showErrorToast("No response received. Possible network or CORS error.");
  } else {
    showErrorToast("Request failed: " + err.message);
  }
});

  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

     
      if (statusId === 1 || statusId === 2) {
    
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
<>
 
  <div className="h-1 w-full bg-[#007acc]" />

 
  <div className="flex flex-wrap justify-between items-center px-4 py-3 bg-[#252526] shadow-md">
    <div className="w-full sm:w-auto mb-2 sm:mb-0">
      <LanguagesDropdown onSelectChange={onSelectChange} />
    </div>
    
  </div>

 
  <div className="flex flex-col gap-4 px-4 py-4 bg-[#1e1e1e] min-h-screen text-gray-200">

    {/* Code Editor Section */}
    <div className="bg-[#252526] rounded-lg shadow-md p-3 w-full">
      <h2 className="text-base font-semibold mb-2 text-gray-300">Code Editor</h2>
      <div className="h-[250px] sm:h-[350px] overflow-hidden rounded-md bg-[#1e1e1e] border border-[#2c2c2c]">
        <CodeEditorWindow
          code={code}
          onChange={onChange}
          language={language?.value}
        />
      </div>
    </div>

    
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      
      <div className="bg-[#252526] rounded-lg shadow-md p-3 w-full sm:w-1/2 border border-[#2c2c2c]">
        <h2 className="text-sm font-semibold mb-1 text-gray-300">Input</h2>
        <CustomInput customInput={customInput} setCustomInput={setCustomInput} />

       
        <div className="flex justify-end mt-3">
          <button
            onClick={handleCompile}
            disabled={!code}
            className={classnames(
              "px-4 py-2 rounded-md font-semibold text-white text-sm transition",
              processing
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#007acc] hover:bg-[#0b84d6]"
            )}
          >
            {processing ? "Processing..." : "Compile"}
          </button>
        </div>
      </div>

      <div className="bg-[#252526] rounded-lg shadow-md p-3 w-full sm:w-1/2 border border-[#2c2c2c]">
        <OutputWindow outputDetails={outputDetails} />
      </div>
    </div>

   
    {outputDetails && (
      <div className="bg-[#252526] rounded-lg shadow-md p-3 w-full border border-[#2c2c2c]">
        <h2 className="text-sm font-semibold mb-2 text-gray-300">Execution Info</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="bg-green-700 text-white px-3 py-1 rounded-md">
            Status: {outputDetails?.status?.description}
          </span>
          <span className="bg-blue-700 text-white px-3 py-1 rounded-md">
            Memory: {outputDetails?.memory} KB
          </span>
          <span className="bg-purple-700 text-white px-3 py-1 rounded-md">
            Time: {outputDetails?.time} sec
          </span>
        </div>
      </div>
    )}
  </div>
   
</>
  );
};
export default Landing;
