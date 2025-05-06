import 'package:flutter/material.dart';
import 'models/main-input-model.dart';

class PasswordField extends StatefulWidget{
  late TextEditingController controller;
  late String hint;
  bool isRequired;
  bool? enable;
  double borderRadius;
  Color borderColor;
  Color borderFocusedColor;
  TextInputType inputType;
  final String? Function(String?)? validator;
  final String? Function(String?)? onChanged;


  PasswordField({
    super.key,
    required this.controller,
    required this.hint,
    this.isRequired = true,
    this.enable,
    this.borderRadius = 5,
    this.borderColor = const Color.fromRGBO(220, 220, 220, 1),
    this.borderFocusedColor = const Color.fromRGBO(220, 220, 220, 1),
    this.inputType = TextInputType.visiblePassword,
    this.validator,
    this.onChanged
  });

  @override
  PasswordFieldState createState() => PasswordFieldState();
}

class PasswordFieldState extends State<PasswordField>{

  String prefixText = "";
  IconData suffixIcon = Icons.visibility_off;
  bool obscureText = true;
  TextInputType type = TextInputType.visiblePassword;

  @override
  void initState() {
    // TODO: implement initState
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
            prefixIcon: const Icon(Icons.lock, size: 22,),
            obstureText: obscureText,
            suffixIcon: InkWell(
              onTap: () {
                setState(() {
                  obscureText = !obscureText;
                });
              },
              child: obscureText == true ? const Icon(Icons.visibility_off, size: 22) : const Icon(Icons.visibility, size: 22)
            ),
            enable: widget.enable,
            borderRadius: widget.borderRadius,
            borderColor: widget.borderColor,
            borderFocusedColor: widget.borderFocusedColor,
            inputType: TextInputType.text,
            validator: widget.validator,
            onChanged: widget.onChanged,
        ),
        const SizedBox(height: 7,),
      ],
    );
  }
}