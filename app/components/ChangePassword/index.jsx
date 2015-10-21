import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Immutable, {Map, List} from 'immutable';
import cx from 'classnames';
import store from 'store';
import {changeUserInfo} from 'actions/local';
import InfoMessage from 'components/InfoMessage';
import Input from 'components/Input';
import Button from 'components/Button';
import './styles.scss';


@connect(state => ({
  location: state.router.location.pathname,
  local: state.local,
  users: state.users,
}))

export default class ChangePassword extends React.Component {

  static propTypes = {
    location: PropTypes.string.isRequired,
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
      email: '',
      name: '',
      password: '',
      repeatedPassword: '',
      showPasswordError: false,
      showSecondPasswordError: false,
      showEmailError: false,
      showNameError: false,
      inProgress: false,
    };
  }


  componentWillMount = () => {
    if (this.props.users.size) {
      const currentUser = this.props.users.find(user => user.get('id') === this.props.local.get('userId'));

      this.setState({
        email: currentUser.get('email'),
        name: currentUser.get('name'),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.users, this.props.users)) {
      const currentUser = nextProps.users.find(user => user.get('id') === nextProps.local.get('userId'));

      this.setState({
        email: currentUser.get('email'),
        name: currentUser.get('name'),
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.users.size > 0 && !Immutable.is(nextProps.users, this.props.users)) {
      nextProps.history.pushState(null, '/');
    }

    return true;
  }

  checkEmailExists(email) {
    const userWithSuchEmail = this.props.users.find(item => item.get('email') === email);
    return (!userWithSuchEmail || (userWithSuchEmail.get('id') === this.props.local.get('userId'))) ? false : true;
  }

  changeInfo = (e) => {
    e.preventDefault();

    if (!this.state.email) {
      return this.setState({
        showEmailError: true,
        info: {
          type: 'error',
          text: 'Email is required',
        },
      });
    }

    if (!/\S+@\S+\.\S+/.test(this.state.email)) {
      return this.setState({
        showEmailError: true,
        info: {
          type: 'error',
          text: 'Valid email is required',
        },
      });
    }

    if (this.checkEmailExists(this.state.email)) {
      return this.setState({
        showEmailError: true,
        info: {
          type: 'error',
          text: 'Email already exsisted',
        },
      });
    }

    if (!this.state.name) {
      return this.setState({
        showNameError: true,
        info: {
          type: 'error',
          text: 'Name is required',
        },
      });
    }


    const changedData = {
      email: this.state.email,
      name: this.state.name,
    };


    this.setState({
      inProgress: true,
    });
    store.dispatch(changeUserInfo(changedData));
  }

  oldPasswordChange = e => {
    this.setState({
      oldPassword: e.target.value,
      showOldPasswordError: false,
    });
  }


  passwordChange = e => {
    this.setState({
      name: e.target.value,
      showNameError: false,
    });
  }


  render() {
    return (
      <div className='change-password'>
        <form
          className='change-password__form'
          onSubmit={this.changeInfo}
        >
          <InfoMessage
            className='change-password__info-message'
            type={this.state.info.type}
            shake={this.state.shakeInfo}
          >{this.state.info.text}</InfoMessage>
          <Input
            className={cx('change-password__input', {
              'input_type_error': this.state.showOldPasswordError,
            })}
            name='old-password'
            placeholder='Old password'
            onChange={this.oldPasswordChange}
          />
          <Input
            className={cx('change-password__input', {
              'input_type_error': this.state.showPasswordError,
            })}
            name='password'
            placeholder='New password'
            onChange={this.passwordChange}
          />
          <Input
            className={cx('change-password__input', {
              'input_type_error': this.state.showPasswordError,
            })}
            placeholder='Repeat new password'
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
