import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
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
  }

  Future<void> _onGetUserInfosRequested(
    GetUserInfosRequested event,
    Emitter<UserState> emit,
  ) async {
    try {
      emit(state.copyWith(status: Status.loading));
      final response = await userRepository.getUserInfos();
      print(response.data);

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
              .toList();
      emit(state.copyWith(status: Status.success, allUsers: users));
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
      // TODO add removing storage variable and redirect to authentication

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
}
