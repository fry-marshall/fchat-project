import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/main.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.event.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.state.dart';
import 'package:mobile_fchat/state/blocs/message/message.bloc.dart';
import 'package:mobile_fchat/state/blocs/message/message.event.dart';
import 'package:mobile_fchat/state/blocs/user/user.bloc.dart';
import 'package:mobile_fchat/state/blocs/user/user.event.dart';
import 'package:mobile_fchat/state/blocs/user/user.state.dart';
import 'package:mobile_fchat/state/repositories/auth.repository.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository authRepository;

  AuthBloc({required this.authRepository}) : super(AuthState()) {
    on<SignUpRequested>(_onSignUpRequested);
    on<SignInRequested>(_onSignInRequested);
    on<ForgotPasswordRequested>(_onForgotPasswordRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<RefreshTokenRequested>(_onRefreshTokenRequested);
  }

  Future<void> _onSignUpRequested(
    SignUpRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(state.copyWith(status: AuthStatus.loading));
      await authRepository.signup(
        fullname: event.fullname,
        email: event.email,
        password: event.password,
      );

      emit(state.copyWith(status: AuthStatus.success));
    } catch (e) {
      print(e);
      DioException exception = e as DioException;
      String message = "";
      if (exception.response!.statusCode == 409) {
        message = "Email adress already existed.";
      } else {
        message = "An error is occured, try again later.";
      }
      emit(state.copyWith(status: AuthStatus.failure, errors: message));
    }
  }

  Future<void> _onSignInRequested(
    SignInRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(state.copyWith(status: AuthStatus.loading));
      final response = await authRepository.signin(
        email: event.email,
        password: event.password,
      );
      await Utils.storeValue(
        key: "access_token",
        value: response.data["data"]["access_token"],
      );
      await Utils.storeValue(
        key: "refresh_token",
        value: response.data["data"]["refresh_token"],
      );
      emit(state.copyWith(status: AuthStatus.success));
    } catch (e) {
      print(e);
      DioException exception = e as DioException;
      String message = "";
      if (exception.response!.statusCode == 404) {
        message = "Email or password incorrect.";
      } else if (exception.response!.statusCode == 401) {
        message = "Email not verified";
      } else {
        message = "An error is occured, try again later.";
      }
      emit(state.copyWith(status: AuthStatus.failure, errors: message));
    }
  }

  Future<void> _onForgotPasswordRequested(
    ForgotPasswordRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(state.copyWith(status: AuthStatus.loading));
      await authRepository.forgotPassword(email: event.email);
      emit(state.copyWith(status: AuthStatus.success));
    } catch (e) {
      DioException exception = e as DioException;
      print(exception.message);
      emit(
        state.copyWith(
          status: AuthStatus.failure,
          errors: "An error is occured, try again later.",
        ),
      );
    }
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(state.copyWith(status: AuthStatus.loading));
      String refreshToken = await Utils.getValue(key: 'refresh_token');
      await authRepository.logOut(refreshToken: refreshToken);
      await Utils.deleteValue(key: 'access_token');
      await Utils.deleteValue(key: 'refresh_token');
      emit(state.copyWith(status: AuthStatus.failure));

      /* navigatorKey.currentState?.pushNamedAndRemoveUntil(
        '/authentification',
        (route) => false,
      ); */
    } catch (e) {
      print(e);
      emit(
        state.copyWith(
          status: AuthStatus.failure,
          errors: "An error is occured, try again later.",
        ),
      );
    }
  }

  Future<void> _onRefreshTokenRequested(
    RefreshTokenRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      emit(state.copyWith(status: AuthStatus.loading));
      String refreshToken = await Utils.getValue(key: 'refresh_token');
      final response = await authRepository.refreshToken(
        refreshToken: refreshToken,
      );
      await Utils.storeValue(
        key: "access_token",
        value: response.data["data"]["access_token"],
      );
      await Utils.storeValue(
        key: "refresh_token",
        value: response.data["data"]["refresh_token"],
      );
      emit(state.copyWith(status: AuthStatus.loading, toReset: true));
    } catch (e) {
      print(e);
      DioException exception = e as DioException;
      print(exception.message);
      emit(
        state.copyWith(
          status: AuthStatus.failure,
          errors: "Session expired.\nPlease resign in.",
        ),
      );
      navigatorKey.currentState?.pushNamedAndRemoveUntil(
        '/authentification',
        (route) => false,
      );
    }
  }

  @override
  Future<void> onChange(Change<AuthState> change) async {
    super.onChange(change);
    print(change);
    if (change.nextState.toReset == true) {
      await Future.delayed(const Duration(seconds: 2));
      navigatorKey.currentContext?.read<UserBloc>().add(
        GetUserInfosRequested(),
      );
      navigatorKey.currentContext?.read<UserBloc>().add(
        GetAllUsersInfosRequested(),
      );
      navigatorKey.currentContext?.read<MessageBloc>().add(
        GetAllUserMessagesRequested(),
      );
    }
  }
}
