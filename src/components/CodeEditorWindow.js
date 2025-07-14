import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

  useEffect(() => {
    setValue(code); // in case code prop changes externally
  }, [code]);

  return (
    <div
      className="rounded-md w-full h-full shadow-lg"
      style={{
        backgroundColor: "#1e1e1e", // Match VS Code screen
        border: "1px solid #2c2c2c",
      }}
    >
      <Editor
        height="100%"
        width="100%"
        language={language || "javascript"}
        value={value}
        theme={theme || "vs-dark"}
        defaultValue="// Write your code here"
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12 },
          tabSize: 2,
          wordWrap: "on",
          fontFamily: "Fira Code, monospace",
          lineNumbers: "on",
          renderLineHighlight: "gutter",
          cursorSmoothCaretAnimation: true,
          smoothScrolling: true,
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
        }}
      />
    </div>
  );
};

export default CodeEditorWindow;
