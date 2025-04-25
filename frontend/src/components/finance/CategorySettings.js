import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import '../../styles/finance/CategorySettings.css';

export default function CategorySettings({
    incomeCategories,
    setIncomeCategories,
    expenseCategories,
    setExpenseCategories,
    transactions,
    onClose,
  }) {
    const [newIncomeCategory, setNewIncomeCategory] = useState('');
    const [newExpenseCategory, setNewExpenseCategory] = useState('');
    const [editIncomeCategory, setEditIncomeCategory] = useState(null);
    const [editExpenseCategory, setEditExpenseCategory] = useState(null);
    const [editIncomeValue, setEditIncomeValue] = useState('');
    const [editExpenseValue, setEditExpenseValue] = useState('');
  
    const handleAddCategory = (type) => {
      const newCategory = type === 'Thu' ? newIncomeCategory : newExpenseCategory;
      if (!newCategory) {
        alert('Vui lòng nhập tên danh mục!');
        return;
      }
      if (type === 'Thu') {
        if (incomeCategories.includes(newCategory)) {
          alert('Danh mục đã tồn tại!');
          return;
        }
        setIncomeCategories((prev) => [...prev, newCategory]);
        setNewIncomeCategory('');
      } else {
        if (expenseCategories.includes(newCategory)) {
          alert('Danh mục đã tồn tại!');
          return;
        }
        setExpenseCategories((prev) => [...prev, newCategory]);
        setNewExpenseCategory('');
      }
    };
  
    const handleEditCategory = (type, oldCategory) => {
      const newValue = type === 'Thu' ? editIncomeValue : editExpenseValue;
      if (!newValue) {
        alert('Vui lòng nhập tên danh mục!');
        return;
      }
      if (type === 'Thu') {
        if (incomeCategories.includes(newValue) && newValue !== oldCategory) {
          alert('Danh mục đã tồn tại!');
          return;
        }
        setIncomeCategories((prev) =>
          prev.map((cat) => (cat === oldCategory ? newValue : cat))
        );
        setEditIncomeCategory(null);
        setEditIncomeValue('');
      } else {
        if (expenseCategories.includes(newValue) && newValue !== oldCategory) {
          alert('Danh mục đã tồn tại!');
          return;
        }
        setExpenseCategories((prev) =>
          prev.map((cat) => (cat === oldCategory ? newValue : cat))
        );
        setEditExpenseCategory(null);
        setEditExpenseValue('');
      }
    };
  
    const handleDeleteCategory = (type, category) => {
      const isInUse = transactions.some((t) => t.category === category && t.type === type);
      if (isInUse) {
        alert('Không thể xóa danh mục đang được sử dụng trong giao dịch!');
        return;
      }
      if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category}"?`)) {
        if (type === 'Thu') {
          setIncomeCategories((prev) => prev.filter((cat) => cat !== category));
        } else {
          setExpenseCategories((prev) => prev.filter((cat) => cat !== category));
        }
      }
    };
  
    return (
      <div className="modal">
        <div className="modal-content category-settings-modal">
          <h3>Cài đặt danh mục</h3>
          <div className="category-content">
            <div className="category-section">
              <h4>Danh mục thu</h4>
              <div className="category-add">
                <input
                  type="text"
                  value={newIncomeCategory}
                  onChange={(e) => setNewIncomeCategory(e.target.value)}
                  placeholder="Nhập danh mục thu mới"
                />
                <button onClick={() => handleAddCategory('Thu')}>
                  <FaPlus /> Thêm
                </button>
              </div>
              <div className="category-list">
                {incomeCategories.map((category) => (
                  <div key={category} className="category-item">
                    {editIncomeCategory === category ? (
                      <div className="category-edit">
                        <input
                          type="text"
                          value={editIncomeValue}
                          onChange={(e) => setEditIncomeValue(e.target.value)}
                          placeholder="Chỉnh sửa danh mục"
                        />
                        <button onClick={() => handleEditCategory('Thu', category)}>
                          <FaSave /> Lưu
                        </button>
                        <button onClick={() => setEditIncomeCategory(null)}>
                          <FaTimes /> Hủy
                        </button>
                      </div>
                    ) : (
                      <>
                        <span>{category}</span>
                        <div className="category-actions">
                          <button onClick={() => {
                            setEditIncomeCategory(category);
                            setEditIncomeValue(category);
                          }}>
                            <FaEdit /> Sửa
                          </button>
                          <button onClick={() => handleDeleteCategory('Thu', category)}>
                            <FaTrash /> Xóa
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="category-section">
              <h4>Danh mục chi</h4>
              <div className="category-add">
                <input
                  type="text"
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value)}
                  placeholder="Nhập danh mục chi mới"
                />
                <button onClick={() => handleAddCategory('Chi')}>
                  <FaPlus /> Thêm
                </button>
              </div>
              <div className="category-list">
                {expenseCategories.map((category) => (
                  <div key={category} className="category-item">
                    {editExpenseCategory === category ? (
                      <div className="category-edit">
                        <input
                          type="text"
                          value={editExpenseValue}
                          onChange={(e) => setEditExpenseValue(e.target.value)}
                          placeholder="Chỉnh sửa danh mục"
                        />
                        <button onClick={() => handleEditCategory('Chi', category)}>
                          <FaSave /> Lưu
                        </button>
                        <button onClick={() => setEditExpenseCategory(null)}>
                          <FaTimes /> Hủy
                        </button>
                      </div>
                    ) : (
                      <>
                        <span>{category}</span>
                        <div className="category-actions">
                          <button onClick={() => {
                            setEditExpenseCategory(category);
                            setEditExpenseValue(category);
                          }}>
                            <FaEdit /> Sửa
                          </button>
                          <button onClick={() => handleDeleteCategory('Chi', category)}>
                            <FaTrash /> Xóa
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              <FaTimes /> Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }