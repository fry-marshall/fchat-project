import 'package:flutter/material.dart';

class AndroidDropdownModel extends DropdownButtonFormField {

  dynamic value;
  int padding;
  double borderRadius;
  Color borderColor;
  TextStyle? textStyle;
  List<Widget> items;
  List<Widget> selectedItems;
  BuildContext context;
  @override
  void Function(dynamic) onChanged;

  AndroidDropdownModel({super.key, 
    this.padding = 10,
    this.borderRadius = 10,
    this.borderColor = Colors.black,
    this.textStyle,
    this.value,
    required this.items,
    required this.selectedItems,
    required this.onChanged,
    required this.context
  }): super(
      value: value,
      items: items.asMap().map((index, item){
        return MapEntry(index, DropdownMenuItem(value: index,child: item,));
      }).values.toList(),
      selectedItemBuilder: (context){
        return selectedItems;
      },
      decoration: InputDecoration(
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(borderRadius),
            borderSide: BorderSide(color: borderColor)
        ),
      ),
      style: textStyle,
      onChanged: onChanged
  );
}
