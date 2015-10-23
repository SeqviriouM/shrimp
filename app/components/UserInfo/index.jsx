import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Immutable, {Map, List} from 'immutable';
import {Link} from 'react-router';
import InfoMessage from 'components/InfoMessage';
import Input from 'components/Input';
import PopUp from 'components/PopUp';
import Tabs from 'components/Tabs';
import Tab from 'components/Tab';
import './styles.scss';


@connect(state => ({
  location: state.router.location.pathname,
  users: state.users,
}))

export default class UserInfo extends React.Component {

  static propTypes = {
    location: PropTypes.string.isRequired,
    users: PropTypes.instanceOf(List).isRequired,
    local: PropTypes.instanceOf(Map).isRequired,
    params: PropTypes.Object,
  }

  constructor(props) {
    super(props);

    this.state = {
      info: {
        type: 'info',
        text: 'Edit your data',
      },
      user: {},
    };
  }


  componentWillMount = () => {
    if (this.props.users.size) {
      const targetUser = this.props.users.find(user => user.get('id') === this.props.params.userId);

      if (targetUser) {
        this.setState({
          user: targetUser,
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.users, this.props.users)) {
      const targetUser = nextProps.users.find(user => user.get('id') === nextProps.params.userId);

      this.setState({
        user: targetUser,
      });
    }
  }


  render() {
    return (
      <div className='settings'>
        <PopUp className='settings__window'>
          <Tabs
            className='settings__tabs'
            currentTabId={1}
          >
            <Tab id={1}>User Info</Tab>
          </Tabs>
          <div className='profile'>
            <form
              className='profile__form'
            >
              <InfoMessage
                className='profile__info-message'
                type={this.state.info.type}
              >{this.state.info.text}</InfoMessage>
              <Input
                className='profile__input'
                value={this.state.user.get('name')}
              />
            </form>
          </div>
        </PopUp>
        <Link to='/'>
          <div className='settings__overlay' />
        </Link>
      </div>
    );
  }
}
