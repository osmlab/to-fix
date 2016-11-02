import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import d3 from 'd3';

import { fetchStats } from '../actions';
import { getCurrentTask, getStatsData } from '../reducers';

// import DashGraph from './workspace/dash_graph';
// import DashHeading from './workspace/dash_heading';
// import DashSummary from './workspace/dash_summary';

class Stats extends Component {
  componentDidMount() {
    const { router } = this.props;
    window.router = router;

    const { currentTask } = this.props;
    const createdAt = currentTask.value.stats[0].date * 1000;

    const dateFormat = d3.time.format('%Y-%m-%d');
    const _from = dateFormat(new Date(createdAt));
    const _to = dateFormat(new Date());

    this.fetchData(_from, _to);
  }

  fetchData(_from, _to) {
    const { fetchStats, currentTaskId } = this.props;
    fetchStats({ idtask: currentTaskId, from: _from, to: _to });
  }

  render() {
    return (
      <div className='col12 clearfix scroll-styled'>
        <div className='col10 pad2 dark'>
          Stats
        </div>
      </div>
    );
  }
}

// <DashHeading task={this.props.currentTask} />
// <DashGraph data={this.props.stats} />
// <DashSummary />

const mapStateToProps = (state, router) => ({
  currentTaskId: router.params.task,
  currentTask: getCurrentTask(state, router.params.task),
  stats: getStatsData(state),
});

Stats = withRouter(connect(
  mapStateToProps,
  { fetchStats }
)(Stats));

export default Stats;
