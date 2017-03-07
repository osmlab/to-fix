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
        <table>
          <tbody className='fill-darken1 dark'>
            <tr>
              <td className='strong pad1 no-select' style={{width:'100px'}}>
                <strong className='capitalize'>Title</strong>
              </td>
              <td style={{padding:'1px'}} onClick={this.toggleShowMore}>
                <div className='block pad1 space button quiet unround text-left'>
                  {task.value.name}
                  <span className={`${showMoreIcon} fr`} />
                </div>
              </td>
            </tr>
            <tr className={`${showMoreClass}`}>
              <td className='strong pad1 no-select'>
                <strong className='capitalize'>Task ID</strong>
              </td>
              <td className='pad1 space'>
                {task.idtask}
              </td>
            </tr>
            <tr className={`${showMoreClass}`}>
              <td className='strong pad1 no-select'>
                <strong className='capitalize'>Description</strong>
              </td>
              <td className='pad1 space'>
                {task.value.description}
              </td>
            </tr>
            <tr className={`${showMoreClass}`}>
              <td className='strong pad1 no-select'>
                <strong className='capitalize'>Changeset comment</strong>
              </td>
              <td className='pad1 space'>
                {task.value.changesetComment}
              </td>
            </tr>
            <tr className={`${showMoreClass}`}>
              <td className='strong pad1 no-select'>
                <strong className='capitalize'>Updated</strong>
              </td>
              <td className='pad1 space'>
                {updatedDay}
                {' '}
                <span className='quiet'>{updatedTime}</span>
              </td>
            </tr>
            <tr className={`${showMoreClass}`}>
              <td className='strong pad1'>
                <strong className='capitalize'>Status</strong>
              </td>
              <td className='pad1 space'>
                {status}
              </td>
            </tr>
            </tbody>
        </table>
      </div>
    );
  }
}

export default TaskControl;
