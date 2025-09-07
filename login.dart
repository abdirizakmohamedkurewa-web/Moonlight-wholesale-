import 'package:flutter/material.dart';
import '../services/api.dart';
import 'products.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final phoneCtrl = TextEditingController();
  final passCtrl = TextEditingController();
  bool loading = false;
  String? error;

  void doLogin() async {
    setState(() { loading = true; error = null; });
    try {
      final data = await Api.login(phoneCtrl.text.trim(), passCtrl.text);
      Api.token = data['token'];
      if (!mounted) return;
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const ProductsScreen()));
    } catch (e) {
      setState(() { error = '$e'; });
    } finally {
      setState(() { loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(controller: phoneCtrl, decoration: const InputDecoration(labelText: 'Phone (e.g. 0712...)')),
            const SizedBox(height: 12),
            TextField(controller: passCtrl, obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
            const SizedBox(height: 12),
            if (error != null) Text(error!, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: loading ? null : doLogin,
              child: Text(loading ? 'Please wait...' : 'Login'),
            )
          ],
        ),
      ),
    );
  }
}
