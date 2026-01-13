import 'package:flutter/material.dart';
import '../models/menu_item_model.dart';
import '../services/api_service.dart';

class MenuProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<MenuItemModel> _menuItems = [];
  MenuItemModel? _selectedItem;
  bool _isLoading = false;
  String? _error;

  List<MenuItemModel> get menuItems => _menuItems;
  MenuItemModel? get selectedItem => _selectedItem;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchMenuItems({
    String? search,
    String? category,
    bool? isVegetarian,
    bool? isSpicy,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final queryParams = <String, String>{};
      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }
      if (category != null && category.isNotEmpty) {
        queryParams['category'] = category;
      }
      if (isVegetarian != null) {
        queryParams['is_vegetarian'] = isVegetarian ? '1' : '0';
      }
      if (isSpicy != null) {
        queryParams['is_spicy'] = isSpicy ? '1' : '0';
      }

      final response = await _apiService.get('/menu-items', queryParams: queryParams);
      
      if (response['success'] == true) {
        final List<dynamic> data = response['data'] ?? [];
        _menuItems = data.map((item) => MenuItemModel.fromJson(item)).toList();
      } else {
        _error = response['message'] ?? 'Không thể tải danh sách món ăn';
      }
      
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchMenuItemById(int id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/menu-items/$id');
      
      if (response['success'] == true) {
        _selectedItem = MenuItemModel.fromJson(response['data']);
      } else {
        _error = response['message'] ?? 'Không tìm thấy món ăn';
      }
      
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
