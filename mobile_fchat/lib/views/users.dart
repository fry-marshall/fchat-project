import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/common/inputs/search-field.dart';
import 'package:mobile_fchat/state/blocs/message/message.bloc.dart';
import 'package:mobile_fchat/state/blocs/message/message.event.dart';
import 'package:mobile_fchat/state/blocs/message/message.state.dart';
import 'package:mobile_fchat/state/blocs/user/user.bloc.dart';
import 'package:mobile_fchat/state/blocs/user/user.event.dart';
import 'package:mobile_fchat/state/blocs/user/user.state.dart';
import 'package:mobile_fchat/state/models/conversation.dart';
import 'package:mobile_fchat/state/models/user.dart';
import 'package:mobile_fchat/views/conversations/conversation-detail.dart';
import 'package:mobile_fchat/views/widgets/user-card.dart';

class UsersPage extends StatefulWidget {
  State<UsersPage> createState() => UsersPageState();
}

class UsersPageState extends State<UsersPage> {
  TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<UserBloc, UserState>(
      builder: (context, userState) {
        return BlocBuilder<MessageBloc, MessageState>(
          builder: (context, messageState) {
            return Scaffold(
              appBar: AppBar(
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Colors.white,
                title: Text(
                  'New message',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 20),
                ),
                centerTitle: false,
              ),
              body: Container(
                padding: EdgeInsets.all(15),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 20),
                    searchField(context: context, controller: searchController, onChange: (value){
                      context.read<UserBloc>().add(FilterUserRequested(value ?? ''));
                    }),
                    const SizedBox(height: 40),
                    Expanded(
                      child: ListView.builder(
                        itemCount: userState.allUsersFiltered?.length,
                        itemBuilder: (context, index) {
                          User? user = userState.allUsersFiltered?[index];

                          return InkWell(
                            onTap: () {
                              Conversation? conversationExisted = messageState
                                  .allConversations
                                  ?.firstWhere(
                                    (conv) =>
                                        conv.user1_id == user.id ||
                                        conv.user2_id == user.id,
                                        orElse: () => Conversation(),
                                  );
                              if(conversationExisted?.id == null){
                                conversationExisted = Conversation(
                                  id: '',
                                  user1_id: userState.currentUser?.id,
                                  user2_id: user.id,
                                  messages: [],
                                );
                              }
                              
                              context.read<MessageBloc>().add(
                                SetCurrentConversationRequested(
                                  conversationExisted!,
                                ),
                              );
                              Utils.pusher(
                                context,
                                ConversationDetailPage(
                                  currentUser: userState.currentUser!,
                                  otherUser: user,
                                ),
                              );
                            },
                            child: userCard(user!),
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
