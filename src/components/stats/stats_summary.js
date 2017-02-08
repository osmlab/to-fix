import React, { PropTypes } from 'react';
import d3 from 'd3';

import { USER_PROFILE_URL } from '../../config';

const renderContributions = (statsByUser) => {
  if (statsByUser.length === 0) {
    return <strong className='quiet pad0y block'>No data</strong>;
  }

  return statsByUser.map((stats, i) => {
    const { fixed, skip, noterror, user } = stats;

    const profile = `${USER_PROFILE_URL}/${user}`;
    const numFormat = d3.format(',');

    const completed = fixed + noterror;

    return (
      <div key={i} className='col12 clearfix'>
        <span className='col4'>
          <a href={profile} target='_blank' className='inline strong pad0y'>{user}</a>
        </span>
        <span className='col2 pad0y text-right'>{numFormat(fixed)}</span>
        <span className='col2 pad0y text-right quiet'>{numFormat(skip)}</span>
        <span className='col2 pad0y text-right'>{numFormat(noterror)}</span>
        <span className='col2 pad0y text-right'>{numFormat(completed)}</span>
      </div>
    );
  });
};

const StatsSummary = ({ statsByUser }) => {
  const contributions = renderContributions(statsByUser);

  return (
    <div className='contributions'>
      <div className='col12 clearfix'>
        <h4 className='col4 strong'>Contributors</h4>
        <h4 className='col2 pad0y text-right strong'>Fixed</h4>
        <h4 className='col2 pad0y text-right strong'>Skipped</h4>
        <h4 className='col2 pad0y text-right strong'>Not Error</h4>
        <h4 className='col2 pad0y text-right strong'>Completed</h4>
      </div>
      {contributions}
    </div>
  );
}

StatsSummary.propTypes = {
  statsByUser: PropTypes.array.isRequired,
};

export default StatsSummary;
