import 'package:mobile_fchat/common/services/http-service.dart';

class UserRepository {
  final HttpService httpService;
  UserRepository({required this.httpService});

  Future<dynamic> getUserInfos() async {
    return await httpService.get('users/me');
  }

  Future<dynamic> getAllUsersInfos() async {
    return await httpService.get('users');
  }

  Future<dynamic> deleteUser() async {
    return await httpService.delete('users/me', {});
  }

  Future<dynamic> updateUser(Map<String, dynamic> body) async {
    return await httpService.putFormData('/users/me', body);
  }
}
