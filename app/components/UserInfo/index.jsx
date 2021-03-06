import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Immutable, {List} from 'immutable';
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
    params: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.timers = [];
    this.state = {
      info: {
        type: 'info',
        text: 'Edit your data',
      },
      userName: '',
      userEmail: '',
      userAvatar: '',
      userCountry: '',
      startAnimation: false,
      hoverAnimation: false,
    };
  }


  componentWillMount = () => {
    if (this.props.users.size) {
      const targetUser = this.props.users.find(user => user.get('id') === this.props.params.userId);

      if (targetUser) {
        this.setState({
          userName: targetUser.get('name'),
          userEmail: targetUser.get('email'),
          userAvatar: targetUser.get('avatar'),
          userCountry: targetUser.get('country'),
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
        userName: targetUser.get('name'),
        userEmail: targetUser.get('email'),
        userAvatar: targetUser.get('avatar'),
        userCountry: targetUser.get('country'),
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


  startHoverAnimation = () => {
    this.setState({
      hoverAnimation: true,
    });
  }


  stopHoverAnimation = () => {
    this.setState({
      hoverAnimation: false,
    });
  }

  render() {
    return (
      <div className='user-details'>
        <PopUp className='user-details__window'>
          <Tabs
            className='user-details__tabs'
            currentTabId={1}
          >
            <Tab id={1}>{this.state.userName}</Tab>
          </Tabs>
          <div className='user-info'>
            <form
              className='user-info__form'
              onMouseOver={this.startHoverAnimation}
              onMouseOut={this.stopHoverAnimation}
            >
              <div className='user-info__avatar-area'>
                <Motion
                  defaultStyle={{y: spring(-200)}}
                  style={{y: spring(this.state.startAnimation ? 0 : -400, [140, 12])}}
                >
                {interpolated => <img
                    style={{transform: `translateY(${interpolated.y}px)`}}
                    className='user-info__avatar'
                    src={this.state.userAvatar}
                    width='80'
                    height='80'
                  />
                }
                </Motion>
              </div>
              <div className='user-info__input-area'>
                <Motion
                  defaultStyle={{x: spring(-500)}}
                  style={{x: spring(this.state.hoverAnimation ? 0 : -500, [140, 22])}}
                  >
                  {interpolated => <div
                      className='user-info__description'
                      style={{transform: `translateX(${interpolated.x}px)`}}
                    >
                      <span>Email: </span>
                    </div>
                  }
                </Motion>
                <Motion
                    defaultStyle={{x: spring(-500)}}
                    style={{x: spring(this.state.startAnimation ? 0 : -500, [140, 12])}}
                  >
                  {interpolated => <Input
                      style={{transform: `translateX(${interpolated.x}px)`}}
                      className='user-info__input'
                      value={this.state.userEmail}
                      disabled
                    />
                  }
                </Motion>
              </div>
              <div className='user-info__input-area'>
                <Motion
                  defaultStyle={{x: spring(-500)}}
                  style={{x: spring(this.state.hoverAnimation ? 0 : -500, [140, 22])}}
                  >
                  {interpolated => <div
                      className='user-info__description'
                      style={{transform: `translateX(${interpolated.x}px)`}}
                    >
                      <span>Country: </span>
                    </div>
                  }
                </Motion>
                <Motion
                    defaultStyle={{x: spring(500)}}
                    style={{x: spring(this.state.startAnimation ? 0 : 500, [140, 12])}}
                  >
                  {interpolated => <Input
                      style={{transform: `translateX(${interpolated.x}px)`}}
                      className='user-info__input'
                      value={this.state.userCountry}
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
