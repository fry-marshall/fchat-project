import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../helpers/utils.dart';

Widget searchField({
  required BuildContext context,
  required TextEditingController controller,
  String? Function(String?)? onChange
}){

  if(Utils.isAndroid(context)){
    return TextFormField(
        controller: controller,
        decoration: InputDecoration(
            contentPadding: const EdgeInsets.symmetric(vertical: 5),
            hintText: "Rechercher",
            prefixIcon: const Icon(Icons.search),
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(5))),
        onChanged: onChange
    );
  }
  else{
    return CupertinoSearchTextField(
        placeholder: "Rechercher",
        controller: controller,
        onChanged: onChange
    );
  }
}