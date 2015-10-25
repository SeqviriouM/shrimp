import React, {PropTypes} from 'react';
import {List, Map} from 'immutable';
import {connect} from 'react-redux';
import cookies from 'browser-cookies';
import Sidebar from 'react-sidebar';
import NotificationSystem from 'react-notification-system';
import store from 'store';
import {socketClient} from 'core/socket';
import Messages from 'components/Messages';
import Header from 'components/Header';
import Threads from 'components/Threads';
import 'styles/main.scss';
import {bindActionCreators} from 'redux';
import * as actionsChannels from 'actions/channels';
import * as actionsMessages from 'actions/messages';
import * as actionsLocal from 'actions/local';
import {messageFilterSelector} from 'selectors/messagesSelector';
import {contactsSelector} from 'selectors/contactsSelector';
import DocumentTitle from 'react-document-title';
import {localSelector} from 'selectors/localSelector';
import {indirectChannelsSelector} from 'selectors/channelsSelector';
import {directChannelsSelector} from 'selectors/directChannelsSelector';

@connect(state => ({
  messages: messageFilterSelector(state),
  channels: state.channels,
  users: state.users,
  local: localSelector(state),
  contacts: contactsSelector(state),
  indirectChannels: indirectChannelsSelector(state),
  directChannels: directChannelsSelector(state),
}))
export default class Application extends React.Component {
  static propTypes = {
    messages: PropTypes.instanceOf(List).isRequired,
    channels: PropTypes.instanceOf(List).isRequired,
    users: PropTypes.instanceOf(List).isRequired,
    contacts: PropTypes.instanceOf(List).isRequired,
    local: PropTypes.instanceOf(Map).isRequired,
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.node,
    indirectChannels: PropTypes.instanceOf(List).isRequired,
    directChannels: PropTypes.instanceOf(List).isRequired,
  }


  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false,
      sidebarDocked: true,
    };
  }


  componentWillMount = () => {
    const cookieSessionId = cookies.get('sessionId');
    if (!cookieSessionId) {
      store.history.pushState(null, '/login');
    } else {
      socketClient('SOCKET_INIT', null, this._addNotification);
      store.dispatch(actionsLocal.getInitData());
    }

    const mql = window.matchMedia('(min-width: 800px)');
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, sidebarDocked: mql.matches, sidebarOpen: mql.matches});
  }


  componentDidMount = () => {
    this._notificationSystem = this.refs.notificationSystem;
  }


  componentWillUnmount = () => {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }


  onSetSidebarOpen = (open) => {
    this.setState({sidebarOpen: open});
  }


  mediaQueryChanged = () => {
    this.setState({sidebarDocked: this.state.mql.matches, sidebarOpen: this.state.mql.matches});
  }

  _addNotification = (notify) => {
    if (notify) {
      this._notificationSystem.addNotification({
        message: 'Notification message',
        level: 'success',
      });
    }
  }


  render() {
    const {messages, channels, local, dispatch, contacts, indirectChannels, directChannels} = this.props;
    const actionsCombine = Object.assign(actionsMessages, actionsLocal, actionsChannels);
    const actions = bindActionCreators(actionsCombine, dispatch);
    const threads = (
      <Threads
        channels={channels}
        contacts={contacts}
        local={local}
        indirectChannels={indirectChannels}
        directChannels={directChannels}
        {...actions}
      />
    );

    return (
      <DocumentTitle title='Chat' >
        <div className='chat-page'>
          <NotificationSystem ref='notificationSystem' />
          {this.props.children}
          <Header
            setOpen={this.onSetSidebarOpen}
            open={this.state.sidebarOpen}
            docked={this.state.sidebarDocked}
            local={local}
            {...actions}
          />
          <Sidebar
            sidebar={threads}
            open={this.state.sidebarOpen}
            onSetOpen={this.onSetSidebarOpen}
            docked={this.state.sidebarDocked}
          >
            <Messages
              docked={this.state.sidebarDocked}
              messages={messages}
              channels={channels}
              local={local}
              {...actions}
            />
          </Sidebar>
        </div>
      </DocumentTitle>
    );
  }
}
