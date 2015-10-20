import React, {PropTypes} from 'react';
import Immutable, {Map, List} from 'immutable';
import cx from 'classnames';
import debounce from 'lodash.debounce';
import Textarea from 'react-textarea-autosize';
import Upload from 'components/Upload';
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
      files: {},
      openedArea: false,
      typing: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      Immutable.is(nextProps.local, this.props.local) &&
      Immutable.is(nextProps.channels, this.props.channels) &&
      Immutable.is(nextState.text, this.state.text) &&
      Immutable.is(nextState.openedArea, this.state.openedArea)
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
  }, 1000);


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
    if (text) {
      this.props.newMessage({
        channelId: this.props.local.get('currentChannelId'),
        senderId: this.props.local.get('userId'),
        text: this.state.text,
      });
      this.setState({
        text: '',
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

  addFile = (file, response) => {
    this.state.files[file.name] = response.path;
    this.setState({
      files: this.state.files,
    });
  }


  removeFile = (file) => {
    if (file.status === 'success') {
      fetch('/remove-file', {
        method: 'delete',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          filePath: this.state.files[file.name],
        }),
      });
    }
  }

  render() {
    const {changeBottom, channels} = this.props;
    const currentChannel = channels.find(item => item.get('id') === this.props.local.get('currentChannelId'));
    const typingAction = currentChannel.get('typing');

    const leftSymbols = this.messageMaxLength - this.state.text.length;

    return (
      <div className='composer'>
        <div>
          {typingAction}
        </div>
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
        <Upload openedArea={this.state.openedArea} addFile={this.addFile} removeFile={this.removeFile}/>
      </div>

    );
  }
}
