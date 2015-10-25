import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Immutable, {Map, List} from 'immutable';
import store from 'store';
import {Link} from 'react-router';
import {changeUserInfo} from 'actions/local';
import PopUp from 'components/PopUp';
import Tabs from 'components/Tabs';
import Tab from 'components/Tab';
import './styles.scss';


@connect(state => ({
  location: state.router.location.pathname,
  local: state.local,
  users: state.users,
}))

export default class Settings extends React.Component {

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


  render() {
    return (
      <div className='settings'>
        <PopUp className='settings__window'>
          <Tabs
            className='settings__tabs'
            currentTabId={this.state.currentTabId}
            changeTab={this.changeTab}
          >
            <Tab id={1} link='/settings/profile'>Settings</Tab>
            <Tab id={2} link='/settings/changepass'>Change password</Tab>
          </Tabs>
          {this.props.children}
        </PopUp>
        <Link to='/'>
          <div className='settings__overlay' />
        </Link>
      </div>
    );
  }
}
