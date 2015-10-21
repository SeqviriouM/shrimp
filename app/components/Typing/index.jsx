import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';
import cx from 'classnames';
import './styles.scss';

export default class Typing extends React.Component {
  static propTypes = {
    isTyping: PropTypes.bool.required,
  }

  render() {
    const getContent = (interpolated) => (
      <div>
        <span
          className='typing__dot typing__dot_one'
          style={{transform: `translateY(-${interpolated.y}%)`}}
        />
        <span
          className='typing__dot typing__dot_two'
          style={{transform: `translateY(-${interpolated.y}%)`}}
        />
        <span
          className='typing__dot typing__dot_three'
          style={{transform: `translateY(-${interpolated.y}%)`}}
        />
      </div>
    );


    return (
        <div className={cx('typing', {
          'typing_show': this.props.isTyping,
        })}>
          <Motion
            defaultStyle={{y: spring(-100)}}
            style={{y: spring(this.props.isTyping ? 0 : 100, [100, 14])}}
          >
            {(interpolated) => getContent(interpolated)}
          </Motion>
        </div>
    );
  }
}
