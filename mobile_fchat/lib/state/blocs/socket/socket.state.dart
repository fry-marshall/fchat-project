abstract class SocketState {}

class SocketInitial extends SocketState {}

class SocketConnected extends SocketState {}

class SocketDisconnected extends SocketState {}

class SocketMessageReceived extends SocketState {
  final dynamic message;
  SocketMessageReceived(this.message);
}
