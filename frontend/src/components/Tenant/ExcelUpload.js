import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FaTimes } from 'react-icons/fa';

const ExcelUpload = ({ onClose, onUpload, expectedHeaders }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError('Vui lòng chọn file Excel.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate headers
      const headers = Object.keys(jsonData[0] || {});
      const missingHeaders = expectedHeaders.filter((header) => !headers.includes(header));
      if (missingHeaders.length > 0) {
        setError(`File Excel thiếu các cột: ${missingHeaders.join(', ')}`);
        return;
      }

      onUpload(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">Tải lên file Excel</h2>
          <button onClick={onClose} className="popup-close-btn">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="excel-upload-content">
          <div>
            <label className="popup-label">Chọn file Excel</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="popup-input excel-file-input"
            />
          </div>
          {error && <p className="excel-error">{error}</p>}
          <p className="excel-info">
            File Excel cần có các cột: {expectedHeaders.join(', ')}
          </p>
        </div>
        <div className="popup-buttons">
          <button className="btn-primary" onClick={handleUpload}>
            Tải lên
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelUpload;