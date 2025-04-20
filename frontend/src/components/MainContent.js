import React from "react";
import IllustrationImage from "../assets/images/landingpage.jpg";

function MainContent() {
  return (
    <div className="maincontent">
      {/* Left: Illustration Image */}
      <div className="illustration-section">
        <img
          src={IllustrationImage}
          alt="RentHub Illustration"
          className="illustration-image"
        />
      </div>

      {/* Right: Text and Buttons */}
      <div className="text-section">
        <h1 className="title">RentHub – Hệ thống quản lý nhà trọ tập trung</h1>
        <p className="description">
          Từ quản lý phòng, khách thuê đến hóa đơn – tất cả đều dễ dàng với RentHub, nền tảng dành cho chủ trọ thời đại số.
        </p>
        <div className="button-group">
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
}

export default MainContent;