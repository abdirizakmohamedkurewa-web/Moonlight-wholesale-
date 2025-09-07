import 'package:flutter/material.dart';
import 'screens/login.dart';
import 'screens/products.dart';
import 'services/api.dart';

void main() {
  runApp(const MoonlightApp());
}

class MoonlightApp extends StatelessWidget {
  const MoonlightApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Moonlight Wholesale',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.green),
      home: const LoginScreen(),
    );
  }
}
