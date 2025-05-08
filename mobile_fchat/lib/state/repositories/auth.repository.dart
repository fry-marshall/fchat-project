import 'package:mobile_fchat/common/services/http-service.dart';

class AuthRepository {
  final HttpService httpService;
  AuthRepository({required this.httpService});

  Future<dynamic> signup({
    required String fullname,
    required String email,
    required String password,
  }) async {
    return await httpService.post('auth/signup', {
      'fullname': fullname,
      'email': email,
      'password': password,
    });
  }

  Future<dynamic> signin({
    required String email,
    required String password,
  }) async {
    return await httpService.post('auth/signin', {
      'email': email,
      'password': password,
    });
  }

  Future<dynamic> forgotPassword({required String email}) async {
    return await httpService.post('auth/forgotpassword', {'email': email});
  }

  Future<dynamic> logOut({required String refreshToken}) async {
    return await httpService.post('auth/logout', {'refresh_token': refreshToken});
  }

  Future<dynamic> refreshToken({required String refreshToken}) async {
    return await httpService.post('auth/refresh', {'refresh_token': refreshToken});
  }
}
