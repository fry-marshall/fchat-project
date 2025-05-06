import 'package:mobile_fchat/state/models/user.dart';

enum Status { initial, loading, success, failure }

class UserState {
  final Status? status;
  final User? currentUser;
  final List<User>? allUsers;
  final dynamic errors;

  UserState({this.status, this.errors, this.currentUser, this.allUsers});

  UserState copyWith({
    Status? status,
    dynamic errors,
    User? currentUser,
    List<User>? allUsers,
  }) {
    return UserState(
      status: status,
      errors: errors,
      currentUser: currentUser ?? this.currentUser,
      allUsers: allUsers ?? this.allUsers,
    );
  }
}
