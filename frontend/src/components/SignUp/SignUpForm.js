function SignUpForm() {
    return (
      <form className="signup-form">
        <div className="form-group">
          <label htmlFor="fullName">Họ và Tên</label>
          <input
            type="text"
            id="fullName"
            placeholder="Nhập họ và tên"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="text"
            id="phone"
            placeholder="Nhập số điện thoại"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Nhập email"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Ngày sinh</label>
          <input
            type="text"
            id="dob"
            placeholder="Nhập ngày sinh (VD: 01/01/1990)"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Địa chỉ</label>
          <input
            type="text"
            id="address"
            placeholder="Nhập địa chỉ"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="not-robot">
            <input type="checkbox" />
            Tôi không phải là người máy
          </label>
        </div>
        <button type="submit" className="signup-btn">Đăng ký</button>
      </form>
    );
  }
  
  export default SignUpForm; 