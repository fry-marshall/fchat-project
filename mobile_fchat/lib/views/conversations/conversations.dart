import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/common/inputs/search-field.dart';
import 'package:mobile_fchat/state/blocs/message/message.bloc.dart';
import 'package:mobile_fchat/state/blocs/message/message.event.dart';
import 'package:mobile_fchat/state/blocs/message/message.state.dart';
import 'package:mobile_fchat/state/blocs/user/user.bloc.dart';
import 'package:mobile_fchat/state/blocs/user/user.state.dart';
import 'package:mobile_fchat/state/models/conversation.dart';
import 'package:mobile_fchat/state/models/user.dart';
import 'package:mobile_fchat/views/conversations/conversation-detail.dart';
import 'package:mobile_fchat/views/settings/settings.dart';
import 'package:mobile_fchat/views/users.dart';
import 'package:mobile_fchat/views/widgets/conversation-card.dart';

class ConversationsPage extends StatefulWidget {
  State<ConversationsPage> createState() => ConversationsPageState();
}

class ConversationsPageState extends State<ConversationsPage> {
  TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<UserBloc, UserState>(
      builder: (context, userState) {
        if (userState.status == Status.loading) {
          return CircularProgressIndicator();
        }

        return BlocBuilder<MessageBloc, MessageState>(
          builder: (context, messageState) {
            return Scaffold(
              appBar: AppBar(
                title: Image.asset('assets/logo.png', width: 40),
                centerTitle: false,
                actions: [
                  IconButton(
                    onPressed: () {
                      Utils.pusher(context, UsersPage());
                    },
                    icon: CircleAvatar(
                      radius: 10,
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      child: Icon(Icons.add, color: Colors.white, size: 15),
                    ),
                  ),
                  IconButton(
                    onPressed: () {
                      Utils.pusher(context, SettingsPage());
                    },
                    icon: CircleAvatar(
                      radius: 10,
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      child: Icon(
                        Icons.settings,
                        color: Colors.white,
                        size: 15,
                      ),
                    ),
                  ),
                ],
              ),
              body: Container(
                padding: EdgeInsets.all(15),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 20),
                    searchField(context: context, controller: searchController),
                    const SizedBox(height: 40),
                    Expanded(
                      child: ListView.builder(
                        itemCount: messageState.allConversations?.length,
                        itemBuilder: (context, index) {
                          Conversation? conversation =
                              messageState.allConversations?[index];
                          String otherUserId =
                              conversation!.user1_id !=
                                      userState.currentUser?.id
                                  ? conversation.user1_id!
                                  : conversation.user2_id!;
                          User otherUser =
                              userState.allUsers?.firstWhere(
                                (user) => user.id == otherUserId,
                              ) ??
                              User();
                          return InkWell(
                            onTap: () {
                              context.read<MessageBloc>().add(
                                SetCurrentConversationRequested(conversation),
                              );
                              Utils.pusher(
                                context,
                                ConversationDetailPage(
                                  currentUser: userState.currentUser!,
                                  otherUser: otherUser,
                                ),
                              );
                            },
                            child: conversationCard(
                              conversation,
                              userState.currentUser!,
                              otherUser,
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
