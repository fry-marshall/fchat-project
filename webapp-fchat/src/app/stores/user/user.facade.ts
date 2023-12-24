import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { take } from "rxjs";
import { AppState } from "../app.state";
import * as userActions from "./user.actions";
import { User } from "@library_v2/interfaces/user";
import { getCurrentUser, getUsers, getUsersToSendMessages } from "./user.selector";

@Injectable({
    providedIn: 'root'
})
export class UserFacade{

    constructor(
        protected store: Store<AppState>,
        protected actions$: Actions
    ){
    }

    users$ = this.store.select(getUsers)
    usersToSendMessages$ = this.store.select(getUsersToSendMessages)
    currentUser$ = this.store.select(getCurrentUser)

    getAllUsers(){
        this.store.dispatch(userActions.GetAllUsersAccount())

        return this.actions$.pipe(
            ofType(userActions.GetAllUsersAccountSuccess),
            take(1)
        )
    }
    
    createUserAccount(user: Partial<User>){
        this.store.dispatch(userActions.CreateUserAccount({user}))

        return this.actions$.pipe(
            ofType(userActions.CreateUserAccountSuccess),
            take(1)
        )
    }

    logInUser(login: string, password: string){
        this.store.dispatch(userActions.LogInUser({login, password}))

        return this.actions$.pipe(
            ofType(userActions.LogInUserSuccess),
            take(1)
        )
    }

    logOutUser(){
        this.store.dispatch(userActions.LogOutUser())

        return this.actions$.pipe(
            ofType(userActions.LogOutUserSuccess),
            take(1)
        )
    }

    forgotPasswordUser(email: string){
        this.store.dispatch(userActions.ForgotPasswordUser({email}))

        return this.actions$.pipe(
            ofType(userActions.ForgotPasswordUserSuccess),
            take(1)
        )
    }

    resetPasswordUser(password: string, confirm_password: string){
        this.store.dispatch(userActions.ResetPasswordUser({password, confirm_password}))

        return this.actions$.pipe(
            ofType(userActions.ResetPasswordUserSuccess),
            take(1)
        )
    }

    verifyEmailUser(){
        this.store.dispatch(userActions.VerifyEmailUser())

        return this.actions$.pipe(
            ofType(userActions.VerifyEmailUserFailure),
            take(1)
        )
    }

    deleteUser(){
        this.store.dispatch(userActions.DeleteUser())

        return this.actions$.pipe(
            ofType(userActions.DeleteUserFailure),
            take(1)
        )
    }

    updateUserAccount(user: any){
        this.store.dispatch(userActions.UpdateUserAccount({user}))

        return this.actions$.pipe(
            ofType(userActions.UpdateUserAccountSuccess),
            take(1)
        )
    }

    updateUserProfileImg(profile_img: any){
        this.store.dispatch(userActions.UpdateUserProfilImg({profile_img}))

        return this.actions$.pipe(
            ofType(userActions.UpdateUserProfilImgSuccess),
            take(1)
        )
    }

}