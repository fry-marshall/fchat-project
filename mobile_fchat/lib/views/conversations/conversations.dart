
import 'package:flutter/material.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/views/authentication/authentication.dart';

class ConversationsPage extends StatefulWidget{

  State<ConversationsPage> createState() => ConversationsPageState();
}

class ConversationsPageState extends State<ConversationsPage>{
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text("Conversation page")
      ),
    );
  }
}