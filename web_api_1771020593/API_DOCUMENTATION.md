# API_DOCUMENTATION.md

# Restaurant Management Web API - Tài Liệu Chi Tiết

**Sinh Viên**: Nguyễn Trung Sơn  
**Mã Sinh Viên**: 1771020593
**Base URL**: `http://localhost:5000/api`

## Table of Contents
1. [Authentication](#authentication)
2. [Customer Management](#customer-management)
3. [Menu Management](#menu-management)
4. [Reservation Management](#reservation-management)
5. [Table Management](#table-management)
6. [Error Codes](#error-codes)

---

## Authentication

### Register - Đăng Ký Tài Khoản

**Endpoint**: `POST /auth/register`

**Description**: Tạo tài khoản khách hàng mới

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "customer@example.com",
  "password": "password123",
  "full_name": "Nguyễn Văn A",
  "phone_number": "0912345678",
  "address": "123 Đường ABC, TP.HCM"
}
```

**Validation Rules**:
- `email`: Required, email format, unique
- `password`: Required, minimum 6 characters
- `full_name`: Required
- `phone_number`: Optional
- `address`: Optional

**Success Response** (201):
```json
{
  "success": true,
  "message": "Customer registered successfully",
  "data": {
    "id": 1,
    "email": "customer@example.com",
    "full_name": "Nguyễn Văn A"
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Validation error",
  "error": "\"email\" must be a valid email"
}
```

**Error Response** (409):
```json
{
  "success": false,
  "message": "Duplicate entry",
  "error": "Email đã tồn tại"
}
```

---

### Login - Đăng Nhập

**Endpoint**: `POST /auth/login`

**Description**: Đăng nhập và nhận JWT token

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Validation Rules**:
- `email`: Required, email format
- `password`: Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "customer@example.com",
      "full_name": "Nguyễn Văn A",
      "role": "customer"
    }
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Get Current User - Lấy Thông Tin Người Dùng Hiện Tại

**Endpoint**: `GET /auth/me`

**Description**: Lấy thông tin của người dùng hiện tại

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "customer@example.com",
    "full_name": "Nguyễn Văn A",
    "phone_number": "0912345678",
    "address": "123 Đường ABC, TP.HCM",
    "loyalty_points": 150,
    "role": "customer"
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "No token provided"
}
```

---

## Customer Management

### Get All Customers - Lấy Danh Sách Tất Cả Khách Hàng

**Endpoint**: `GET /customers`

**Description**: Lấy danh sách tất cả khách hàng (Admin only)

**Request Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "customer@example.com",
      "full_name": "Nguyễn Văn A",
      "phone_number": "0912345678",
      "address": "123 Đường ABC, TP.HCM",
      "loyalty_points": 150,
      "is_active": true
    }
  ]
}
```

---

### Get Customer by ID - Lấy Thông Tin Khách Hàng

**Endpoint**: `GET /customers/{id}`

**Description**: Lấy thông tin chi tiết của một khách hàng

**Parameters**:
- `id` (path): Customer ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "customer@example.com",
    "full_name": "Nguyễn Văn A",
    "phone_number": "0912345678",
    "address": "123 Đường ABC, TP.HCM",
    "loyalty_points": 150,
    "is_active": true
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Customer not found"
}
```

---

### Update Customer - Cập Nhật Thông Tin Khách Hàng

**Endpoint**: `PUT /customers/{id}`

**Description**: Cập nhật thông tin khách hàng

**Parameters**:
- `id` (path): Customer ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body** (Optional fields):
```json
{
  "full_name": "Nguyễn Văn A Updated",
  "phone_number": "0987654321",
  "address": "456 Đường DEF, TP.HCM"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Customer updated successfully",
  "data": {
    "id": 1,
    "email": "customer@example.com",
    "full_name": "Nguyễn Văn A Updated",
    "phone_number": "0987654321",
    "address": "456 Đường DEF, TP.HCM",
    "loyalty_points": 150
  }
}
```

---

### Get Customer Reservations - Lấy Danh Sách Đặt Bàn

**Endpoint**: `GET /customers/{id}/reservations`

**Description**: Lấy danh sách đặt bàn của khách hàng

**Parameters**:
- `id` (path): Customer ID
- `status` (query, optional): Filter by status (pending, confirmed, seated, completed, cancelled, no_show)
- `page` (query, optional): Page number (default: 1)
- `limit` (query, optional): Items per page (default: 10)

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Example Request**:
```
GET /customers/1/reservations?status=completed&page=1&limit=5
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "reservation_number": "RES-20240115-001",
      "reservation_date": "2024-01-15T19:00:00.000Z",
      "number_of_guests": 4,
      "table_number": "T01",
      "status": "completed",
      "special_requests": "Bàn gần cửa sổ",
      "subtotal": 500000,
      "service_charge": 50000,
      "discount": 25000,
      "total": 525000,
      "payment_method": "card",
      "payment_status": "paid",
      "items": [
        {
          "id": 1,
          "reservation_id": 1,
          "menu_item_id": 1,
          "quantity": 2,
          "price": 80000,
          "name": "Phở Bò",
          "description": "Phở bò truyền thống",
          "category": "Main Course"
        }
      ]
    }
  ]
}
```

---

## Menu Management

### Get All Menu Items - Lấy Danh Sách Thực Đơn

**Endpoint**: `GET /menu-items`

**Description**: Lấy danh sách all menu items với filter và pagination

**Query Parameters**:
- `search` (optional): Tìm kiếm trong name và description
- `category` (optional): Filter theo category (Appetizer, Main Course, Dessert, Beverage, Soup)
- `vegetarian_only` (optional): true/false - Chỉ hiển thị món chay
- `spicy_only` (optional): true/false - Chỉ hiển thị món cay
- `available_only` (optional): true/false - Chỉ hiển thị món có sẵn
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Request Headers**:
```
Content-Type: application/json
```

**Example Requests**:
```
GET /menu-items?search=phở
GET /menu-items?category=Main Course&available_only=true&page=1&limit=10
GET /menu-items?vegetarian_only=true&spicy_only=false
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Phở Bò",
      "description": "Phở bò truyền thống Hà Nội",
      "category": "Main Course",
      "price": 80000,
      "image_url": null,
      "preparation_time": 20,
      "is_vegetarian": false,
      "is_spicy": false,
      "is_available": true,
      "rating": 4.5,
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "pages": 2
  }
}
```

---

### Get Menu Item by ID - Lấy Chi Tiết Món Ăn

**Endpoint**: `GET /menu-items/{id}`

**Description**: Lấy thông tin chi tiết của một món ăn

**Parameters**:
- `id` (path): Menu Item ID

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Phở Bò",
    "description": "Phở bò truyền thống Hà Nội",
    "category": "Main Course",
    "price": 80000,
    "image_url": null,
    "preparation_time": 20,
    "is_vegetarian": false,
    "is_spicy": false,
    "is_available": true,
    "rating": 4.5
  }
}
```

---

### Create Menu Item - Thêm Món Ăn (Admin)

**Endpoint**: `POST /menu-items`

**Description**: Thêm món ăn mới vào thực đơn (Admin only)

**Request Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Phở Gà",
  "description": "Phở gà nấu trong hành gừng",
  "category": "Main Course",
  "price": 75000,
  "image_url": "https://example.com/pho-ga.jpg",
  "preparation_time": 18,
  "is_vegetarian": false,
  "is_spicy": false
}
```

**Validation Rules**:
- `name`: Required, string
- `description`: Optional, string
- `category`: Required, enum (Appetizer, Main Course, Dessert, Beverage, Soup)
- `price`: Required, number
- `image_url`: Optional, string
- `preparation_time`: Optional, number
- `is_vegetarian`: Optional, boolean (default: false)
- `is_spicy`: Optional, boolean (default: false)

**Success Response** (201):
```json
{
  "success": true,
  "message": "Menu item created successfully",
  "data": {
    "id": 21,
    "name": "Phở Gà",
    "description": "Phở gà nấu trong hành gừng",
    "category": "Main Course",
    "price": 75000,
    "image_url": "https://example.com/pho-ga.jpg",
    "preparation_time": 18,
    "is_vegetarian": false,
    "is_spicy": false
  }
}
```

---

### Update Menu Item - Cập Nhật Món Ăn (Admin)

**Endpoint**: `PUT /menu-items/{id}`

**Description**: Cập nhật thông tin món ăn (Admin only)

**Parameters**:
- `id` (path): Menu Item ID

**Request Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body** (Optional fields):
```json
{
  "name": "Phở Bò Premium",
  "price": 90000,
  "is_available": true
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Menu item updated successfully",
  "data": {...}
}
```

---

### Delete Menu Item - Xóa Món Ăn (Admin)

**Endpoint**: `DELETE /menu-items/{id}`

**Description**: Xóa một món ăn khỏi thực đơn (Admin only)

**Parameters**:
- `id` (path): Menu Item ID

**Request Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Cannot delete item - it is in active reservations"
}
```

---

### Search Menu Items - Tìm Kiếm Món Ăn

**Endpoint**: `GET /menu-items/search`

**Description**: Tìm kiếm món ăn theo tên hoặc mô tả

**Query Parameters**:
- `q` (required): Search query

**Example Request**:
```
GET /menu-items/search?q=phở
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Phở Bò",
      "description": "Phở bò truyền thống Hà Nội",
      "category": "Main Course",
      "price": 80000,
      "is_available": true
    },
    {
      "id": 2,
      "name": "Phở Gà",
      "description": "Phở gà nấu trong hành gừng",
      "category": "Main Course",
      "price": 75000,
      "is_available": true
    }
  ]
}
```

---

## Reservation Management

### Create Reservation - Đặt Bàn

**Endpoint**: `POST /reservations`

**Description**: Tạo đặt bàn mới

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "reservation_date": "2024-01-20T19:00:00Z",
  "number_of_guests": 4,
  "special_requests": "Bàn gần cửa sổ"
}
```

