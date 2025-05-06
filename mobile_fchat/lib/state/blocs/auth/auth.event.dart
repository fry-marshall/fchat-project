abstract class AuthEvent {}

class SignUpRequested extends AuthEvent {
  String fullname;
  String email;
  String password;

  SignUpRequested(
    this.fullname,
    this.email,
    this.password,
  );
}

class SignInRequested extends AuthEvent {
  final String email;
  final String password;

  SignInRequested(this.email, this.password);
}

class LogoutRequested extends AuthEvent {}

class ForgotPasswordRequested extends AuthEvent {
  final String email;

  ForgotPasswordRequested(this.email);
}

class RefreshTokenRequested extends AuthEvent {
  RefreshTokenRequested();
}
