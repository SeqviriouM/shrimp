import React, {PropTypes} from 'react';
import DropzoneComponent from 'react-dropzone-component';
import cx from 'classnames';
import './styles.scss';
import './dropzone.min.css';

export default class Upload extends React.Component {

  static propTypes = {
    openedArea: PropTypes.bool,
    init: PropTypes.func,
    addFile: PropTypes.func,
    removeFile: PropTypes.func,
  }


  componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif', '.pdf', '.doc', 'html', 'xml', '...'],
    showFiletypeIcon: true,
    postUrl: '/upload',
  }

  eventHandlers = {
    init: this.props.init || null,
    removedfile: this.props.removeFile || null,
    success: this.props.addFile || null,
  }

  djsConfig = {
    addRemoveLinks: true,
    maxFileSize: 10,
    dictFileTooBig: true,
    dictMaxFilesExceeded: true,
    maxFile: 10,
  }

  render() {
    return (
      <div className={cx('upload-area', {
        'upload-area_open': this.props.openedArea,
      })}>
        <DropzoneComponent
          config={this.componentConfig}
          eventHandlers={this.eventHandlers}
          djsConfig={this.djsConfig}
        />
      </div>
    );
  }
}
