import 'package:flutter/material.dart';
import 'models/main-input-model.dart';

class CustomTextField extends StatefulWidget{
  late TextEditingController controller;
  late String hint;
  Icon? prefixIcon;
  bool isRequired;
  bool readOnly;
  bool? enable;
  int? maxLines;
  double borderRadius;
  Color borderColor;
  Color borderFocusedColor;
  TextInputType inputType;
  final String? Function(String?)? validator;
  final String? Function(String?)? onChanged;

  CustomTextField({
    super.key,
    required this.controller,
    required this.hint,
    this.prefixIcon,
    this.isRequired = true,
    this.readOnly = false,
    this.enable,
    this.maxLines,
    this.borderRadius = 5,
    this.borderColor = const Color.fromRGBO(220, 220, 220, 1),
    this.borderFocusedColor = const Color.fromRGBO(220, 220, 220, 1),
    this.inputType = TextInputType.text,
    this.validator,
    this.onChanged
  });

  @override
  CustomTextFieldState createState() => CustomTextFieldState();
}

class CustomTextFieldState extends State<CustomTextField>{

  String prefixText = "";

  @override
  void initState() {
    super.initState();
    prefixText = (widget.isRequired) ? ' *' : '';
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text( widget.hint + prefixText, style: const TextStyle(fontWeight: FontWeight.w500),),
        const SizedBox(height: 8,),
        MainInputModel(
            controller: widget.controller,
            prefixIcon: widget.prefixIcon,
            readOnly: widget.readOnly,
            enable: widget.enable,
            maxLines: widget.maxLines,
            borderRadius: widget.borderRadius,
            borderColor: widget.borderColor,
            borderFocusedColor: widget.borderFocusedColor,
            inputType: widget.inputType,
            validator: widget.validator,
            onChanged: widget.onChanged,
        ),
        const SizedBox(height: 7,),
      ],
    );
  }
}