import React, {PropTypes} from 'react';
import Immutable, {List, Map} from 'immutable';
import MessageList from 'components/MessageList';
import MessageComposer from 'components/MessageComposer';
import './styles.scss';


export default class Messages extends React.Component {

  static propTypes = {
    messages: PropTypes.instanceOf(List).isRequired,
    channels: PropTypes.instanceOf(List).isRequired,
    local: PropTypes.instanceOf(Map).isRequired,
    docked: PropTypes.bool.isRequired,
  }


  constructor(props) {
    super(props);
    this.state = {
      listBottom: 0,
    };
  }


  componentDidMount = () => {
    this.baseTextareaHeight = null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      Immutable.is(nextProps.messages, this.props.messages) &&
      Immutable.is(nextProps.local, this.props.local) &&
        nextProps.docked === this.props.docked &&
        nextState.listBottom === this.state.listBottom
    );
  }

  scrollToBottom = () => {
    const list = this.refs.list;
    list.scrollTop = list.scrollHeight;
  }


  changeBottom = (height) => {
    if (this.baseTextareaHeight === null) {
      this.baseTextareaHeight = height;
    }
    this.setState({
      listBottom: height - this.baseTextareaHeight,
    });
    this.scrollToBottom();
  }


  render() {
    const { messages, local, channels } = this.props;
    return (
      <div
        className='messages'
        ref='list'
        style={{bottom: this.state.listBottom}}
      >
        <MessageList
          messages={messages}
          scroll={this.scrollToBottom}
          local={local}
        />
        <MessageComposer
          {...this.props}
          local={local}
          channels={channels}
          changeBottom={this.changeBottom}
        />
      </div>
    );
  }
}
