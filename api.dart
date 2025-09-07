import 'dart:convert';
import 'package:http/http.dart' as http';

class Api {
  // For Android emulator use 10.0.2.2, for device to local machine set your LAN IP
  static String base = const String.fromEnvironment('API_BASE', defaultValue: 'http://10.0.2.2:5000');

  static String? token;

  static Map<String, String> _headers() => {
    'Content-Type': 'application/json',
    if (token != null) 'Authorization': 'Bearer $token',
  };

  static Future<Map<String, dynamic>> login(String phone, String password) async {
    final res = await http.post(Uri.parse('$base/api/auth/login'),
      headers: _headers(),
      body: jsonEncode({'phone': phone, 'password': password})
    );
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return jsonDecode(res.body);
    }
    throw Exception(res.body);
  }

  static Future<List<dynamic>> products() async {
    final res = await http.get(Uri.parse('$base/api/products'), headers: _headers());
    if (res.statusCode == 200) return jsonDecode(res.body);
    throw Exception(res.body);
  }
}
