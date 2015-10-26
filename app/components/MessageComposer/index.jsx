import React, {PropTypes} from 'react';
import Immutable, {Map, List} from 'immutable';
import cx from 'classnames';
import debounce from 'lodash.debounce';
import Textarea from 'react-textarea-autosize';
import Upload from 'components/Upload';
import Typing from 'components/Typing';
import {MOD} from '../../../constants';
import './styles.scss';

export default class MessageComposer extends React.Component {

  static propTypes = {
    local: PropTypes.instanceOf(Map).isRequired,
    channels: PropTypes.instanceOf(List).isRequired,
    newMessage: PropTypes.func.isRequired,
    changeBottom: PropTypes.func.isRequired,
    sendTypingAction: PropTypes.func,
  }


  constructor(props) {
    super(props);
    this.messageMaxLength = 220;
    this.state = {
      text: '',
      files: new Map(),
      openedArea: false,
      typing: false,
      dropzone: {},
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      Immutable.is(nextProps.local, this.props.local) &&
      Immutable.is(nextProps.channels, this.props.channels) &&
      Immutable.is(nextState.text, this.state.text) &&
      Immutable.is(nextState.openedArea, this.state.openedArea) &&
      Immutable.is(nextState.dropzone, this.state.dropzone)
    );
  }

  stopTyping = debounce(() => {
    this.setState({
      typing: false,
    });
    this.props.sendTypingAction({
      channelId: this.props.local.get('currentChannelId'),
      typingAction: false,
    });
  }, MOD.TYPING_TIME);


  startTyping = () => {
    if (!this.state.typing) {
      this.setState({
        typing: true,
      });
      this.props.sendTypingAction({
        channelId: this.props.local.get('currentChannelId'),
        typingAction: true,
      });
    }
  }


  textChange = (e) => {
    this.startTyping();
    this.stopTyping();


    if (e.target.value.length === this.messageMaxLength) {
      this.setState({
        text: e.target.value,
      });
    } else {
      this.setState({
        text: e.target.value,
      });
    }
  }


  sendMessage = () => {
    const text = this.state.text.trim();
    if (text || this.state.files.size > 0) {
      this.props.newMessage({
        channelId: this.props.local.get('currentChannelId'),
        senderId: this.props.local.get('userId'),
        text: this.state.text,
        files: this.state.files.toList().toJS(),
      });
      this.setState({
        text: '',
        openedArea: false,
      });
    }
  }


  textKeyPress = (e) => {
    if (e.which === 13 && !e.shiftKey) {
      this.sendMessage();
      e.preventDefault();
    }
  }

  openUploadArea = () => {
    this.setState({
      openedArea: !this.state.openedArea,
    });
  }


  initFile = (dropzone) => {
    this.setState({
      dropzone,
    });
  }

  addFile = (file, response) => {
    this.setState({
      files: this.state.files.set(file.name, {
        _id: response.id,
        filePath: response.filePath,
        fileType: file.type.split('/').pop(),
        originalName: file.name,
      }),
    });
  }


  removeFile = (file, removeFromServer = true) => {
    if (file.status === 'success' && removeFromServer) {
      fetch('/remove-file', {
        method: 'delete',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fileName: file.name,
          filePath: this.state.files.get(file.name).filePath,
        }),
      }).then((res) => {
        if (res.status === 200) {
          res.json().then(data => {
            this.setState({
              files: this.state.files.delete(data.fileName),
            });
          });
        } else {
          return;
        }
      });
    }
  }

  render() {
    const {changeBottom, channels} = this.props;
    const currentChannel = channels.find(item => item.get('id') === this.props.local.get('currentChannelId'));
    const isTyping = currentChannel ? currentChannel.get('typing') : false;

    const leftSymbols = this.messageMaxLength - this.state.text.length;

    return (
      <div className='composer'>
        <Typing isTyping={isTyping} />
        <button
          onClick={this.openUploadArea}
          className={cx('composer__open-upload-area', {
            'composer__open-upload-area_open': this.state.openedArea,
          })}
        ></button>
        <div className='composer__sender'>
          <Textarea
            value={this.state.text}
            onKeyPress={this.textKeyPress}
            onChange={this.textChange}
            onHeightChange={changeBottom}
            minRows={1}
            maxRows={5}
            maxLength={this.messageMaxLength}
            className='composer__textarea'
          />
          <div
            className={cx('composer__info', {
              'composer__info_error': leftSymbols <= 0,
            })}
          >
          {leftSymbols}
          </div>
          <button
            type='button'
            onClick={this.sendMessage}
            className='composer__send-button'
          >Send
          </button>
        </div>
        <Upload
          init={this.initFile}
          openedArea={this.state.openedArea}
          addFile={this.addFile}
          removeFile={this.removeFile}
        />
      </div>

    );
  }
}
