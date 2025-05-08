import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_fchat/common/helpers/utils.dart';
import 'package:mobile_fchat/state/blocs/user/user.event.dart';
import 'package:mobile_fchat/state/blocs/user/user.state.dart';
import 'package:mobile_fchat/state/models/user.dart';
import 'package:mobile_fchat/state/repositories/user.repository.dart';

class UserBloc extends Bloc<UserEvent, UserState> {
  final UserRepository userRepository;

  UserBloc({required this.userRepository}) : super(UserState()) {
    on<GetUserInfosRequested>(_onGetUserInfosRequested);
    on<GetAllUsersInfosRequested>(_onGetAllUsersInfosRequested);
    on<DeleteUserRequested>(_onDeleteUserRequested);
    on<UpdateUserRequested>(_onUpdateUserRequested);
    on<FilterUserRequested>(_onFilterUserRequested);
    on<DeviceTokenRequested>(_onDeviceTokenRequested);
  }

  Future<void> _onGetUserInfosRequested(
    GetUserInfosRequested event,
    Emitter<UserState> emit,
  ) async {
    try {
      emit(state.copyWith(status: Status.loading));
      final response = await userRepository.getUserInfos();

      User user = User.fromJson(response.data["data"]);

      emit(state.copyWith(status: Status.success, currentUser: user));
    } catch (e) {
      print(e);
      emit(
        state.copyWith(
          status: Status.failure,
          errors: "An error is occured, try again later.",
        ),
      );
    }
  }

  Future<void> _onGetAllUsersInfosRequested(
    GetAllUsersInfosRequested event,
    Emitter<UserState> emit,
  ) async {
    try {
      emit(state.copyWith(status: Status.loading));
      final response = await userRepository.getAllUsersInfos();

      List<User> users =
          response.data["data"]
              .map<User>((user) => User.fromJson(user))
              .where((user) => user.id != state.currentUser?.id)
              .toList();
      emit(state.copyWith(status: Status.success, allUsers: users, allUsersFiltered: users));
    } catch (e) {
      print(e);
      emit(
        state.copyWith(
          status: Status.failure,
          errors: "An error is occured, try again later.",
        ),
      );
    }
  }

  Future<void> _onUpdateUserRequested(
    UpdateUserRequested event,
    Emitter<UserState> emit,
  ) async {
    try {
      emit(state.copyWith(status: Status.loading));
      final response = await userRepository.updateUser(event.body);

      User user = User(
        fullname: response.data["data"]["user"]["fullname"] ?? state.currentUser?.fullname,
        description: response.data["data"]["user"]["description"] ?? state.currentUser?.description,
        profile_img: response.data["data"]["user"]["profile_img"] ?? state.currentUser?.profile_img,
      );

      emit(
        state.copyWith(status: Status.success, currentUser: user),
      );
    } catch (e) {
      //print(e);
      DioException exception = e as DioException;
      print(exception.response?.data);
      emit(
        state.copyWith(
          status: Status.failure,
          errors: "An error is occured, try again later.",
        ),
      );
    }
  }

  Future<void> _onDeleteUserRequested(
    DeleteUserRequested event,
    Emitter<UserState> emit,
  ) async {
    try {
      emit(state.copyWith(status: Status.loading));
      await userRepository.deleteUser();
      await Utils.getValue(key: 'access_token');
      await Utils.getValue(key: 'refresh_token');

      emit(
        state.copyWith(status: Status.success, allUsers: [], currentUser: null),
      );
    } catch (e) {
      print(e);
      emit(
        state.copyWith(
          status: Status.failure,
          errors: "An error is occured, try again later.",
        ),
      );
    }
  }

  Future<void> _onDeviceTokenRequested(
    DeviceTokenRequested event,
    Emitter<UserState> emit,
  ) async {
    try {
      emit(state.copyWith(status: Status.loading));
      var body = {
        "device_token": event.token
      };
      await userRepository.addDeviceToken(body);

      emit(
        state.copyWith(status: Status.success),
      );
    } catch (e) {
      print(e);
      emit(
        state.copyWith(
          status: Status.failure,
          errors: "An error is occured, try again later.",
        ),
      );
    }
  }

  Future<void> _onFilterUserRequested(
    FilterUserRequested event,
    Emitter<UserState> emit,
  ) async {
    List<User>? allUsersFiltered =
        state.allUsers?.where((user) => user.fullname?.toLowerCase().contains(event.value.toLowerCase()) ?? false).toList();

    emit(
      state.copyWith(
        status: Status.success,
        allUsersFiltered: allUsersFiltered,
      ),
    );
  }
}
