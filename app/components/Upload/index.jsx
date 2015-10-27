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
    iconFiletypes: ['.jpg', '.png', '.gif', '.pdf', '.doc', '.docx'],
    showFiletypeIcon: true,
    postUrl: '/upload',
  }

  eventHandlers = {
    // This one receives the dropzone object as the first parameter
    // and can be used to additional work with the dropzone.js
    // object
    init: this.props.init || null,
    // All of these receive the event as first parameter:
    drop: null,
    dragstart: null,
    dragend: null,
    dragenter: null,
    dragover: null,
    dragleave: null,
    // All of these receive the file as first parameter:
    addedfile: null,
    removedfile: this.props.removeFile || null,
    thumbnail: null,
    error: null,
    processing: null,
    uploadprogress: null,
    sending: null,
    success: this.props.addFile || null,
    complete: null,
    canceled: null,
    maxfilesreached: null,
    maxfilesexceeded: null,
    // All of these receive a list of files as first parameter
    // and are only called if the uploadMultiple option
    // in djsConfig is true:
    processingmultiple: null,
    sendingmultiple: null,
    successmultiple: null,
    completemultiple: null,
    canceledmultiple: null,
    // Special Events
    totaluploadprogress: null,
    reset: null,
    queuecompleted: null,
  }

  djsConfig = {
    addRemoveLinks: true,
    maxFileSize: 10,
    dictFileTooBig: true,
    dictMaxFilesExceeded: true,
    maxFile: 10,
  };


  render() {
    return (
      <div className={cx('upload-area', {
        'upload-area_open': this.props.openedArea,
      })}>
        <DropzoneComponent
          config={this.componentConfig}
          eventHandlers={this.eventHandlers}
          djsConfig={this.djsConfig} />
      </div>
    );
  }
}
