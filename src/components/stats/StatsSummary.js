import React from 'react';
import d3 from 'd3';

import { USER_PROFILE_URL } from '../../config';

const StatsSummary = ({ statsByUser }) => {
  const contributions = (statsByUser && statsByUser.length) ? (
    statsByUser.map((stats, i) => {
      const { edit, fixed, skip, noterror, user } = stats;

      const profile = `${USER_PROFILE_URL}/${user}`;
      const total = edit + fixed + skip + noterror;

      const numFormat = d3.format(',');

      return (
        <div key={i} className='col12 clearfix'>
          <span className='col7'>
            <a href={profile} target='_blank' className='inline strong pad0y'>{user}</a>
          </span>
          <span className='col1 pad0y text-right'>{numFormat(edit)}</span>
          <span className='col1 pad0y text-right'>{numFormat(fixed)}</span>
          <span className='col1 pad0y text-right'>{numFormat(skip)}</span>
          <span className='col1 pad0y text-right'>{numFormat(noterror)}</span>
          <span className='col1 pad0y text-right'>{numFormat(total)}</span>
        </div>
      );
    })
  ) : (
    <strong className='quiet pad0y block'>No data</strong>
  );

  return (
    <div className='contributions'>
      <div className='col12 clearfix'>
        <h4 className='col7'>Contributors</h4>
        <h4 className='col1 pad0y text-right'>Editing</h4>
        <h4 className='col1 pad0y text-right'>Fixed</h4>
        <h4 className='col1 pad0y text-right'>Skipped</h4>
        <h4 className='col1 pad0y text-right'>Not Error</h4>
        <h4 className='col1 pad0y text-right'>Total</h4>
      </div>
      {contributions}
    </div>
  );
}

export default StatsSummary;
