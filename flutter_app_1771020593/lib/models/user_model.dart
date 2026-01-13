class UserModel {
  final int id;
  final String email;
  final String fullName;
  final String? phoneNumber;
  final String? address;
  final int loyaltyPoints;
  final bool isActive;
  final String? token;

  UserModel({
    required this.id,
    required this.email,
    required this.fullName,
    this.phoneNumber,
    this.address,
    this.loyaltyPoints = 0,
    this.isActive = true,
    this.token,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      email: json['email'] ?? '',
      fullName: json['full_name'] ?? '',
      phoneNumber: json['phone_number'],
      address: json['address'],
      loyaltyPoints: json['loyalty_points'] ?? 0,
      isActive: json['is_active'] ?? true,
      token: json['token'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'phone_number': phoneNumber,
      'address': address,
      'loyalty_points': loyaltyPoints,
      'is_active': isActive,
    };
  }
}
