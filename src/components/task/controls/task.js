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
            <div className='col3 fl strong pad1 no-select'>
              <strong className='capitalize'>Title</strong>
            </div>
            <div className='col9 pad1 fl space button quiet unround text-left' onClick={this.toggleShowMore}>
              {task.value.name}
              <span className={`${showMoreIcon} fr`} />
            </div>
          </div>
          <div className={`clearfix fill-darken1 dark mobile-cols ${showMoreClass}`}>
            <div className='col3 fl strong pad1 no-select'>
              <strong className='capitalize'>Task ID</strong>
            </div>
            <div className='col9 pad1 fl space'>
              {task.idtask}
            </div>
          </div>
          <div className={`clearfix fill-darken1 dark mobile-cols ${showMoreClass}`}>
            <div className='col3 fl strong pad1 no-select'>
              <strong className='capitalize'>Description</strong>
            </div>
            <div className='col9 pad1 fl space'>
              {task.value.description}
            </div>
          </div>
          <div className={`clearfix fill-darken1 dark mobile-cols ${showMoreClass}`}>
            <div className='col3 fl strong pad1 no-select'>
              <strong className='capitalize'>Changeset comment</strong>
            </div>
            <div className='col9 pad1 fl space'>
              {task.value.changesetComment}
            </div>
          </div>
          <div className={`clearfix fill-darken1 dark mobile-cols ${showMoreClass}`}>
            <div className='col3 fl strong pad1 no-select'>
              <strong className='capitalize'>Updated</strong>
            </div>
            <div className='col9 pad1 fl space'>
              {updatedDay}
              {' '}
              <span className='quiet'>{updatedTime}</span>
            </div>
          </div>
          <div className={`clearfix fill-darken1 dark mobile-cols ${showMoreClass}`}>
            <div className='col3 fl strong pad1'>
              <strong className='capitalize'>Status</strong>
            </div>
            <div className='col9 pad1 fl space'>
              {status}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TaskControl;
