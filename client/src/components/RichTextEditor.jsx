import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichTextEditor = ({ input, setInput }) => {

  const handleEditorChange = (content) => {
    setInput((prev) => ({
      ...prev,
      description: content,
    }));
  };

  return (
    <Editor
      apiKey="urwgd5bk4c1c0ionidnx7uebx5uvrdbc3x28l5272oeutpky"  
      value={input.description}
      onEditorChange={handleEditorChange}
      init={{
        height: 300,
        menubar: false,

        plugins: [
          "link",
          "lists",
          "code",
          "table",
        ],

        toolbar:
          "blocks | bold italic underline | bullist numlist | link | removeformat",

        placeholder: "Write course description here...",
      }}
    />
  );
};

export default RichTextEditor;