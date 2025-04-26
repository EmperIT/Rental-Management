import Header from '../components/Header';
import MainContent from '../components/MainContent';
import '../styles/LandingPage.css';

function LandingPage() {
  return (
    <div className="app-container">
      <div className="content-wrapper">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}

export default LandingPage;