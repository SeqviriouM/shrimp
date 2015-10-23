import React from 'react';
import {Route} from 'react-router';
import App from 'App';
import LoginPage from 'components/LoginPage';
import Login from 'components/Login';
import SignUp from 'components/SignUp';
import Settings from 'components/Settings';
import Profile from 'components/Profile';
import ChangePassword from 'components/ChangePassword';
import UserInfo from 'components/UserInfo';


export default (
  <div>
    <Route path='/' component={App} >
      <Route path='settings' component={Settings}>
        <Route path='profile' component={Profile} />
        <Route path='changepass' component={ChangePassword} />
      </Route>
      <Route path='user/:userId' component={UserInfo} />
    </Route>
    <Route path='/' component={LoginPage}>
      <Route path='login' component={Login} />
      <Route path='signup' component={SignUp} />
    </Route>
  </div>
);
