import React, { PropTypes } from 'react';
import d3 from 'd3';

const renderProgressBar = (taskSummary) => {
  const { items, fixed, noterror } = taskSummary;

  const total = items;
  const completed = fixed + noterror;
  const progressStyle = {
    width: (completed / total) * 100 + '%'
  };

  return (
    <div className='col4'>
      <h4 className='block space-bottom0'>
        <strong>{d3.format(',')(completed)}</strong> complete
        <span className='quiet'> of {d3.format(',')(total)}</span>
      </h4>
      <div className='progress-bar clip contain fill-darken1 col12'>
        <div style={progressStyle} className='progress fill-darkgreen pin-left block col12'></div>
      </div>
    </div>
  );
};

const StatsHeader = ({ task, taskSummary, statsFrom, statsTo }) => {
  const taskName = task.value.name;
  const extent = `${statsFrom} – ${statsTo}`;
  const progressBar = renderProgressBar(taskSummary);

  return (
    <div className='space-bottom1 col12 clearfix'>
      <div className='col8'>
        <h2>{taskName}</h2>
        <h4 className='space col12 clearfix'>
          {extent}
        </h4>
      </div>
      {progressBar}
    </div>
  );
};

StatsHeader.propTypes = {
  task: PropTypes.object.isRequired,
  taskSummary: PropTypes.object.isRequired,
  statsFrom: PropTypes.string.isRequired,
  statsTo: PropTypes.string.isRequired,
};

export default StatsHeader;
