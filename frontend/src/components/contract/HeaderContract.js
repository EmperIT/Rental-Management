import "../../styles/contract/HeaderContract.css";
function Header() {
  return (
    <div className="header-contract">
      <h1 className="dashboard-title">Quản lý hợp đồng</h1>
      <button className="btn btn-primary">
        Thêm hợp đồng
        </button>  
    </div>
  );
}
export default Header;