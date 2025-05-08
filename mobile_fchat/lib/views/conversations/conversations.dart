import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/common/inputs/search-field.dart';
import 'package:mobile_fchat/state/blocs/message/message.bloc.dart';
import 'package:mobile_fchat/state/blocs/message/message.event.dart';
import 'package:mobile_fchat/state/blocs/message/message.state.dart';
import 'package:mobile_fchat/state/blocs/socket/socket.cubit.dart';
import 'package:mobile_fchat/state/blocs/socket/socket.state.dart';
import 'package:mobile_fchat/state/blocs/user/user.bloc.dart';
import 'package:mobile_fchat/state/blocs/user/user.state.dart';
import 'package:mobile_fchat/state/models/conversation.dart';
import 'package:mobile_fchat/state/models/notification-message.dart';
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
          return Scaffold(body: Center(child: CircularProgressIndicator()));
        }

        return BlocConsumer<SocketCubit, SocketState>(
          listener: (context, socketState) async {
            if (socketState is SocketMessageReceived) {
              print("yoooo");
              /* final player = AudioPlayer();
              await player.play(AssetSource('assets/sound.mp3')); */
              NotificationMessage notificationMessage =
                  NotificationMessage.fromJson(socketState.message);
              context.read<MessageBloc>().add(
                NotifyNewMessageRequested(
                  notificationMessage,
                  userState.currentUser!,
                ),
              );
            }

            if (socketState is SocketReadMessage) {
              print(socketState.conversation_id);
              context.read<MessageBloc>().add(
                NotifyReadMessageRequested(
                  socketState.conversation_id,
                  userState.currentUser?.id,
                ),
              );
            }
          },
          builder: (context, socketState) {
            return BlocBuilder<MessageBloc, MessageState>(
              builder: (context, messageState) {
                if (messageState.status == Status.loading) {
                  return CircularProgressIndicator();
                } else {
                  messageState.allConversationsFiltered;
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
                            backgroundColor:
                                Theme.of(context).colorScheme.primary,
                            child: Icon(
                              Icons.add,
                              color: Colors.white,
                              size: 15,
                            ),
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            Utils.pusher(context, SettingsPage());
                          },
                          icon: CircleAvatar(
                            radius: 10,
                            backgroundColor:
                                Theme.of(context).colorScheme.primary,
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
                          searchField(
                            context: context,
                            controller: searchController,
                            onChange: (value) {
                              setState(() {
                                context.read<MessageBloc>().add(
                                  FilterMessageRequested(
                                    value ?? '',
                                    userState.currentUser!.id!,
                                    userState.allUsers!,
                                  ),
                                );
                              });
                            },
                          ),
                          const SizedBox(height: 40),
                          Expanded(
                            child: ListView.builder(
                              itemCount:
                                  messageState.allConversationsFiltered?.length,
                              itemBuilder: (context, index) {
                                Conversation conversation =
                                    messageState
                                        .allConversationsFiltered?[index] ??
                                    Conversation();
                                String? otherUserId =
                                    conversation.user1_id !=
                                            userState.currentUser?.id
                                        ? conversation.user1_id
                                        : conversation.user2_id;
                                User? otherUser = userState.allUsers
                                    ?.firstWhere(
                                      (user) => user.id == otherUserId,
                                      orElse: () => User(),
                                    );
                                return InkWell(
                                  onTap: () {
                                    context.read<MessageBloc>().add(
                                      SetCurrentConversationRequested(
                                        conversation,
                                      ),
                                    );
                                    context.read<MessageBloc>().add(
                                      ReadMessageRequested(
                                        conversation.id,
                                        userState.currentUser?.id,
                                      ),
                                    );
                                    Utils.pusher(
                                      context,
                                      ConversationDetailPage(
                                        currentUser: userState.currentUser!,
                                        otherUser: otherUser ?? User(),
                                      ),
                                    );
                                  },
                                  child: conversationCard(
                                    conversation,
                                    userState.currentUser ?? User(),
                                    otherUser ?? User(),
                                  ),
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }
              },
            );
          },
        );
      },
    );
  }
}

int sortedConversations(Conversation a, Conversation b) {
  DateTime aDate = DateTime.parse(a.messages![a.messages!.length - 1].date!);
  DateTime bDate = DateTime.parse(b.messages![b.messages!.length - 1].date!);

  if (aDate.isAfter(bDate)) {
    return -1;
  } else if (aDate.isBefore(bDate)) {
    return 1;
  }
  return 0;
}
