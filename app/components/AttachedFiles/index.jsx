import React, {PropTypes} from 'react';
import {List} from 'immutable';
import './styles.scss';


export default class AttachedFiles extends React.Component {

  static propTypes = {
    files: PropTypes.instanceOf(List).isRequired,
  }


  constructor(props) {
    super(props);
    this.state = {
      date: null,
    };
  }


  renderFiles = (files) => {
    return files.map((file, index) => {
      return (
        <div className='attached-files'>
          <div className='attached-files__type'>
            <img src={`fileIcons/${file.get('fileType')}.png`} width='32' height='32'/>
          </div>
          <div className='attached-files__name'>
            <a key={index} href={file.get('filePath')}>{file.get('originalName')}</a>
          </div>
        </div>
      );
    });
  }


  render() {
    const { files } = this.props;

    return (
      <div>
        {this.renderFiles(files)}
      </div>
    );
  }
}
