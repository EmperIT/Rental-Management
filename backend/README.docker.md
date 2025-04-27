# Hướng dẫn Docker cho dự án Rental Management

## Chuẩn bị môi trường

1. **Cài đặt Docker và Docker Compose**:
   - Cài đặt Docker: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
   - Docker Compose thường được cài đặt cùng với Docker Desktop.

2. **Cấu hình biến môi trường**:
   - Copy file `.env.example` thành `.env`:
     ```bash
     cp .env.example .env
     ```
   - Chỉnh sửa file `.env` với thông tin cấu hình thích hợp (thông tin database, API key, email...)

## Xây dựng và chạy với Docker

### Xây dựng và khởi động tất cả các service

```bash
# Di chuyển vào thư mục chứa file docker-compose.yml
cd c:/Users/truon/Documents/KTHDV/Rental-Management/backend

# Xây dựng và khởi động tất cả các service trong chế độ detached (chạy nền)
docker-compose up -d --build
```

### Kiểm tra log của các service

```bash
# Xem log của tất cả các service
docker-compose logs

# Xem log của một service cụ thể (ví dụ: api-gateway)
docker-compose logs api-gateway

# Xem log liên tục
docker-compose logs -f
```

### Dừng và xóa các container

```bash
# Dừng tất cả các service nhưng giữ lại container
docker-compose stop

# Dừng và xóa tất cả các container cùng với mạng
docker-compose down

# Xóa tất cả các container kèm theo volume (xóa cả dữ liệu)
docker-compose down -v
```

## Truy cập các service

- **API Gateway**: http://localhost:3000
- **API Documentation (Swagger)**: http://localhost:3000/api
- **MongoDB**: mongodb://localhost:27017 (yêu cầu xác thực)

## Các service con và port

| Service      | Internal Port | External Port |
|--------------|---------------|---------------|
| api-gateway  | 3000          | 3000          |
| auth         | 5000          | (internal)    |
| rental       | 5001          | (internal)    |
| contract     | 5002          | (internal)    |
| email        | 5003          | (internal)    |
| mongodb      | 27017         | 27017         |

## Triển khai trên môi trường sản xuất

Khi triển khai lên môi trường sản xuất, hãy đảm bảo:

1. Thay đổi tất cả mật khẩu mặc định trong file `.env`
2. Bật SSL/TLS cho API Gateway
3. Hạn chế quyền truy cập vào MongoDB từ bên ngoài
4. Sử dụng một service khác để quản lý log và giám sát (như ELK Stack)
5. Cấu hình backup dữ liệu tự động