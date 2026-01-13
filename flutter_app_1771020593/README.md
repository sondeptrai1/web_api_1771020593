# Restaurant App - Flutter Client

**Sinh Viên**: Nguyễn Thị Thành Nhã  
**Mã Sinh Viên**: 1771020519

## Mô Tả

Đây là ứng dụng Flutter client cho hệ thống quản lý nhà hàng, kết nối với Web API để:
- Đăng nhập khách hàng
- Xem danh sách món ăn (menu)
- Xem chi tiết món ăn

## Cấu Trúc Dự Án

```
lib/
├── main.dart                 # Entry point
├── models/
│   ├── user_model.dart       # Model cho user/customer
│   └── menu_item_model.dart  # Model cho menu item
├── providers/
│   ├── auth_provider.dart    # State management cho authentication
│   └── menu_provider.dart    # State management cho menu
├── screens/
│   ├── auth/
│   │   └── login_screen.dart # Màn hình đăng nhập
│   └── menu/
│       ├── menu_screen.dart  # Màn hình danh sách món ăn
│       └── item_detail_screen.dart # Màn hình chi tiết món
└── services/
    └── api_service.dart      # Service gọi API
```

## Yêu Cầu

- Flutter SDK 3.x
- Web API phải đang chạy trên `http://localhost:5000`

## Cài Đặt

1. Cài đặt dependencies:
```bash
flutter pub get
```

2. Chạy ứng dụng:
```bash
flutter run -d chrome
```

## Tài Khoản Demo

```
Email: customer1@example.com
Password: password123
```

## Tính Năng

### 1. Màn hình Đăng nhập (5 điểm)
- Form đăng nhập với email và password
- Validation đầy đủ
- Gọi API `/api/auth/login`
- Hiển thị loading và error

### 2. Màn hình Danh sách Món ăn (10 điểm)
- Hiển thị danh sách món ăn từ API `/api/menu-items`
- GridView với hình ảnh, tên, giá
- Hiển thị icon món chay (xanh) và cay (đỏ)
- Badge "Hết món" nếu không available
- Tìm kiếm và lọc theo category
- Rating hiển thị

### 3. Màn hình Chi tiết Món (5 điểm)
- Hiển thị chi tiết món ăn từ API `/api/menu-items/:id`
- Hình ảnh lớn
- Mô tả món ăn
- Thời gian chế biến
- Badge món chay/cay
- Trạng thái availability

## Packages Sử Dụng

- `provider` - State management
- `http` - HTTP requests

## Lưu Ý

Nếu chạy trên thiết bị thật hoặc emulator, cần đổi `localhost` thành IP của máy tính trong file `lib/services/api_service.dart`.
