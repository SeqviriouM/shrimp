import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Immutable, {Map, List} from 'immutable';
import {Link} from 'react-router';
import {Motion, spring} from 'react-motion';
import Input from 'components/Input';
import PopUp from 'components/PopUp';
import Tabs from 'components/Tabs';
import Tab from 'components/Tab';
import './styles.scss';


@connect(state => ({
  users: state.users,
}))

export default class UserInfo extends React.Component {

  static propTypes = {
    users: PropTypes.instanceOf(List).isRequired,
    local: PropTypes.instanceOf(Map).isRequired,
    params: PropTypes.Object,
  }

  constructor(props) {
    super(props);

    this.timers = [];
    this.state = {
      info: {
        type: 'info',
        text: 'Edit your data',
      },
      user: {},
      startAnimation: false,
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

      this.timers.push(setTimeout(() => {
        this.setState({
          startAnimation: true,
        });
      }, 300));
    }
  }


  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.users, this.props.users)) {
      const targetUser = nextProps.users.find(user => user.get('id') === nextProps.params.userId);

      this.setState({
        user: targetUser,
      });

      this.timers.push(setTimeout(() => {
        this.setState({
          startAnimation: true,
        });
      }, 300));
    }
  }


  componentWillUnmount = () => {
    for (const timer of this.timers) {
      clearTimeout(timer);
    }
  }

  render() {
    return (
      <div className='user-details'>
        <PopUp className='user-details__window'>
          <Tabs
            className='user-details__tabs'
            currentTabId={1}
          >
            <Tab id={1}>{this.state.user.get('name')}</Tab>
          </Tabs>
          <div className='user-info'>
            <form
              className='user-info__form'
            >
              <div className='user-info__avatar-area'>
                <Motion
                  defaultStyle={{y: spring(-200)}}
                  style={{y: spring(this.state.startAnimation ? 0 : -400, [140, 12])}}
                >
                {interpolated => <img
                    style={{transform: `translateY(${interpolated.y}px)`}}
                    className='user-info__avatar'
                    src={this.state.user.get('avatar')}
                    width='80'
                    height='80'
                  />
                }
                </Motion>
              </div>
              <div className='user-info__input-area'>
                <Motion
                    defaultStyle={{x: spring(-500)}}
                    style={{x: spring(this.state.startAnimation ? 0 : -500, [140, 12])}}
                  >
                  {interpolated => <Input
                      style={{transform: `translateX(${interpolated.x}px)`}}
                      className='user-info__input'
                      value={this.state.user.get('email')}
                      disabled
                    />
                  }
                </Motion>
              </div>
            </form>
          </div>
        </PopUp>
        <Link to='/'>
          <div className='user-details__overlay' />
        </Link>
      </div>
    );
  }
}