**Validation Rules**:
- `reservation_date`: Required, date/timestamp
- `number_of_guests`: Required, integer
- `special_requests`: Optional, string

**Success Response** (201):
```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "id": 11,
    "reservation_number": "RES-20240120-001",
    "status": "pending"
  }
}
```

---

### Get Reservation by ID - Lấy Chi Tiết Đặt Bàn

**Endpoint**: `GET /reservations/{id}`

**Description**: Lấy thông tin chi tiết của một đặt bàn

**Parameters**:
- `id` (path): Reservation ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "customer_id": 1,
    "reservation_number": "RES-20240115-001",
    "reservation_date": "2024-01-15T19:00:00.000Z",
    "number_of_guests": 4,
    "table_number": "T01",
    "status": "confirmed",
    "special_requests": "Bàn gần cửa sổ",
    "subtotal": 500000,
    "service_charge": 50000,
    "discount": 0,
    "total": 550000,
    "payment_method": null,
    "payment_status": "pending",
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z",
    "items": [
      {
        "id": 1,
        "reservation_id": 1,
        "menu_item_id": 1,
        "quantity": 2,
        "price": 80000,
        "name": "Phở Bò",
        "description": "Phở bò truyền thống",
        "category": "Main Course"
      }
    ]
  }
}
```

---

### Add Item to Reservation - Thêm Món vào Đơn

**Endpoint**: `POST /reservations/{id}/items`

**Description**: Thêm một món ăn vào đặt bàn

**Parameters**:
- `id` (path): Reservation ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "menu_item_id": 1,
  "quantity": 2
}
```

