import React, {PropTypes} from 'react';
import {List} from 'immutable';
import './styles.scss';


export default class AttachedFiles extends React.Component {

  static propTypes = {
    files: PropTypes.instanceOf(List).isRequired,
  }


  constructor(props) {
    super(props);
  }

  imageSet = new Set(['jpeg', 'jpg', 'png', 'gif'])

  renderFileContent = (file) => {
    const fileType = file.get('fileType');
    const asImage = this.imageSet.has(fileType);

    if (asImage) {
      return (
        <div>
          <img src={file.get('filePath')} />
          <div>{file.get('originalName')}</div>
        </div>
      );
    } else {
      return <span>{file.get('originalName')}</span>;
    }
  }

  renderFiles = (files) => {
    return files.map((file, index) => {
      return (
        <div className='attached-files' key={index}>
          <div className='attached-files__type'>
            <img src={`fileIcons/${file.get('fileType')}.png`} width='32' height='32'/>
          </div>
          <div className='attached-files__name'>
            <a href={file.get('filePath')}>
              {this.renderFileContent(file)}
            </a>
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
