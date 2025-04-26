import '../../styles/dashboard/Navbar.css';
import avatarImage  from "../../assets/images/avatar.jpg"; // Import hình ảnh từ thư mục img
import { FaSearch } from 'react-icons/fa';

function Navbar() {
  return (
    <div className="navbar">
      <div className="search-bar">
        <span className="search-icon"><FaSearch /></span>
        <input type="text" placeholder="Search..." className="search-input" />
      </div>
      <div className="user-info">
        <div className="avatar">
          <img src={avatarImage} alt="User Avatar" />
          <span className="status-dot"></span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;