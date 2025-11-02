import React, { useState } from 'react';

function DynamicForm({ fields, file, onBack }) {
  const [formData, setFormData] = useState(() =>
    fields.reduce((acc, field) => {
      acc[field] = ['']; // Initialize with one empty string for a single input
      return acc;
    }, {})
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const list = [...formData[name]];
    list[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: list,
    }));
  };

  const handleAddInput = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], ''],
    }));
  };

  const handleRemoveInput = (field, index) => {
    const list = [...formData[field]];
    list.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      [field]: list,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('template', file);
      data.append('userInputs', JSON.stringify(formData));

      const response = await fetch('https://ai-report-new.vercel.app/generate-new-report', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'generated-document.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      setError('An error occurred while generating the report. Please check the console.');
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="h4 mb-4">Step 2: Fill in the Fields</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label text-capitalize fw-medium">{field.replace(/_/g, ' ')}</label>
            {formData[field].map((value, index) => (
              <div className="input-group mb-2" key={index}>
                <input
                  type="text"
                  className="form-control"
                  name={field}
                  value={value}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
                {formData[field].length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handleRemoveInput(field, index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => handleAddInput(field)}
            >
              Add Bullet Point
            </button>
          </div>
        ))}
        {error && <div className="alert alert-danger mt-4">{error}</div>}
        <div className="d-flex gap-2 mt-4">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="btn btn-success" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate and Download'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DynamicForm;
