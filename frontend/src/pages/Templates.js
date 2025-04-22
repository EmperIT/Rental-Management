import React, { useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import '../styles/template/Template.css';
import { FaFileUpload, FaEdit, FaSave, FaTimes, FaTrash, FaFileDownload } from 'react-icons/fa';

const Templates = () => {
  const containerRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [savedFiles, setSavedFiles] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.docx')) {
      setFileName(file.name);
      const reader = new FileReader();

      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        containerRef.current.innerHTML = '';
        await renderAsync(arrayBuffer, containerRef.current);
        setEditMode(false);
      };

      reader.readAsArrayBuffer(file);
    } else {
      alert('Vui lòng chọn file .docx!');
    }
  };

  const handleClear = () => {
    setFileName('');
    containerRef.current.innerHTML = '';
    setEditMode(false);
  };

  const enableEditMode = () => {
    if (!containerRef.current.innerHTML) {
      alert('Vui lòng chọn file trước!');
      return;
    }
    setEditMode(true);
    containerRef.current.contentEditable = true;
    containerRef.current.focus();
  };

  const disableEditMode = () => {
    setEditMode(false);
    containerRef.current.contentEditable = false;
  };

  const handleSave = () => {
    const editedContent = containerRef.current.innerHTML;
    const saveName = `${fileName || 'Trang Mới'} - ${new Date().toLocaleString()}`;
    const blob = new Blob([editedContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    setSavedFiles(prev => [...prev, { name: saveName, url }]);

    alert('Đã lưu vào danh sách!');
    setEditMode(false);
    containerRef.current.contentEditable = false;
  };

  const handleRemoveSaved = (index) => {
    setSavedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="template-container">
      <h2>Xem & Chỉnh Mẫu Hợp Đồng Thuê Trọ</h2>

      <div className="button-group">
        <label className="custom-file-upload">
          <FaFileUpload /> Chọn File
          <input type="file" accept=".docx" onChange={handleFileChange} />
        </label>

        {fileName && !editMode && (
          <button className="edit-button" onClick={enableEditMode}>
            <FaEdit /> Chỉnh sửa
          </button>
        )}

        {editMode && (
          <>
            <button className="save-button" onClick={handleSave}>
              <FaSave /> Lưu
            </button>
            <button className="disable-button" onClick={disableEditMode}>
              <FaTimes /> Dừng
            </button>
          </>
        )}

        {fileName && (
          <button className="clear-button" onClick={handleClear}>
            <FaTrash /> Xoá
          </button>
        )}
      </div>

      {fileName && <p className="filename">Đang xem: <strong>{fileName}</strong></p>}

      <div
        ref={containerRef}
        className="docx-preview-container"
        style={{
          border: '1px solid #ccc',
          padding: '20px',
          marginTop: '20px',
          background: '#fff',
          overflowY: 'auto',
          maxHeight: '600px'
        }}
      ></div>

      {savedFiles.length > 0 && (
        <div className="saved-files">
          <h3><FaFileDownload /> Danh Sách Bản Lưu</h3>
          <ul>
            {savedFiles.map((file, index) => (
              <li key={index}>
                <a href={file.url} download={`${file.name}.html`} target="_blank" rel="noopener noreferrer">
                  <FaFileDownload /> {file.name}
                </a>
                <button onClick={() => handleRemoveSaved(index)} style={{ marginLeft: '10px' }}>
                  <FaTrash /> Xoá
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Templates;
