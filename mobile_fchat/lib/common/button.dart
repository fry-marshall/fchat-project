import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final String title;
  final VoidCallback action;
  final bool isLoading;
  final bool isOutlined;
  final double radius;
  final Color? color;
  final EdgeInsets padding;
  final double fontSize;

  const CustomButton({
    super.key,
    required this.title,
    required this.action,
    this.isLoading = false,
    this.isOutlined = false,
    this.radius = 5,
    this.color,
    this.padding = const EdgeInsets.all(15),
    this.fontSize = 14,
  });

  @override
  Widget build(BuildContext context) {
    final colorBtn =
        isOutlined
            ? Colors.white
            : color ?? Theme.of(context).colorScheme.primary;

    return InkWell(
      onTap: isLoading ? null : action,
      borderRadius: BorderRadius.circular(radius),
      child: Container(
        width: double.infinity,
        padding: padding,
        decoration: BoxDecoration(
          color: colorBtn,
          borderRadius: BorderRadius.circular(radius),
          border: Border.all(color: Theme.of(context).colorScheme.primary),
        ),
        child: Center(
          child:
              isLoading
                  ? const SizedBox(
                    width: 15,
                    height: 15,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5,
                      color: Colors.white,
                    ),
                  )
                  : Text(
                    title,
                    style: TextStyle(
                      color:
                          isOutlined
                              ? Theme.of(context).colorScheme.primary
                              : Colors.white,
                      fontWeight: FontWeight.w700,
                      fontSize: fontSize,
                    ),
                  ),
        ),
      ),
    );
  }
}
