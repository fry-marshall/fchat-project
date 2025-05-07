
abstract class UserEvent {}

class GetUserInfosRequested extends UserEvent {
  GetUserInfosRequested();
}

class GetAllUsersInfosRequested extends UserEvent {
  GetAllUsersInfosRequested();
}

class UpdateUserRequested extends UserEvent {
  Map<String, dynamic> body;

  UpdateUserRequested({required this.body});
}

class DeleteUserRequested extends UserEvent {
  DeleteUserRequested();
}

class FilterUserRequested extends UserEvent {
  String value;
  FilterUserRequested(this.value);
}
