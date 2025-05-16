import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/main.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.bloc.dart';

import '../../state/blocs/auth/auth.event.dart';
import 'http-service.dart';

class AuthInterceptor extends Interceptor {
  final HttpService httpService;
  bool isRefreshing = false;

  AuthInterceptor(this.httpService);

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    bool hasAccessToken = (await Utils.getValue(key: 'access_token')) != null;
    if (err.response?.statusCode == 401 && hasAccessToken) {
      print(isRefreshing);

      if (isRefreshing) {
        return handler.reject(err);
      }

      print("yoooo");

      isRefreshing = true;

      final userBloc = navigatorKey.currentContext?.read<AuthBloc>();
      print(userBloc);
      if (userBloc != null) {
        print(userBloc);
        userBloc.add(RefreshTokenRequested());
      }

      print("userBloc");

      isRefreshing = false;
    }

    return super.onError(err, handler);
  }
}
