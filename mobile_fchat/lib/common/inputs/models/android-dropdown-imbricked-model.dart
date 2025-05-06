import 'package:flutter/material.dart';

class AndroidDropdownImbrickedModel extends DropdownButton {

  @override
  dynamic value;
  Color borderColor;
  TextStyle? textStyle;
  List<Widget> elements;
  List<Widget> selectedItems;
  BuildContext context;
  @override
  void Function(dynamic) onChanged;

  AndroidDropdownImbrickedModel({super.key, 
    this.borderColor = Colors.black,
    this.textStyle,
    this.value,
    required this.elements,
    required this.selectedItems,
    required this.onChanged,
    required this.context
  }): super(
      value: value,
      items: elements.asMap().map((index, item){
        return MapEntry(index, DropdownMenuItem(value: index,child: item,));
      }).values.toList(),
      selectedItemBuilder: (context){
        return selectedItems;
      },
      style: textStyle,
      icon: Container(
        height: 35,
        width: 3,
        margin: const EdgeInsets.only(left: 10),
        decoration: const BoxDecoration(
            color: Colors.black26
        ),
      ),
      onChanged: onChanged,
    isExpanded: true,
  );
}
