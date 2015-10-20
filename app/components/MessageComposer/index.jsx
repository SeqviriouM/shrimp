import React, {PropTypes} from 'react';
import Immutable, {Map} from 'immutable';
import cx from 'classnames';
import Textarea from 'react-textarea-autosize';
import Upload from 'components/Upload';
import './styles.scss';

export default class MessageComposer extends React.Component {

  static propTypes = {
    local: PropTypes.instanceOf(Map).isRequired,
    newMessage: PropTypes.func.isRequired,
    changeBottom: PropTypes.func.isRequired,
  }


  constructor(props) {
    super(props);
    this.messageMaxLength = 220;
    this.state = {
      text: '',
      files: {},
      openArea: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      Immutable.is(nextProps.local, this.props.local) &&
      Immutable.is(nextState.text, this.state.text) &&
       Immutable.is(nextState.openArea, this.state.openArea)
    );
  }

  textChange = (e) => {
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
    debugger;
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
      openArea: !this.state.openArea,
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
    const {changeBottom} = this.props;
    const leftSymbols = this.messageMaxLength - this.state.text.length;

    return (
      <div className='composer'>
        <button
          onClick={this.openUploadArea}
          className='add-channel-button'
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
        <Upload openArea={this.state.openArea} addFile={this.addFile} removeFile={this.removeFile}/>
      </div>

    );
  }
}
