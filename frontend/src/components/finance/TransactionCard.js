import React from 'react';
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa';
import '../../styles/finance/TransactionCard.css';

export default function TransactionCard({ transaction, onEdit, onDelete }) {
    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split('-');
      return {
        day: day,
        monthYear: `${month}/${year}`,
      };
    };
  
    const { day, monthYear } = formatDate(transaction.date);
  
    return (
      <div className="transaction-card" onClick={onEdit}>
        <div className="transaction-icon">
          {transaction.type === 'Thu' ? (
            < FaArrowUp className="icon-income" />
          ) : (
            < FaArrowDown className="icon-expense" />
          )}
        </div>
        <div className="transaction-content">
          <div className="transaction-date">
            <div className="date-badge">{day}</div>
            <span>Tháng {monthYear}</span>
          </div>
          <div className="transaction-details">
            <h4>{transaction.category}</h4>
            <p className="amount">{transaction.amount.toLocaleString()} đ</p>
            <p className="details">
              {transaction.type === 'Thu'
                ? `Người gửi: ${transaction.sender || 'Không có thông tin'}`
                : `Người nhận: ${transaction.recipient || 'Không có thông tin'}`}
            </p>
            <p className="details">Nội dung: ${transaction.description || 'Không có nội dung'}</p>
            <p className="details">Ngày lập phiếu: ${transaction.date}</p>
            <span className="payment-method">{transaction.paymentMethod}</span>
            {onDelete && (
              <button className="btn-delete-transaction" onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}>
                <FaTrash /> Xóa
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }