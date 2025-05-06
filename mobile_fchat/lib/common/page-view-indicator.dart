import 'package:flutter/material.dart';

Widget PageViewIndicator({
  required int index,
  required int currentPageView,
  required Color color
})
{
  return AnimatedContainer(
    duration: const Duration(milliseconds: 300),
    margin: const EdgeInsets.only(left: 10, right: 10),
    height: 14,
    width: 14,
    decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(100),
        border: Border.all(color: color),
        color: (currentPageView == index ) ? color : Colors.white
    ),
  );
}