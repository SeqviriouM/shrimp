import React, {PropTypes, cloneElement} from 'react';
import {pushState} from 'redux-router';
import {connect} from 'react-redux';
import cx from 'classnames';
import './styles.scss';

@connect(state => ({
  location: state.router.location.pathname,
}), {pushState})
export default class Tabs extends React.Component {

  static propTypes = {
    currentTabId: PropTypes.number,
    changeTab: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    location: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentTabId: (path => {
        const tabIndex = this.props.children.findIndex(tabElement => tabElement.props.link === path);
        return tabIndex > -1 ? (tabIndex + 1) : 1;
      }(this.props.location)),
    };
  }


  shouldComponentUpdate(nextProps, nextState) {
    return !(nextState.currentTabId !== this.state.currentTabId &&
      nextProps.currentTabId !== this.props.currentTabId);
  }


  changeTab = (tabId) => {
    this.setState({
      currentTabId: tabId,
    });
  }


  render() {
    const {className, currentTabId, changeTab} = this.props;
    const children = [].concat(this.props.children);
    const tabWidth = `${100 / children.length}%`;

    const getChildren = () => {
      return children.map((tabElement, i) => {
        return cloneElement(tabElement, {
          isCurrent: (currentTabId || this.state.currentTabId) === tabElement.props.id,
          width: tabWidth,
          key: i,
          changeTab: changeTab || this.changeTab,
        });
      });
    };


    return (
      <div className={cx('tabs', className)}>
        {getChildren()}
      </div>
    );
  }
}

