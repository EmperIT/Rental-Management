import React, { useState } from 'react';
import { FaPlus, FaCog, FaTrashAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import StatsCard from '../components/StatsCard';
import TransactionCard from '../components/finance/TransactionCard';
import FinanceFilters from '../components/finance/FinanceFilters';
import TransactionFormModal from '../components/finance/TransactionFormModal';
import CategorySettings from '../components/finance/CategorySettings';
import '../styles/finance/FinancePage.css';


const initialTransactions = [
    { id: 1, date: '2025-04-01', amount: 3000000, type: 'Thu', category: 'Tiền phòng', paymentMethod: 'Tiền mặt', sender: 'Nguyễn Văn A', description: 'Thanh toán tiền phòng tháng 4' },
    { id: 2, date: '2025-04-02', amount: 500000, type: 'Chi', category: 'Điện nước', paymentMethod: 'Chuyển khoản', recipient: 'Công ty Điện lực', description: 'Thanh toán hóa đơn điện' },
    { id: 3, date: '2025-04-03', amount: 3500000, type: 'Thu', category: 'Tiền phòng', paymentMethod: 'Chuyển khoản', sender: 'Trần Thị B', description: 'Thanh toán tiền phòng tháng 4' },
    { id: 4, date: '2025-04-04', amount: 200000, type: 'Chi', category: 'Sửa chữa', paymentMethod: 'Tiền mặt', recipient: 'Thợ sửa ống nước', description: 'Sửa ống nước phòng 101' },
    { id: 5, date: '2025-03-15', amount: 4000000, type: 'Thu', category: 'Tiền dịch vụ', paymentMethod: 'Tiền mặt', sender: 'Lê Văn C', description: 'Thanh toán dịch vụ tháng 3' },
    { id: 6, date: '2024-10-01', amount: 3200000, type: 'Thu', category: 'Tiền phòng', paymentMethod: 'Tiền mặt', sender: 'Phạm Thị D', description: 'Thanh toán tiền phòng tháng 10' },
    { id: 7, date: '2024-07-15', amount: 600000, type: 'Chi', category: 'Điện nước', paymentMethod: 'Chuyển khoản', recipient: 'Công ty Nước sạch', description: 'Thanh toán hóa đơn nước' },
  ];
  
  const initialIncomeCategories = ['Tiền phòng', 'Tiền dịch vụ'];
  const initialExpenseCategories = ['Điện nước', 'Sửa chữa'];
  
  export default function FinancePage() {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [deletedTransactions, setDeletedTransactions] = useState([]);
    const [filterType, setFilterType] = useState('Thu');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterTime, setFilterTime] = useState('month');
    const [incomeCategories, setIncomeCategories] = useState(initialIncomeCategories);
    const [expenseCategories, setExpenseCategories] = useState(initialExpenseCategories);
    const [showDeleted, setShowDeleted] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
  
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = `${currentYear}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
    const currentQuarter = Math.ceil((currentDate.getMonth() + 1) / 3);
    const currentQuarterString = `${currentYear}-Q${currentQuarter}`;
  
    const yearRange = 5;
    const years = Array.from(
      { length: 2 * yearRange + 1 },
      (_, i) => (parseInt(currentYear) - yearRange + i).toString()
    );
  
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedQuarter, setSelectedQuarter] = useState(currentQuarterString);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
  
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [transactionType, setTransactionType] = useState('Thu');
    const [editTransaction, setEditTransaction] = useState(null);
  
    const quarters = [
      `${selectedYear}-Q1`,
      `${selectedYear}-Q2`,
      `${selectedYear}-Q3`,
      `${selectedYear}-Q4`,
    ];
  
    const totalIncome = transactions
      .filter((t) => t.type === 'Thu')
      .reduce((sum, t) => sum + t.amount, 0);
  
    const totalExpenses = transactions
      .filter((t) => t.type === 'Chi')
      .reduce((sum, t) => sum + t.amount, 0);
  
    const profit = totalIncome - totalExpenses;
  
    const filterTransactions = () => {
      let filtered = transactions;
  
      if (filterType) {
        filtered = filtered.filter((t) => t.type === filterType);
      }
  
      if (filterCategory) {
        filtered = filtered.filter((t) => t.category === filterCategory);
      }
  
      if (filterTime === 'month' && selectedMonth) {
        filtered = filtered.filter((t) => t.date.startsWith(selectedMonth));
      } else if (filterTime === 'quarter' && selectedQuarter) {
        const [year, quarter] = selectedQuarter.split('-Q');
        const quarterStartMonth = (parseInt(quarter) - 1) * 3 + 1;
        const quarterEndMonth = quarterStartMonth + 2;
        filtered = filtered.filter((t) => {
          const [tYear, tMonth] = t.date.split('-');
          const monthNum = parseInt(tMonth);
          return (
            tYear === year &&
            monthNum >= quarterStartMonth &&
            monthNum <= quarterEndMonth
          );
        });
      } else if (filterTime === 'range' && startDate && endDate) {
        filtered = filtered.filter((t) => t.date >= startDate && t.date <= endDate);
      }
  
      return filtered;
    };
  
    const filteredTransactions = filterTransactions();
  
    const handleOpenAddModal = (type) => {
      setModalType('add');
      setTransactionType(type);
      setEditTransaction(null);
      setShowModal(true);
    };
  
    const handleOpenEditModal = (transaction) => {
      setModalType('edit');
      setTransactionType(transaction.type);
      setEditTransaction(transaction);
      setShowModal(true);
    };
  
    const handleDeleteTransaction = (transaction) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
        setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
        setDeletedTransactions((prev) => [...prev, transaction]);
      }
    };
  
    const handleRestoreTransaction = (transaction) => {
      setDeletedTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
      setTransactions((prev) => [...prev, transaction]);
    };
  
    return (
      <div className="finance-page">
        <h2>Quản lý thu chi</h2>
  
        <div className="stats-grid">
          <StatsCard title="Tổng khoản thu" value={totalIncome.toLocaleString() + ' đ'} />
          <StatsCard title="Tổng khoản chi" value={totalExpenses.toLocaleString() + ' đ'} />
          <StatsCard title="Lợi nhuận" value={profit.toLocaleString() + ' đ'} />
        </div>
  
        <div className="actions">
          <div className="dropdown">
            <button className="btn-add">
              <FaPlus /> Thêm
            </button>
            <div className="dropdown-content">
              <button onClick={() => handleOpenAddModal('Thu')}>Thêm phiếu thu</button>
              <button onClick={() => handleOpenAddModal('Chi')}>Thêm phiếu chi</button>
            </div>
          </div>
          <button
            className="btn-settings"
            onClick={() => setShowCategoryModal(true)}
          >
            <FaCog /> Cài đặt danh mục
          </button>
          <button
            className="btn-toggle-deleted"
            onClick={() => setShowDeleted(!showDeleted)}
          >
            {showDeleted ? (
              <>
                <FaEyeSlash /> Ẩn giao dịch đã xóa
              </>
            ) : (
              <>
                <FaEye /> Xem giao dịch đã xóa
              </>
            )}
          </button>
        </div>
  
        {showCategoryModal && (
          <CategorySettings
            incomeCategories={incomeCategories}
            setIncomeCategories={setIncomeCategories}
            expenseCategories={expenseCategories}
            setExpenseCategories={setExpenseCategories}
            transactions={transactions}
            onClose={() => setShowCategoryModal(false)}
          />
        )}
  
        <FinanceFilters
          filterType={filterType}
          setFilterType={setFilterType}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterTime={filterTime}
          setFilterTime={setFilterTime}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedQuarter={selectedQuarter}
          setSelectedQuarter={setSelectedQuarter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          years={years}
          quarters={quarters}
          incomeCategories={incomeCategories}
          expenseCategories={expenseCategories}
        />
  
        {showDeleted ? (
          <div className="deleted-transactions">
            <h3>Giao dịch đã xóa</h3>
            {deletedTransactions.length === 0 ? (
              <p>Không có giao dịch nào đã xóa</p>
            ) : (
              <div className="transactions-grid">
                {deletedTransactions.map((transaction) => (
                  <div key={transaction.id} className="deleted-transaction-card">
                    <TransactionCard transaction={transaction} onEdit={() => {}} />
                    <button
                      className="btn-restore"
                      onClick={() => handleRestoreTransaction(transaction)}
                    >
                      <FaTrashAlt /> Khôi phục
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="transactions-grid">
            {filteredTransactions.length === 0 ? (
              <p className="no-transactions">Không có giao dịch phù hợp với bộ lọc</p>
            ) : (
              filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={() => handleOpenEditModal(transaction)}
                  onDelete={() => handleDeleteTransaction(transaction)}
                />
              ))
            )}
          </div>
        )}
  
        {showModal && (
          <TransactionFormModal
            modalType={modalType}
            transactionType={transactionType}
            editTransaction={editTransaction}
            onClose={() => setShowModal(false)}
            onSubmit={(newTransaction, isRecurring) => {
              if (modalType === 'add') {
                if (isRecurring) {
                  const [year, month, day] = newTransaction.date.split('-');
                  const newTransactions = [];
                  for (let m = 1; m <= 12; m++) {
                    const formattedMonth = m.toString().padStart(2, '0');
                    const transactionDate = `${year}-${formattedMonth}-${day}`;
                    const date = new Date(transactionDate);
                    if (date.getDate() === parseInt(day)) {
                      newTransactions.push({
                        ...newTransaction,
                        id: transactions.length + newTransactions.length + 1,
                        date: transactionDate,
                      });
                    }
                  }
                  setTransactions((prev) => [...prev, ...newTransactions]);
                } else {
                  setTransactions((prev) => [
                    ...prev,
                    { ...newTransaction, id: prev.length + 1 },
                  ]);
                }
              } else if (modalType === 'edit') {
                setTransactions((prev) =>
                  prev.map((t) =>
                    t.id === editTransaction.id ? { ...newTransaction, id: t.id } : t
                  )
                );
              }
              setShowModal(false);
            }}
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
          />
        )}
      </div>
    );
  }