import React, { Component } from 'react';
import { withRouter } from 'react-router';
import d3 from 'd3';

import { USER_PROFILE_URL } from '../../config';

class DashSummary extends Component {
  render() {
    return <p>Dash summary</p>;
  }
}

export default DashSummary;

// const DashSummary = React.createClass({
//   mixins: [
//     Reflux.connect(StatsStore, 'stats'),
//     Reflux.listenTo(actions.graphUpdated, 'graphUpdated')
//   ],
//
//   graphUpdated: function(dates, query) {
//     var task = this.props.params.task;
//     actions.statSummaries(task, query);
//   },
//
//   render: function() {
//     var numFormat = d3.format(',');
//     var summaries = this.state.stats.summaries;
//     var contributions = '';
//
//     if (summaries && summaries.length) {
//       contributions = this.state.stats.summaries.map(function(sum, i) {
//           var profile = config.userProfileURL + sum.user;
//           var edit = (sum.edit) ? numFormat(sum.edit) : 0;
//           var fix = (sum.fix) ? numFormat(sum.fix) : 0;
//           var skip = (sum.skip) ? numFormat(sum.skip) : 0;
//           var noterror = (sum.noterror) ? numFormat(sum.noterror) : 0;
//           var total = (sum.total) ? numFormat(sum.total) : 0;
//
//           return (
//             <div key={i} className='col12 clearfix'>
//               <span className='col7'>
//                 <a href={profile} target='_blank' className='inline strong pad0y'>{sum.user}</a>
//               </span>
//               <span className='col1 pad0y text-right'>{edit}</span>
//               <span className='col1 pad0y text-right'>{fix}</span>
//               <span className='col1 pad0y text-right'>{skip}</span>
//               <span className='col1 pad0y text-right'>{noterror}</span>
//               <span className='col1 pad0y text-right'>{total}</span>
//             </div>
//           );
//       });
//     } else {
//       contributions = (
//         <strong className='quiet pad0y block'>No data</strong>
//       );
//     }
//
//     return (
//       <div className='contributions'>
//         <div className='col12 clearfix'>
//           <h4 className='col7'>Contributors</h4>
//           <h4 className='col1 pad0y text-right'>Edited</h4>
//           <h4 className='col1 pad0y text-right'>Fixed</h4>
//           <h4 className='col1 pad0y text-right'>Skipped</h4>
//           <h4 className='col1 pad0y text-right'>Not error</h4>
//           <h4 className='col1 pad0y text-right'>Total</h4>
//         </div>
//         {contributions}
//       </div>
//     );
//   }
// });
//
// export default withRouter(DashSummary);
