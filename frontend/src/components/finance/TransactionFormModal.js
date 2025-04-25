import React, { useState, useEffect } from 'react';
import '../../styles/finance/TransactionFormModal.css';

const paymentMethods = ['Tiền mặt', 'Chuyển khoản'];

export default function TransactionFormModal({ modalType, transactionType, editTransaction, onClose, onSubmit, incomeCategories, expenseCategories }) {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'Tiền mặt',
    sender: '',
    recipient: '',
    description: '',
    category: transactionType === 'Thu' ? incomeCategories[0] : expenseCategories[0],
    date: '',
    isRecurring: false,
  });

  useEffect(() => {
    if (modalType === 'edit' && editTransaction) {
      setFormData({
        amount: editTransaction.amount.toString(),
        paymentMethod: editTransaction.paymentMethod,
        sender: editTransaction.sender || '',
        recipient: editTransaction.recipient || '',
        description: editTransaction.description || '',
        category: editTransaction.category,
        date: editTransaction.date,
        isRecurring: false,
      });
    } else {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      setFormData((prev) => ({
        ...prev,
        date: `${currentYear}-${currentMonth}-01`,
        category: transactionType === 'Thu' ? (incomeCategories[0] || '') : (expenseCategories[0] || ''),
      }));
    }
  }, [modalType, editTransaction, transactionType, incomeCategories, expenseCategories]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.date || !formData.category) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const newTransaction = {
      amount: parseInt(formData.amount),
      paymentMethod: formData.paymentMethod,
      description: formData.description,
      category: formData.category,
      type: transactionType,
      date: formData.date,
      ...(transactionType === 'Thu' ? { sender: formData.sender } : { recipient: formData.recipient }),
    };

    onSubmit(newTransaction, formData.isRecurring);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{modalType === 'add' ? `Thêm phiếu ${transactionType.toLowerCase()}` : 'Chỉnh sửa giao dịch'}</h3>
        <div className="form-group">
          <label>Số tiền:</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => handleFormChange('amount', e.target.value)}
            placeholder="Nhập số tiền"
          />
        </div>
        <div className="form-group">
          <label>Phương thức:</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>{transactionType === 'Thu' ? 'Người gửi:' : 'Người nhận:'}</label>
          <input
            type="text"
            value={transactionType === 'Thu' ? formData.sender : formData.recipient}
            onChange={(e) =>
              handleFormChange(transactionType === 'Thu' ? 'sender' : 'recipient', e.target.value)
            }
            placeholder={transactionType === 'Thu' ? 'Nhập người gửi' : 'Nhập người nhận'}
          />
        </div>
        <div className="form-group">
          <label>Nội dung:</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            placeholder="Nhập nội dung"
          />
        </div>
        <div className="form-group">
          <label>Danh mục:</label>
          <select
            value={formData.category}
            onChange={(e) => handleFormChange('category', e.target.value)}
          >
            {(transactionType === 'Thu' ? incomeCategories : expenseCategories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Ngày lập phiếu:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleFormChange('date', e.target.value)}
          />
        </div>
        {modalType === 'add' && (
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => handleFormChange('isRecurring', e.target.checked)}
              />
              Lặp lại ngày này mỗi tháng
            </label>
          </div>
        )}
        <div className="modal-actions">
          <button className="btn-save" onClick={handleSubmit}>
            {modalType === 'add' ? 'Thêm' : 'Lưu'}
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}