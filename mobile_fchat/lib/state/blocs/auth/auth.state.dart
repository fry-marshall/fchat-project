enum AuthStatus { initial, loading, success, failure }

class AuthState {
  final AuthStatus? status;
  final dynamic errors;

  AuthState({this.status, this.errors});

  AuthState copyWith({AuthStatus? status, dynamic errors}) {
    return AuthState(status: status, errors: errors);
  }
}