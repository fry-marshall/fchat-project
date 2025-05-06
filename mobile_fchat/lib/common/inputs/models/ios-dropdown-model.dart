import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class iOSDropdownModel extends CupertinoPicker {

  int defaultValue;
  List<Widget> items;
  @override
  void Function(int) onSelectedItemChanged;

  iOSDropdownModel({super.key, 
    this.defaultValue = 0,
    required this.items,
    required this.onSelectedItemChanged,
  }): super(
      children: items,
      backgroundColor: Colors.white,
      itemExtent: 40.0,
      scrollController: FixedExtentScrollController(
        initialItem: defaultValue
      ),
      onSelectedItemChanged: onSelectedItemChanged
  );
}
