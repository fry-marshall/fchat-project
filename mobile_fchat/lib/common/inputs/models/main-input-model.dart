import 'package:flutter/material.dart';
import '../../helpers/utils.dart';

class MainInputModel extends TextFormField{

  @override
  TextEditingController? controller;

  Widget? prefixIcon;
  Widget? suffixIcon;
  bool readOnly;
  bool? enable;
  bool obstureText;
  int? maxLines;
  double borderRadius;
  Color borderColor;
  Color borderFocusedColor;
  TextAlign alignment;
  int maxLength;
  TextInputType? inputType;
  FocusNode? focusNode;
  @override
  final String? Function(String?)? validator;
  @override
  final void Function(String?)? onChanged;
  final void Function()? onTap;

  MainInputModel({super.key, 
    required this.controller,
    this.prefixIcon,
    this.suffixIcon,
    this.readOnly = false,
    this.enable = true,
    this.obstureText = false,
    this.maxLines = 1,
    this.borderRadius = 5,
    this.borderColor = const Color.fromRGBO(220, 220, 220, 1),
    this.borderFocusedColor = const Color.fromRGBO(220, 220, 220, 1),
    this.alignment = TextAlign.start,
    this.maxLength = 200,
    this.inputType,
    this.validator = Utils.DefaultValidator,
    this.onChanged,
    this.onTap,
    this.focusNode
  }) : super(
      controller: controller,
      readOnly: readOnly,
      textAlign: alignment,
      enabled: enable,
      obscureText: obstureText,
      maxLines: maxLines,
      decoration: InputDecoration(
        prefixIcon: prefixIcon,
        suffixIcon: suffixIcon,
        counterText: "",
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(borderRadius),
            borderSide: BorderSide(color: borderColor)
        ),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(borderRadius),
            borderSide: BorderSide(color: borderFocusedColor)
        ),
      ),
      keyboardType: inputType,
      validator: validator,
      onTap: onTap,
      focusNode: focusNode,
      onChanged: onChanged,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      maxLength: maxLength,
      style: const TextStyle(
        fontSize: 14.0,
        color: Colors.black,
      ),
  );

}