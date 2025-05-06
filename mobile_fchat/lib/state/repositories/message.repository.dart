import 'package:mobile_fchat/common/services/http-service.dart';

class MessageRepository {
  final HttpService httpService;
  MessageRepository({required this.httpService});

  Future<dynamic> getUserMessages() async {
    return await httpService.get('messages/me');
  }

  Future<dynamic> sendMessage(Map<String, String> body) async {
    return await httpService.post('messages/send', body);
  }

  Future<dynamic> readMessage(Map<String, String> body) async {
    return await httpService.delete('messages/read', body);
  }
}
