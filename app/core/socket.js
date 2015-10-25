import io from 'socket.io-client';
import store from '../store';
import {Map} from 'immutable';
import {addChannel, addUserToChannel, typing} from '../actions/channels';
import {addMessage, loadChannelHistory} from '../actions/messages';
import {setUserInfo, joinUser} from 'actions/users';
import {init, initUser, logOut} from '../actions/local';
import {SC} from '../../constants';


const checkNotify = (data, notifyCallback) => {
  if (data.notify) {
    notifyCallback(data.notifyData);
  }
};


export function socketClient(type = null, socketData, notifyCallback) {
  const socket = io();

  if (type === 'SOCKET_INIT') {
    socket.on(SC.ADD_MESSAGE, (data) => {
      checkNotify(data, notifyCallback);
      store.dispatch(addMessage(Map(data)));
    });


    socket.on(SC.ADD_CHANNEL, (data) => {
      checkNotify(data, notifyCallback);
      store.dispatch(addChannel(Map({id: data.id, name: data.name, joined: false})));
    });


    socket.on(SC.JOIN_USER, (data) => {
      checkNotify(data, notifyCallback);
      store.dispatch(joinUser(data));
    });


    socket.on(SC.INIT, (data) => {
      checkNotify(data, notifyCallback);
      store.dispatch(init(data));
    });


    socket.on(SC.SIGN_IN, (data) => {
      checkNotify(data);
      store.dispatch(initUser(data));
    });


    socket.on(SC.JOIN_TO_CHANNEL, (data) => {
      checkNotify(data, notifyCallback);
      store.dispatch(addUserToChannel(data));
    });


    socket.on(SC.NEW_USER_JOINED_TO_CHANNEL, (data) => {
      checkNotify(data, notifyCallback);
    });


    socket.on(SC.CHANGE_USER_INFO, (data) => {
      checkNotify(data, notifyCallback);
      store.dispatch(setUserInfo(data));
    });


    socket.on(SC.SET_CHANNEL_HISTORY, (data) => {
      checkNotify(data, notifyCallback);
      store.dispatch(loadChannelHistory(data));
    });


    socket.on(SC.ADD_DIRECT_CHANNEL, (data) => {
      checkNotify(data, notifyCallback);
      store.dispatch(addChannel(Map({
        id: data.id,
        name: data.name,
        users: data.users,
        isDirect: data.isDirect,
      })));
    });


    socket.on(SC.TYPING, (data) => {
      checkNotify(data, notifyCallback);
      store.dispatch(typing(data));
    });


    socket.on('error', () => {
      store.dispatch(logOut());
    });
  } else if (type) {
    socket.emit(type, socketData);
  }
}
