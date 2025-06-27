import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/state/blocs/message/message.bloc.dart';
import 'package:mobile_fchat/state/blocs/message/message.event.dart';
import 'package:mobile_fchat/state/blocs/message/message.state.dart';
import 'package:mobile_fchat/state/models/message.dart';
import 'package:mobile_fchat/state/models/user.dart';
import 'package:mobile_fchat/views/widgets/message-bubble.dart';
import 'package:url_launcher/url_launcher.dart';

class ConversationDetailPage extends StatefulWidget {
  User currentUser;
  User otherUser;
  ConversationDetailPage({required this.currentUser, required this.otherUser});
  State<ConversationDetailPage> createState() => ConversationDetailPageState();
}

class ConversationDetailPageState extends State<ConversationDetailPage> {
  TextEditingController controllerMessage = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<MessageBloc, MessageState>(
      builder: (context, messageState) {
        return Scaffold(
          appBar: AppBar(
            centerTitle: false,
            backgroundColor: Theme.of(context).colorScheme.primary,
            foregroundColor: Colors.white,
            title: Row(
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundImage: NetworkImage(
                    'https://${dotenv.env['ASSETS_URL']!}/${widget.otherUser.profile_img}',
                  ),
                ),
                const SizedBox(width: 15),
                Text(
                  widget.otherUser.fullname!,
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 20),
                ),
              ],
            ),
            actions: [
              IconButton(
                onPressed: () {
                  reportContent(widget.otherUser.id!);
                },
                icon: Icon(Icons.report),
              ),
            ],
          ),
          body: Container(
            padding: EdgeInsets.all(15),
            height: Utils.height(context),
            child: Stack(
              children: [
                Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 80,
                  child: ListView.builder(
                    controller: _scrollController,
                    itemCount:
                        messageState.currentConversation?.messages?.length,
                    itemBuilder: (context, index) {
                      Message? message =
                          messageState.currentConversation?.messages?[index];
                      if (message?.receiver_id == widget.currentUser.id) {
                        return Align(
                          alignment: Alignment.topLeft,
                          child: MessageBubble(message, true),
                        );
                      } else {
                        return Align(
                          alignment: Alignment.topRight,
                          child: MessageBubble(message, false),
                        );
                      }
                    },
                  ),
                ),
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 10,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      SizedBox(
                        width: Utils.width(context) - 80,
                        child: TextFormField(
                          controller: controllerMessage,
                          decoration: InputDecoration(
                            counterText: "",
                            hintText: "Type message",
                            filled: true,
                            fillColor: const Color.fromRGBO(240, 240, 240, 1),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(30),
                              borderSide: BorderSide.none,
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(30),
                              borderSide: BorderSide.none,
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(30),
                              borderSide: BorderSide.none,
                            ),
                            contentPadding: EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 12,
                            ),
                          ),
                        ),
                      ),
                      IconButton(
                        icon: Icon(Icons.send),
                        onPressed: () {
                          if (controllerMessage.text.isNotEmpty &&
                              controllerMessage.text.trim().isNotEmpty) {
                            context.read<MessageBloc>().add(
                              SendMessageRequested(
                                widget.otherUser.id,
                                widget.currentUser.id,
                                controllerMessage.text.trim(),
                              ),
                            );
                            controllerMessage.clear();
                            WidgetsBinding.instance.addPostFrameCallback((_) {
                              _scrollController.animateTo(
                                _scrollController.position.maxScrollExtent,
                                duration: Duration(milliseconds: 300),
                                curve: Curves.easeOut,
                              );
                            });
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void reportContent(String userId) async {
    final Uri emailLaunchUri = Uri(
      scheme: 'mailto',
      path: 'marshalfry1998@gmail.com',
      queryParameters: {
        'subject': 'Report content',
        'body':
            'I would like to report unapropriate messages from this user: $userId',
      },
    );
    print("toto");

    if (await canLaunchUrl(emailLaunchUri)) {
      await launchUrl(emailLaunchUri);
    } else {
      print("Could not launch email client.");
    }
  }
}
