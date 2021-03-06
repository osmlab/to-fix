import React, { PropTypes } from 'react';
import d3 from 'd3';

const ShowTask = ({ task, canEdit, onEdit }) => {
  const dateDisplay = d3.time.format('%B %-d');
  const timeDisplay = d3.time.format('%-I:%-M%p');

  const updatedDay = dateDisplay(new Date(task.value.updated * 1000));
  const updatedTime = timeDisplay(new Date(task.value.updated * 1000));

  const status = (task.isCompleted) ? 'Completed.' : 'Items remaining to be done.';

  const editButtonClass = canEdit ? '' : 'disabled';

  return (
    <div className='rows pad2'>
      <div className='clearfix fill-darken1 dark mobile-cols'>
        <div className='col3 fl strong pad1 fill-darken1 editor-key'>
          <span className='capitalize'>Title</span>
        </div>
        <div className='col9 pad1 fl space'>
          {task.value.name}
        </div>
      </div>
      <div className='clearfix fill-darken1 dark mobile-cols'>
        <div className='col3 fl strong pad1 fill-darken1 editor-key'>
          <span className='capitalize'>Task ID</span>
        </div>
        <div className='col9 pad1 fl space'>
          {task.idtask}
        </div>
      </div>
      <div className='clearfix fill-darken1 dark mobile-cols'>
        <div className='col3 fl strong pad1 fill-darken1 editor-key'>
          <span className='capitalize'>Description</span>
        </div>
        <div className='col9 pad1 fl space'>
          {task.value.description}
        </div>
      </div>
      <div className='clearfix fill-darken1 dark mobile-cols'>
        <div className='col3 fl strong pad1 fill-darken1 editor-key'>
          <span className='capitalize'>Changeset comment</span>
        </div>
        <div className='col9 pad1 fl space'>
          {task.value.changesetComment}
        </div>
      </div>
      <div className='clearfix fill-darken1 dark mobile-cols'>
        <div className='col3 fl strong pad1 fill-darken1 editor-key'>
          <span className='capitalize'>Updated</span>
        </div>
        <div className='col9 pad1 fl space'>
          {updatedDay}
          {' '}
          <span className='quiet'>{updatedTime}</span>
        </div>
      </div>
      <div className='clearfix fill-darken1 dark mobile-cols'>
        <div className='col3 fl strong pad1 fill-darken1 editor-key'>
          <span className='capitalize'>Status</span>
        </div>
        <div className='col9 pad1 fl space'>
          {status}
        </div>
      </div>
      <div className='pad4y space-top1'>
        <button className={`col3 button ${editButtonClass}`} onClick={(e) => { if (canEdit) {onEdit(e)}}}>Edit task</button>
      </div>
    </div>
  );
}

ShowTask.propTypes = {
  task: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ShowTask;
