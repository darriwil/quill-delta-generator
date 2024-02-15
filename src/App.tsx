import React, { useRef, useState, useEffect } from "react";
import Quill, { QuillOptionsStatic, TextChangeHandler } from "quill";

import "quill/dist/quill.snow.css";
import "./App.css";

type Delta = Parameters<TextChangeHandler>[0];

const App: React.FC = () => {
  const editorElmRef = useRef<HTMLDivElement>(null);

  const editorInstanceRef = useRef<Quill>();

  const [delta, setDelta] = useState<Delta>({ ops: [{ insert: "\n" }] } as Delta);

  const createEditor = () => {
    const { current: editorContainerElm } = editorElmRef;

    const options: QuillOptionsStatic = {
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ "header": 1 }, { "header": 2 }],
          [{ "list": "ordered"}, { "list": "bullet" }],
          [{ "script": "sub"}, { "script": "super" }],
          [{ "indent": "-1"}, { "indent": "+1" }],
          [{ "direction": "rtl" }],
          [{ "size": ["small", false, "large", "huge"] }],
          [{ "header": [1, 2, 3, 4, 5, 6, false] }],
          [{ "color": [] }, { "background": [] }],
          [{ "font": [] }],
          [{ "align": [] }],
          ["clean"]
        ]
      },
      theme: "snow"
    };

    if (editorContainerElm) editorInstanceRef.current = new Quill(editorContainerElm, options);
  }

  const registerEventHandler = () => {
    if (!editorInstanceRef.current) return;

    editorInstanceRef.current.on("text-change", onTextChange);
  };

  const onTextChange: TextChangeHandler = () => {
    const { current: editor } = editorInstanceRef;

    if (!editor) return;

    setDelta(editor.getContents());
  };

  const getSerializedDelta = () => JSON.stringify(delta, null, 2);

  const copyDelta = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(getSerializedDelta());
        alert("Copied!");
      } catch (e) {
        alert(e);
      }
    } else {
      // 引導
      alert([
        "This web browser does not support this feature.",
        "Please use a modern web browser or go home."
      ].join("\n"));
    }
  };

  useEffect(() => {
    createEditor();
    registerEventHandler();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app-container">
      <div className="header">
        <div className="app-title">Quill Delta Generator</div>
        {/* eslint-disable-next-line react/jsx-no-target-blank */}
        <a className="repo-link" href="https://github.com/darriwil/quill-delta-generator" target="_blank">Repo</a>
      </div>

      <div className="body">
        <div className="editor-container">
          <div className="editor" ref={editorElmRef}></div>
        </div>

        <div className="dist">
          <div className="dist-header">
            <button className="copy-button" onClick={copyDelta}>Copy Delta</button>
          </div>

          <div className="dist-body">
            <div className="delta-viewer-container">
              <pre className="delta-viewer">{getSerializedDelta()}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
