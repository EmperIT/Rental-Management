import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="logo">RentHub</div>
      <nav className="nav">
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/signup" className="nav-link">Sign Up</Link>
      </nav>
    </header>
  );
}

export default Header;