import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Immutable, {Map, List} from 'immutable';
import store from 'store';
import cx from 'classnames';
import InfoMessage from 'components/InfoMessage';
import PasswordInput from 'components/PasswordInput';
import Button from 'components/Button';
import './styles.scss';


@connect(state => ({
  local: state.local,
  users: state.users,
}))

export default class ChangePassword extends React.Component {

  static propTypes = {
    users: PropTypes.instanceOf(List).isRequired,
    local: PropTypes.instanceOf(Map).isRequired,
    children: PropTypes.node,
  }

  constructor(props) {
    super(props);
    this.state = {
      info: {
        type: 'info',
        text: 'Change your password',
      },
      shakeInfo: false,
      oldPassword: '',
      password: '',
      repeatedPassword: '',
      showOldPasswordError: false,
      showPasswordError: false,
      showRepeatedPasswordError: false,
      inProgress: false,
    };
  }


  componentWillMount() {
  }

  componentWillReceiveProps() {
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.users.size > 0 && !Immutable.is(nextProps.users, this.props.users)) {
      nextProps.history.pushState(null, '/');
    }

    return true;
  }


  changePassword = (e) => {
    e.preventDefault();

    if (!this.state.oldPassword) {
      return this.setState({
        showOldPasswordError: true,
        info: {
          type: 'error',
          text: 'Old password is required',
        },
      });
    }

    if (!this.state.password) {
      return this.setState({
        showPasswordError: true,
        info: {
          type: 'error',
          text: 'Password is required',
        },
      });
    }

    if (this.state.password !== this.state.repeatedPassword) {
      return this.setState({
        showRepeatedPasswordError: true,
        info: {
          type: 'error',
          text: 'The passwords don\'t match. Please check and try again.',
        },
      });
    }

    const changedData = {
      oldPassword: this.state.oldPassword,
      password: this.state.password,
    };


    this.setState({
      inProgress: true,
    });

    fetch('/changepass', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(changedData),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then(data => {
          if (data.status.type === 'success') {
            this.setState({
              inProgress: false,
            });
            store.history.pushState(null, '/');
          } else {
            if (data.status.error) {
              this.setState({
                info: {
                  type: 'error',
                  text: 'Error',
                },
                inProgress: false,
              });
            } else {
              this.setState({
                info: {
                  type: 'error',
                  text: data.status.text,
                },
                inProgress: false,
              });
            }
          }
        });
      } else {
        return;
      }
    });
  }

  oldPasswordChange = e => {
    this.setState({
      oldPassword: e.target.value,
      showOldPasswordError: false,
    });
  }


  passwordChange = e => {
    this.setState({
      password: e.target.value,
      showNameError: false,
    });
  }

  repeatedPasswordChange = e => {
    this.setState({
      repeatedPassword: e.target.value,
      showRepeatedPasswordError: false,
      showPasswordError: false,
    });
  }


  render() {
    return (
      <div className='change-password'>
        <form
          className='change-password__form'
          onSubmit={this.changePassword}
        >
          <InfoMessage
            className='change-password__info-message'
            type={this.state.info.type}
            shake={this.state.shakeInfo}
          >{this.state.info.text}</InfoMessage>
          <PasswordInput
            className={cx('change-password__input', {
              'input_type_error': this.state.showOldPasswordError,
            })}
            name='old-password'
            placeholder='Old password'
            onChange={this.oldPasswordChange}
          />
          <PasswordInput
            className={cx('change-password__input', {
              'input_type_error': this.state.showPasswordError,
            })}
            name='password'
            placeholder='New password'
            onChange={this.passwordChange}
          />
          <PasswordInput
            className={cx('change-password__input', {
              'input_type_error': this.state.showRepeatedPasswordError,
              'input_type_succes': this.state.password && this.state.password === this.state.repeatedPassword,
            })}
            placeholder='Repeat new password'
            onChange={this.repeatedPasswordChange}
          />
          <Button
            className='change-password__submit-button'
            type='submit'
            inProgress={this.state.inProgress}
          >{this.state.inProgress ? 'Saving' : 'Save'}</Button>
        </form>
      </div>
    );
  }
}
