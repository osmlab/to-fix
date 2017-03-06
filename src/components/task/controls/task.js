import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

const containerID = 'mapboxgl-ctrl-task';

class TaskControl {
  onAdd(map) {
    this._map = map;
    this._container = this._createContainer();
    return this._container;
  }

  onRemove() {
    this._map = null;
    ReactDOM.unmountComponentAtNode(this._container);
    this._container.parentNode.removeChild(this._container);
  }

  update(task) {
    ReactDOM.render(
      <TaskComponent task={task} />,
      document.getElementById(containerID)
    );
  }

  _createContainer() {
    const div = document.createElement('div');
    div.className = 'mapboxgl-ctrl';
    div.id = containerID;
    return div;
  }
}

class TaskComponent extends Component {
  state = {
    showMore: false,
  }

  toggleShowMore = () => {
    this.setState({ showMore: !this.state.showMore })
  }

  render() {
    const { task }  = this.props;
    const { showMore } = this.state;

    const dateDisplay = d3.time.format('%B %-d');
    const timeDisplay = d3.time.format('%-I:%-M%p');

    const updatedDay = dateDisplay(new Date(task.value.updated * 1000));
    const updatedTime = timeDisplay(new Date(task.value.updated * 1000));

    const status = (task.isCompleted) ? 'Completed.' : 'Items remaining to be done.';

    const showMoreIcon = showMore ? 'icon caret-up' : 'icon caret-down';
    const showMoreClass = showMore ? '' : 'hidden';

    return (
      <div className='mapboxgl-ctrl-task fill-darken3 dark width40'>
        <div className='rows'>
          <div className='clearfix fill-darken1 dark mobile-cols'>
            <div className='col3 fl strong pad1 fill-darken1 editor-key'>
              <span className='capitalize'>Title</span>
            </div>
            <div className='col9 pad1 fl space truncate'>
              {task.value.name}
              <span onClick={this.toggleShowMore} className={`${showMoreIcon} fr`} />
            </div>
          </div>
          <div className={`clearfix fill-darken1 dark mobile-cols ${showMoreClass}`}>
            <div className='col3 fl strong pad1 fill-darken1 editor-key'>
              <span className='capitalize'>Task ID</span>
            </div>
            <div className='col9 pad1 fl space truncate'>
              {task.idtask}
            </div>
          </div>
          <div className={`clearfix fill-darken1 dark mobile-cols ${showMoreClass}`}>
            <div className='col3 fl strong pad1 fill-darken1 editor-key'>
              <span className='capitalize'>Description</span>
            </div>
            <div className='col9 pad1 fl space truncate'>
              {task.value.description}
            </div>
          </div>
          <div className={`clearfix fill-darken1 dark mobile-cols ${showMoreClass}`}>
            <div className='col3 fl strong pad1 fill-darken1 editor-key'>
              <span className='capitalize'>Changeset comment</span>
            </div>
            <div className='col9 pad1 fl space truncate'>
              {task.value.changesetComment}
            </div>
          </div>
          <div className={`clearfix fill-darken1 dark mobile-cols ${showMoreClass}`}>
            <div className='col3 fl strong pad1 fill-darken1 editor-key'>
              <span className='capitalize'>Updated</span>
            </div>
            <div className='col9 pad1 fl space truncate'>
              {updatedDay}
              {' '}
              <span className='quiet'>{updatedTime}</span>
            </div>
          </div>
          <div className={`clearfix fill-darken1 dark mobile-cols ${showMoreClass}`}>
            <div className='col3 fl strong pad1 fill-darken1 editor-key'>
              <span className='capitalize'>Status</span>
            </div>
            <div className='col9 pad1 fl space truncate'>
              {status}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TaskControl;
