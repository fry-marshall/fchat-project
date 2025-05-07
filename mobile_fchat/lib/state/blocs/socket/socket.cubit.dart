import 'package:bloc/bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

import 'socket.state.dart';

class SocketCubit extends Cubit<SocketState> {
  late IO.Socket _socket;

  SocketCubit() : super(SocketInitial());

  void initSocket() async {
    _socket = IO.io(
      "https://${dotenv.env['API_URL']}",
      IO.OptionBuilder().setTransports(['websocket']).setAuth({
        'token': await Utils.getValue(key: 'access_token'),
      })
      .build(),
    );

    _socket.connect();

    _socket.onConnect((_) {
      print('✅ Connected');
      emit(SocketConnected());
    });

    _socket.on('new_message', (data) {
      print('📩 Message received: $data');
      emit(SocketMessageReceived(data));
    });

    _socket.onDisconnect((_) {
      print('❌ Disconnected');
      emit(SocketDisconnected());
    });
  }

  void disposeSocket() {
    _socket.dispose();
  }
}