**Validation Rules**:
- `menu_item_id`: Required, integer
- `quantity`: Required, integer

**Success Response** (201):
```json
{
  "success": true,
  "message": "Item added to reservation",
  "data": {
    "reservation_id": 1,
    "menu_item_id": 1,
    "quantity": 2,
    "subtotal": 500000,
    "service_charge": 50000,
    "total": 550000
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Menu item not found"
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Menu item is not available"
}
```

---

### Confirm Reservation - Xác Nhận Đặt Bàn (Admin)

**Endpoint**: `PUT /reservations/{id}/confirm`

**Description**: Xác nhận đặt bàn và phân bàn (Admin only)

**Parameters**:
- `id` (path): Reservation ID

**Request Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "table_number": "T01"
}
```

**Validation Rules**:
- `table_number`: Required, string

**Success Response** (200):
```json
{
  "success": true,
  "message": "Reservation confirmed",
  "data": {
    "id": 1,
    "status": "confirmed",
    "table_number": "T01"
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Table not found"
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Table is not available"
}
```

---

### Pay Reservation - Thanh Toán

**Endpoint**: `POST /reservations/{id}/pay`

**Description**: Thanh toán cho đặt bàn và tính toán loyalty points

**Parameters**:
- `id` (path): Reservation ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "payment_method": "card",
  "use_loyalty_points": true,
  "loyalty_points_to_use": 500
}
```

**Validation Rules**:
- `payment_method`: Required, enum (cash, card, online)
- `use_loyalty_points`: Optional, boolean
- `loyalty_points_to_use`: Optional, integer

**Business Logic**:
- 1 loyalty point = 1000 VND
- Maximum discount = 50% of total
- Loyalty points gained = 1% of total after discount
- Loyalty points used are deducted from customer balance

**Success Response** (200):
```json
{
  "success": true,
  "message": "Payment successful",
  "data": {
    "id": 1,
    "status": "completed",
    "payment_status": "paid",
    "total": 525000,
    "discount": 25000,
    "loyalty_points_used": 25,
    "loyalty_points_gained": 5250
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Reservation must be seated to pay"
}
```

---

### Cancel Reservation - Hủy Đặt Bàn

**Endpoint**: `DELETE /reservations/{id}`

**Description**: Hủy một đặt bàn

**Parameters**:
- `id` (path): Reservation ID

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Business Logic**:
- Customer chỉ có thể hủy pending hoặc confirmed reservations
- Admin có thể hủy bất cứ reservation nào
- Nếu đã xác nhận, bàn sẽ được giải phóng

**Success Response** (200):
```json
{
  "success": true,
  "message": "Reservation cancelled",
  "data": {
    "id": 1,
    "status": "cancelled"
  }
}
```

---

## Table Management

### Get All Tables - Lấy Danh Sách Bàn

**Endpoint**: `GET /tables`

**Description**: Lấy danh sách tất cả bàn nhà hàng

**Query Parameters**:
- `available_only` (optional): true/false - Chỉ hiển thị bàn trống

**Example Requests**:
```
GET /tables
GET /tables?available_only=true
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "table_number": "T01",
      "capacity": 2,
      "is_available": true,
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "table_number": "T02",
      "capacity": 2,
      "is_available": true,
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### Create Table - Thêm Bàn (Admin)

**Endpoint**: `POST /tables`

**Description**: Thêm bàn mới (Admin only)

**Request Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "table_number": "T09",
  "capacity": 8
}
```

**Validation Rules**:
- `table_number`: Required, string, unique
- `capacity`: Required, integer

**Success Response** (201):
```json
{
  "success": true,
  "message": "Table created successfully",
  "data": {
    "id": 9,
    "table_number": "T09",
    "capacity": 8,
    "is_available": true
  }
}
```

---

### Update Table - Cập Nhật Bàn (Admin)

**Endpoint**: `PUT /tables/{id}`

**Description**: Cập nhật thông tin bàn (Admin only)

**Parameters**:
- `id` (path): Table ID

**Request Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body** (Optional fields):
```json
{
  "table_number": "T09",
  "capacity": 10
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Table updated successfully",
  "data": {
    "id": 9,
    "table_number": "T09",
    "capacity": 10,
    "is_available": true
  }
}
```

---

### Delete Table - Xóa Bàn (Admin)

**Endpoint**: `DELETE /tables/{id}`

**Description**: Xóa một bàn (Admin only)

**Parameters**:
- `id` (path): Table ID

**Request Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Table deleted successfully"
}
```

---

## Error Codes

### Standard HTTP Status Codes

| Code | Description | Use Case |
|------|-------------|----------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST request |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate entry (email) |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Common Error Messages

**Validation Error**:
```json
{
  "success": false,
  "message": "Validation error",
  "error": "\"email\" must be a valid email"
}
```

**Authentication Error**:
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Authorization Error**:
```json
{
  "success": false,
  "message": "Access denied. Admin only"
}
```

**Resource Not Found**:
```json
{
  "success": false,
  "message": "Customer not found"
}
```

**Duplicate Entry**:
```json
{
  "success": false,
  "message": "Duplicate entry",
  "error": "Email đã tồn tại"
}
```

---

## Sample Requests using cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "phone_number": "0912345678",
    "address": "123 Test Street"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Menu Items
```bash
curl -X GET "http://localhost:5000/api/menu-items?category=Main Course&page=1&limit=10" \
  -H "Content-Type: application/json"
```

### Create Reservation
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reservation_date": "2024-01-20T19:00:00Z",
    "number_of_guests": 4,
    "special_requests": "Bàn gần cửa sổ"
  }'
```

---

## Postman Collection

[Link to download Postman collection](./postman_collection.json)

---

**End of API Documentation**
