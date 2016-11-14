import React from 'react';
import d3 from 'd3';

const StatsHeader = ({ task, statsFrom, statsTo, taskSummary }) => {
  const taskTitle = task.value.name;

  const selectedRange = (statsFrom && statsTo) ? `${statsFrom} – ${statsTo}` : null;

  const { items, fixed, noterror } = taskSummary;

  const total = items;
  const completed = fixed + noterror;
  const progressStyle = {
    width: (completed / total) * 100 + '%'
  };

  const progressBar = (
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

  return (
    <div className='space-bottom1 col12 clearfix'>
      <div className='col8'>
        <h2>{taskTitle}</h2>
        <h4 className='space col12 clearfix'>
          {selectedRange}
        </h4>
      </div>
      {progressBar}
    </div>
  );
};

export default StatsHeader;
