import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment.prod';
import {AlertService} from '../../_services/alert.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {matchPassword} from '../../Classes/password.validation';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnDestroy, OnInit {

    @Output()
    loginEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

    userLogin: any = {};
    loginForm: FormGroup;
    submitted = false;
    rightEmail = false;
    newPassword = false;
    formData: FormGroup;
    passwordForm: FormGroup;

    loading = false;
    loginSubscription: any;
    constructor(
        formBuilder: FormBuilder,
        /*formBuilder1: FormBuilder,*/
        private router: Router,
        private alertService: AlertService,
        private authService: AuthenticationService
    ) {
        if (localStorage.getItem(environment.userStorageKey) !== null) {
            // noinspection JSIgnoredPromiseFromCall
            router.navigateByUrl('/dashboard');
        }

        this.passwordForm = new FormGroup({
            'password': new FormControl('', [
                Validators.required,
                Validators.pattern('[A-z0-9]*'),
                Validators.minLength(6)
            ]),
            'verify': new FormControl('', [
                // matchPassword(this.passwordForm.getRawValue().password_)
            ]),
            'token': new FormControl('', [
                Validators.required
            ])
        });

        this.loginForm = formBuilder.group({
            username: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])],
        });

        /*this.emailData = formBuilder1.group({
            email: ['', Validators.compose([Validators.pattern('[^ @]*@[^ @]*')])]
        });*/
    }

    ngOnInit(): void {
        this.formData = new FormGroup({
            'email': new FormControl('', [
                Validators.required,
                Validators.pattern('[^ @]*@[^ @]*')
            ])
        });


    }

    ngOnDestroy(): void {
        if (this.loginSubscription) {
            this.loginSubscription.unsubscribe();
        }
    }

    get email_() { return this.formData.get('email'); }

    get password_() { return this.passwordForm.get('password'); }

    get token_() { return this.passwordForm.get('token'); }

    get verify_() { return this.passwordForm.get('verify'); }

    nextStep() {
        this.rightEmail = true;
    }
    lastStep() {
        this.newPassword = true;
    }

    onLogin() {
        this.submitted = true;
        if (!this.loginForm.valid) {
            return false;
        }
        this.loading = true;
        if (this.userLogin.password === undefined || this.userLogin.password === null) {
            this.userLogin.password = '';
        }
        this.loginSubscription = this.authService.login(this.userLogin.username, this.userLogin.password).subscribe(
            data => {
                if (!data) {
                    this.alertService.error('Internal Server Error. Consult the administrator.');
                } else if (!isNullOrUndefined(data.data) && data.data) {
                    try {
                        const dat = JSON.parse(data.data);
                        if (dat.id) {
                            // localStorage.setItem(environment.userStorageKey, dat);
                            this.loginEmitter.emit(true);
                        }else {
                            this.alertService.error(dat || 'Invalid login Credentials..');
                        }
                    }catch (e) {
                        this.alertService.error(data.data);
                    }
                } else {
                    this.alertService.error(data.error || 'An error occurred..');
                }
                this.loading = false;
            },
            (error) => {
                this.alertService.error('Unable to look up the server..');
                this.loading = false;
            });
    }

}
