import 'package:flutter/material.dart';
import '../services/api.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  List items = [];
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    load();
  }

  void load() async {
    setState((){ loading = true; error = null; });
    try {
      items = await Api.products();
    } catch (e) {
      error = '$e';
    } finally {
      setState((){ loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Products')),
      body: loading
        ? const Center(child: CircularProgressIndicator())
        : error != null
          ? Center(child: Text(error!))
          : ListView.builder(
              itemCount: items.length,
              itemBuilder: (_, i) {
                final p = items[i];
                return ListTile(
                  title: Text(p['name'] ?? ''),
                  subtitle: Text('KES ${p['price']} • Stock: ${p['stock']}'),
                );
              },
            ),
    );
  }
}
