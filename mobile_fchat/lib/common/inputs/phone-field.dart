import 'package:flutter/material.dart';
import 'models/main-input-model.dart';

class PhoneField extends StatefulWidget {
  late TextEditingController controller;
  late String hint;
  Widget? prefixIcon;
  String? phoneUser;
  bool usePhoneUser;
  bool isRequired;
  bool readOnly;
  bool? enable;
  double borderRadius;
  Color borderColor;
  Color borderFocusedColor;
  TextAlign alignment;
  int maxLength;
  TextInputType inputType;
  FocusNode? focusNode;
  final String? Function(String?)? validator;
  final void Function(String?)? onChanged;

  static const Icon defaultIcon = Icon(
    Icons.phone_android,
    color: Colors.grey,
  );

  PhoneField(
      {super.key,
      required this.controller,
      this.hint = "",
      this.prefixIcon = defaultIcon,
      this.phoneUser,
      this.usePhoneUser = false,
      this.isRequired = true,
      this.readOnly = false,
      this.enable,
      this.borderRadius = 5,
      this.borderColor = const Color.fromRGBO(220, 220, 220, 1),
      this.borderFocusedColor = const Color.fromRGBO(220, 220, 220, 1),
      this.alignment = TextAlign.start,
      this.maxLength = 200,
      this.inputType = TextInputType.text,
      this.validator,
      this.onChanged,
      this.focusNode
    });

  @override
  PhoneFieldState createState() => PhoneFieldState();
}

class PhoneFieldState extends State<PhoneField> {
  String prefixText = "";

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
        Text(
          widget.hint + prefixText,
          style: const TextStyle(fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 8),
        MainInputModel(
          controller: widget.controller,
          prefixIcon: widget.prefixIcon,
          readOnly: widget.readOnly,
          enable: widget.enable,
          borderRadius: widget.borderRadius,
          borderColor: widget.borderColor,
          borderFocusedColor: widget.borderFocusedColor,
          inputType: TextInputType.phone,
          validator: widget.validator,
          onChanged: widget.onChanged,
          maxLength: widget.maxLength,
          alignment: widget.alignment,
          focusNode: widget.focusNode,
        ),
        if (widget.usePhoneUser)
          Column(
            children: [
              const SizedBox(height: 7),
              InkWell(
                onTap: () {
                  setState(() {
                    widget.controller.text = widget.phoneUser!;
                  });
                },
                child: const Text(
                  'Utiliser mon numéro de téléphone',
                  style: TextStyle(
                    color: Color.fromRGBO(0, 133, 255, 1),
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
        const SizedBox(height: 7),
      ],
    );
  }
}
