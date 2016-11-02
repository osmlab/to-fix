import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import d3 from 'd3';

import { fetchStats } from '../actions';
import {
  getCurrentTask,
  getStatsFrom,
  getStatsTo,
  getStatsData,
  getStatsSummary,
} from '../reducers';

import DashHeading from './workspace/dash_heading';
import DashGraph from './workspace/dash_graph';
import DashSummary from './workspace/dash_summary';

class Stats extends Component {
  componentDidMount() {
    const { statsSummary } = this.props;
    const createdAt = statsSummary.date * 1000;

    const dateFormat = d3.time.format('%Y-%m-%d');
    const _from = dateFormat(new Date(createdAt));
    const _to = dateFormat(new Date());

    this.fetchData(_from, _to);
  }

  fetchData = (_from, _to) => {
    const { fetchStats, currentTaskId } = this.props;
    fetchStats({ idtask: currentTaskId, from: _from, to: _to });
  }

  render() {
    const {
      currentTask,
      statsFrom,
      statsTo,
      statsData,
      statsSummary,
    } = this.props;

    return (
      <div className='col12 clearfix scroll-styled'>
        <div className='col10 pad2 dark'>
          <DashHeading
            task={currentTask}
            statsFrom={statsFrom}
            statsTo={statsTo}
            statsSummary={statsSummary} />
          <DashGraph
            statsData={statsData}
            fetchData={this.fetchData} />
          <DashSummary
            statsData={statsData} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => ({
  currentTaskId: params.task,
  currentTask: getCurrentTask(state, params.task),
  statsFrom: getStatsFrom(state),
  statsTo: getStatsTo(state),
  statsData: getStatsData(state),
  statsSummary: getStatsSummary(state),
});

Stats = withRouter(connect(
  mapStateToProps,
  { fetchStats }
)(Stats));

export default Stats;
