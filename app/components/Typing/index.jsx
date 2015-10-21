import React, {PropTypes} from 'react';
import {StaggeredMotion, spring} from 'react-motion';
import cx from 'classnames';
import './styles.scss';

export default class Typing extends React.Component {
  static propTypes = {
    isTyping: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    motionConfig: PropTypes.array,
  }

  static defaultProps = {
    isTyping: false,
    style: {},
    motionConfig: [140, 12],

  }

  render() {
    const getContent = (interpolated) => (
      <div>
        {interpolated.map((style, i) =>
          <span className={`typing__dot typing__dot_${i}`} key={i} style={{transform: `translateY(${style.y}px)`}} />
          )}
      </div>
    );

    const getStyles = (prevStyles) => (
      prevStyles.map((_, index) => {
        return (index === 0)
          ? {y: spring(this.props.isTyping ? 0 : 100, this.props.motionConfig)}
          : {y: spring(prevStyles[index - 1].y, this.props.motionConfig)};
      })
    );

    return (
        <div className={cx('typing',
          this.props.className, {
            'typing_show': this.props.isTyping,
          }
        )}>
          <StaggeredMotion
            defaultStyles={[{y: spring(100)}, {y: spring(100)}, {y: spring(100)}]}
            styles={getStyles}>
            {interpolated => getContent(interpolated)}
          </StaggeredMotion>
        </div>
    );
  }
}
