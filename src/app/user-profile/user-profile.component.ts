import { Component, OnInit } from '@angular/core';
import {User} from '../_models/user';
import {environment} from '../../environments/environment.prod';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User;
  constructor() {
      this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
  }

  ngOnInit() {
  }

}
