import 'package:flutter/material.dart';

Widget PageViewItem({
  required String title,
  TextStyle titleStyle = const TextStyle(
      fontSize: 20,
      fontFamily: "Roboto",
      fontWeight: FontWeight.w900,
      color: Colors.black
  ),
  TextStyle descriptionStyle = const TextStyle(
      fontSize: 10,
      fontFamily: "Roboto",
      fontWeight: FontWeight.w200,
      color: Colors.black
  ),
  required String imageUrl,
  required String description,
  required BuildContext context
})
{
  return Padding(
    padding: const EdgeInsets.all(30),
    child: Column(
      mainAxisSize: MainAxisSize.max,
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Image.asset(
          imageUrl,
          width: MediaQuery.of(context).size.width/2,
        ),
        const SizedBox(height: 20,),
        Text(
          title,
          style: titleStyle,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 40,),
        Text(
          description,
          style: descriptionStyle,
          textAlign: TextAlign.center,
        ),
      ],
    ),
  );
}
