import { FaDollarSign, FaChartLine, FaCreditCard, FaExchangeAlt } from 'react-icons/fa';
import '../../styles/dashboard/DashboardStats.css';
import homepageimage from "../../assets/images/homepage.jpg";

function DashboardStats() {
  return (
    <div className="stats-container">
        <div className="congratulations-card">
        <div className="text-content">
          <h3>Welcome back, Manager! 🏠</h3>
          <p>You have 3 new tenants this month. Check their profiles in the tenant list.</p>
          <button className="view-badges-btn">View Tenants</button>
        </div>
        <img
          src={homepageimage}
          alt="RentHub Illustration"
          className="home-image"
        />
      </div>

      {/* Thẻ thống kê nhỏ */}
      <div className="stat-card">
        <div className="stat-icon profit-icon">
          <FaDollarSign />
        </div>
        <div className="stat-info">
          <h3>Total Revenue</h3>
          <p className="stat-value">$5,250</p>
          <p className="stat-change positive">+15.30%</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon sales-icon">
          <FaChartLine />
        </div>
        <div className="stat-info">
          <h3>Available Rooms</h3>
          <p className="stat-value">4</p>
          <p className="stat-change negative">-2</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon payments-icon">
          <FaCreditCard />
        </div>
        <div className="stat-info">
          <h3>Deposits</h3>
          <p className="stat-value">$1,500</p>
          <p className="stat-change positive">+3</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon transactions-icon">
          <FaExchangeAlt />
        </div>
        <div className="stat-info">
          <h3>Transactions</h3>
          <p className="stat-value">12</p>
          <p className="stat-change positive">+4</p>
        </div>
      </div>

      {/* Placeholder cho Monthly Revenue */}
      <div className="chart-card">
        <h3>Monthly Revenue</h3>
        <div className="chart-placeholder">Monthly Revenue Chart (Placeholder)</div>
      </div>

      {/* Placeholder cho Occupancy Rate */}
      <div className="growth-card">
        <h3>Occupancy Rate</h3>
        <div className="growth-chart">
          <div className="growth-placeholder">Occupancy Rate (85%)</div>
        </div>
        <p className="growth-info">85% Occupancy Rate</p>
        <div className="growth-details">
          <p><span className="dot year-2022"></span> This Month: 85%</p>
          <p><span className="dot year-2021"></span> Last Month: 80%</p>
        </div>
      </div>

      {/* Placeholder cho Tenant Statistics */}
      <div className="profile-report-card">
        <h3>Tenant Statistics</h3>
        <p className="profile-report-value">28 Tenants <span className="stat-change positive">+3</span></p>
        <div className="chart-placeholder">Tenant Statistics Chart (Placeholder)</div>
      </div>

      {/* Nút Upgrade to Pro */}
      <button className="upgrade-btn">Upgrade to Pro</button>
    </div>
  );
}

export default DashboardStats;