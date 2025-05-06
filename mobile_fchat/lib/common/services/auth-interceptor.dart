import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/state/blocs/auth/auth.bloc.dart';

import '../../state/blocs/auth/auth.event.dart';
import 'http-service.dart';

class AuthInterceptor extends Interceptor {
  final HttpService httpService;
  bool isRefreshing = false;

  AuthInterceptor(this.httpService);

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, ne pas relancer
        return handler.reject(err);
      }

      isRefreshing = true; // Bloque d'autres tentatives

      /* final userBloc = navigatorKey.currentContext?.read<AuthBloc>();
      if (userBloc != null) {
        userBloc.add(RefreshTokenRequested());
      } */

      await Future.delayed(const Duration(seconds: 2)); // Attendre que le token soit rafraîchi

      isRefreshing = false; // Réactive le refresh après le délai
    }

    return super.onError(err, handler);
  }

}
