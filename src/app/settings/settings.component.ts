import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {User} from '../_models/user';
import {SettingsService} from '../_services/settings.service';
import {AlertService} from '../_services/alert.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    user: User = null;
    settings = [];
    loading = false;
    formSettings = {};
    shouldDisable = true;

    constructor(
        private settingsService: SettingsService,
        private alertService: AlertService,
    ) {
        if (localStorage.getItem(environment.userStorageKey) != null) {
            this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
        }

    }

    ngOnInit() {
        if (this.user !== null) {
            this.getSettings();
        }
    }

    isBoolean(val) {
        return val === false || val === true || val instanceof Boolean;
    }

    getSettings() {
        const token = localStorage.getItem(environment.tokenKey);
        this.settingsService.fetch_settings(this.user.id, token).subscribe((data) => {
            if (data) {
                if (data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                if (data.data) {
                    this.settings = JSON.parse(data.data);
                    for (const setting of this.settings) {
                        this.formSettings[setting._id] = setting[setting._id];
                    }
                } else if (data.error) {
                    this.alertService.error(data.error);
                }
            }
        });
    }

    saveSettings($event) {
        $event.preventDefault();
        this.shouldDisable = true;

        this.loading = true;
        const token = localStorage.getItem(environment.tokenKey);
        this.settingsService.update_settings(this.formSettings, this.user.id, token).subscribe((data) => {
            if (data) {
                if (data.token) {
                    localStorage.setItem(environment.tokenKey, data.token);
                }
                if (data.data) {
                    this.getSettings();
                    this.alertService.success(data.data);
                }else if (data.error) {
                    this.alertService.error(data.error);
                }
            }
            this.loading = false;
        }, error2 => {
            this.alertService.error(error2.message);
            this.loading = false;
        });
    }

}
