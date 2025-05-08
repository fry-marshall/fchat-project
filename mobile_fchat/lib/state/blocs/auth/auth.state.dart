enum AuthStatus { initial, loading, success, failure }

class AuthState {
  final AuthStatus? status;
  final bool? toReset;
  final dynamic errors;

  AuthState({this.status, this.errors, this.toReset});

  AuthState copyWith({AuthStatus? status, dynamic errors, bool? toReset}) {
    return AuthState(status: status, errors: errors, toReset: toReset);
  }
}