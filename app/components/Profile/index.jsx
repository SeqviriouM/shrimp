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

export default class Profile extends React.Component {

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
        text: 'Edit your data',
      },
      shakeInfo: false,
      email: '',
      name: '',
      country: '',
      showEmailError: false,
      showNameError: false,
      showCountryError: false,
      inProgress: false,
    };
  }


  componentWillMount = () => {
    if (this.props.users.size) {
      const currentUser = this.props.users.find(user => user.get('id') === this.props.local.get('userId'));

      this.setState({
        email: currentUser.get('email'),
        name: currentUser.get('name'),
        country: currentUser.get('country'),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.users, this.props.users)) {
      const currentUser = nextProps.users.find(user => user.get('id') === nextProps.local.get('userId'));

      this.setState({
        email: currentUser.get('email'),
        name: currentUser.get('name'),
        country: currentUser.get('country'),
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

    if (!this.state.country) {
      return this.setState({
        showCountryError: true,
        info: {
          type: 'error',
          text: 'Country is required',
        },
      });
    }


    const changedData = {
      email: this.state.email,
      name: this.state.name,
      country: this.state.country,
    };


    this.setState({
      inProgress: true,
    });
    store.dispatch(changeUserInfo(changedData));
  }

  emailChange = e => {
    this.setState({
      email: e.target.value,
      showEmailError: false,
    });
  }


  nameChange = e => {
    this.setState({
      name: e.target.value,
      showNameError: false,
    });
  }

  countryChange = e => {
    this.setState({
      country: e.target.value,
      showCountryError: false,
    });
  }

  render() {
    return (
      <div className='profile'>
        <form
          className='profile__form'
          onSubmit={this.changeInfo}
        >
          <InfoMessage
            className='profile__info-message'
            type={this.state.info.type}
            shake={this.state.shakeInfo}
          >{this.state.info.text}</InfoMessage>
          <Input
            className={cx('profile__input', {
              'input_type_error': this.state.showEmailError,
            })}
            value={this.state.email}
            name='email'
            placeholder='Email'
            onChange={this.emailChange}
          />
          <Input
            className={cx('profile__input', {
              'input_type_error': this.state.showNameError,
            })}
            value={this.state.name}
            name='name'
            placeholder='Name'
            onChange={this.nameChange}
          />
          <Input
            className={cx('profile__input', {
              'input_type_error': this.state.showCountryError,
            })}
            value={this.state.country}
            name='country'
            placeholder='Country'
            onChange={this.countryChange}
          />
          <Button
            className='profile__submit-button'
            type='submit'
            inProgress={this.state.inProgress}
          >{this.state.inProgress ? 'Saving' : 'Save'}</Button>
        </form>
      </div>
    );
  }
}
