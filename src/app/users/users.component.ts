import { Component, OnInit } from '@angular/core';
import {RegisteredUsers} from '../Classes/registered-users';
import {RegisteredUsersService} from '../_services/registered-users.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Register} from '../Classes/register';
import {environment} from '../../environments/environment.prod';
import {User} from '../_models/user';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import {forEach} from '@angular/router/src/utils/collection';
import {element} from 'protractor';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {

    user: User = null;
    users: User[] = [];
    userEdit: User = new User();
    isUserEdited = false;
    passwordError = false;
    register = new Register('', '', '', '', '', '');

    loading = false;
    submitted = false;
    public formdata;

    constructor(
        private registeredUsersService: RegisteredUsersService,
        private usersService: UserService,
        private alertService: AlertService,
    ) {
        if (localStorage.getItem(environment.userStorageKey) !== null) {
            this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
        }
    }

    ngOnInit(): void {
        this.formdata = new FormGroup({
            'firstName': new FormControl(this.register.first_Name, [
                Validators.required,
                Validators.minLength(2),
                Validators.pattern('[A-Za-z]+')
            ]),
            'lastName': new FormControl(this.register.last_Name, [
                Validators.required,
                Validators.minLength(2),
                Validators.pattern('[A-Za-z]+')
            ]),
            'userName': new FormControl(this.register.user_Name, [
                Validators.required,
                Validators.minLength(2),
                Validators.pattern('[A-Za-z0-9]+')
            ]),
            'email': new FormControl(this.register._email, [
                Validators.required,
                Validators.pattern('[^ @]*@[^ @]*')
            ]),
            'password': new FormControl(this.register._passwd, [Validators.required]),
            'verify': new FormControl(this.register.verify_Passwd, [Validators.required])
        });

        if (this.user !== null) {
            this.getUsers();
        }
    }

    edit(user: User) {
        this.userEdit = user;
        this.formdata.controls.email.disable();
        this.formdata.controls.password.disable();
        this.formdata.controls.verify.disable();
        this.isUserEdited = true;
    }

    get first() { return this.formdata.get('firstName'); }
    get last() { return this.formdata.get('lastName'); }
    get uName() { return this.formdata.get('userName'); }
    get email_() { return this.formdata.get('email'); }
    get password_() { return this.formdata.get('password'); }
    get verify_() { return this.formdata.get('verify'); }

    createNewUser() {

        if (this.isUserEdited) {
            this.updateCurrentUser();
            return;
        }
        this.submitted = true;
        if (!this.formdata.valid || this.user == null) {
            return;
        }
        this.isUserEdited = false;
        this.loading = true;
        const token = localStorage.getItem(environment.tokenKey);
        this.usersService.createUser(this.userEdit, this.user.id, token).subscribe(
            data => {
                this.loading = false;
                this.submitted = false;
                if (data && data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                if (data && data.data) {
                    this.alertService.success(data.data);
                    this.getUsers();
                }else {
                    this.alertService.error(data.error);
                }

            }, error => {
                console.log(error.error);
            }
        );
    }

    updateCurrentUser() {
        if (this.userEdit.username.length < 1 || this.userEdit.first_name.length < 1 || this.userEdit.last_name.length < 1) {
            return;
        }
        this.isUserEdited = false;
        this.loading = true;
        const token = localStorage.getItem(environment.tokenKey);
        this.usersService.updateUser(this.userEdit, this.user.id, token).subscribe(
            data => {
                this.loading = false;
                this.submitted = false;
                if (data && data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                if (data && data.data) {
                    this.alertService.success(data.data);
                }else {
                    this.alertService.error(data.error);
                }

            }, error => {
                console.log(error.error);
            }
        );
    }

    getUsers(): void {
        const token = localStorage.getItem(environment.tokenKey);
        this.usersService.fetchUsers(this.user.id, token).subscribe(
            data => {
                if (data && data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                if (data && data.data) {
                    try {
                        this.users = JSON.parse(data.data);
                    } catch (e) {
                        this.alertService.success(data.data);
                    }
                }else {
                    this.alertService.error(data.error);
                }

            }, error => {
                console.log(error.error);
            }
        );
    }

    deactivate(user: User) {
        const token = localStorage.getItem(environment.tokenKey);
        this.usersService.deactivateUser(user.email, this.user.id, token).subscribe(
            data => {
                if (data && data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                if (data && data.data) {
                    this.alertService.success(data.data);
                    user.status = 'deactivated';
                }else {
                    this.alertService.error(data.error);
                }

            }, error => {
                console.log(error.error);
            }
        );
    }

    activate(user: User) {
        const token = localStorage.getItem(environment.tokenKey);
        this.usersService.activateUser(user.email, this.user.id, token).subscribe(
            data => {
                if (data && data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                if (data && data.data) {
                    this.alertService.success(data.data);
                    user.status = 'active';
                }else {
                    this.alertService.error(data.error);
                }

            }, error => {
                console.log(error.error);
            }
        );
    }
}
