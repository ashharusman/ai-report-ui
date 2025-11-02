import React, { useState } from 'react';
import TemplateUpload from './TemplateUpload';
import DynamicForm from './DynamicForm';

function App() {
  const [fields, setFields] = useState([]);
  const [file, setFile] = useState(null);

  const handleTemplateUpload = (uploadedFile, detectedFields) => {
    setFile(uploadedFile);
    setFields(detectedFields);
  };

  const handleGoBack = () => {
    setFields([]);
    setFile(null);
  };

  return (
    <div className="container mt-5">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold">SYNC UP</h1>
        <p className="lead">Your AI-powered document generation assistant</p>
      </header>
      <main className="card shadow-sm p-4">
        {fields.length === 0 ? (
          <TemplateUpload onUploadSuccess={handleTemplateUpload} />
        ) : (
          <DynamicForm fields={fields} file={file} onBack={handleGoBack} />
        )}
      </main>
    </div>
  );
}

export default App;