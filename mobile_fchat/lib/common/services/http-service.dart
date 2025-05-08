import 'dart:convert';
import 'package:dio/dio.dart';
import '../helpers/utils.dart';
import 'auth-interceptor.dart';

class HttpService {
  static dynamic headers = {'Content-Type': 'application/json'};
  final Dio dio = Dio();

  HttpService(){
    dio.interceptors.add(AuthInterceptor(this));
  }
  
  post(String link, dynamic body) async{
    var url = Utils.getUri(link);
    print(url);
    var token = await Utils.getValue(key: 'access_token');
    if(token != null){
      headers['Authorization'] = 'Bearer $token';
    }
    return dio.post(
      url,
      data: json.encode(body),
      options: Options(
        headers: headers
      )
    );
  }

  postRefreshToken(String link, dynamic body) async{
    var url = Utils.getUri(link);
    print(url);
    var token = await Utils.getValue(key: 'refresh_token');
    if(token != null){
      headers['Authorization'] = 'Bearer $token';
    }
    print(token);
    return dio.post(
      url,
      data: json.encode(body),
      options: Options(
        headers: headers
      )
    );
  }

  postFormData(String link, dynamic body) async{
    var url = Utils.getImgUrl() + link;
    var token = await Utils.getValue(key: 'access_token');
    if(token != null){
      headers['Authorization'] = 'Bearer $token';
    }
    FormData formData = FormData.fromMap(body);
    return await dio.post(
        url,
        data: formData,
        options: Options(
            headers: headers
        )
    );
  }

  get(String link) async{
    var url = Utils.getUri(link);
    var token = await Utils.getValue(key: 'access_token');
    if(token != null){
      headers['Authorization'] = 'Bearer $token';
    }
    print(url);
    return dio.get(
      url,
      options: Options(
        headers: headers
      )
    );
  }

  put(String link, dynamic body) async{
    var url = Utils.getUri(link);
    var token = await Utils.getValue(key: 'access_token');
    if(token != null){
      headers['Authorization'] = 'Bearer $token';
    }
    return dio.put(
      url,
      options: Options(
        headers: headers,
      ),
      data: json.encode(body),
    );
  }

  putFormData(String link, dynamic body) async{
    var dio = Dio();
    var url = Utils.getImgUrl() + link;
    print(url);
    var token = await Utils.getValue(key: 'access_token');
    if(token != null){
      headers['Authorization'] = 'Bearer $token';
    }
    FormData formData = FormData.fromMap(body);
    return dio.put(
        url,
        data: formData,
        options: Options(
            headers: headers
        )
    );
  }

  putFormFileData(String link, FormData formData) async{
    var dio = Dio();
    var url = Utils.getImgUrl() + link;
    var token = await Utils.getValue(key: 'access_token');
    if(token != null){
      headers['Authorization'] = 'Bearer $token';
      headers['Content-Type'] = 'multipart/form-data';
    }
    return dio.put(
        url,
        data: formData,
        options: Options(
            headers: headers
        )
    );
  }

  delete(String link, dynamic body) async{
    var url = Utils.getUri(link);
    var token = await Utils.getValue(key: 'access_token');
    if(token != null){
      headers['Authorization'] = 'Bearer $token';
    }
    return dio.delete(
      url,
      options: Options(
        headers: headers,
      ),
      data: json.encode(body),
    );
  }
}
