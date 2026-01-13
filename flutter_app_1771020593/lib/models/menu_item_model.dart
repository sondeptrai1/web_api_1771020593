class MenuItemModel {
  final int id;
  final String name;
  final String? description;
  final String category;
  final double price;
  final String? imageUrl;
  final int preparationTime;
  final bool isVegetarian;
  final bool isSpicy;
  final bool isAvailable;
  final double rating;

  MenuItemModel({
    required this.id,
    required this.name,
    this.description,
    required this.category,
    required this.price,
    this.imageUrl,
    this.preparationTime = 0,
    this.isVegetarian = false,
    this.isSpicy = false,
    this.isAvailable = true,
    this.rating = 0.0,
  });

  factory MenuItemModel.fromJson(Map<String, dynamic> json) {
    return MenuItemModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'],
      category: json['category'] ?? '',
      price: double.tryParse(json['price']?.toString() ?? '0') ?? 0.0,
      imageUrl: json['image_url'],
      preparationTime: json['preparation_time'] ?? 0,
      isVegetarian: json['is_vegetarian'] == 1 || json['is_vegetarian'] == true,
      isSpicy: json['is_spicy'] == 1 || json['is_spicy'] == true,
      isAvailable: json['is_available'] == 1 || json['is_available'] == true,
      rating: double.tryParse(json['rating']?.toString() ?? '0') ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'category': category,
      'price': price,
      'image_url': imageUrl,
      'preparation_time': preparationTime,
      'is_vegetarian': isVegetarian,
      'is_spicy': isSpicy,
      'is_available': isAvailable,
      'rating': rating,
    };
  }
}
