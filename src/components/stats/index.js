import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import d3 from 'd3';

import { fetchStats } from '../../actions';
import {
  getCurrentTask,
  getStatsFrom,
  getStatsTo,
  getStatsByUser,
  getStatsByDate,
  getTaskSummary,
} from '../../reducers';

import StatsHeader from './stats_header';
import StatsGraph from './stats_graph';
import StatsSummary from './stats_summary';

class Stats extends Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { statsSummary } = this.props;
    const createdAt = statsSummary.date * 1000;

    const dateFormat = d3.time.format('%Y-%m-%d');
    const _from = dateFormat(new Date(createdAt));
    const _to = dateFormat(new Date());

    this.fetchStatsByRange(_from, _to);
  }

  fetchStatsByRange = (_from, _to) => {
    const { fetchStats, currentTaskId } = this.props;
    fetchStats({ idtask: currentTaskId, from: _from, to: _to });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentTaskId !== this.props.currentTaskId) {
      this.fetchData();
    }
  }

  render() {
    const {
      currentTask,
      statsFrom,
      statsTo,
      statsByUser,
      statsByDate,
      statsSummary,
    } = this.props;

    return (
      <div className='col12 clearfix scroll-styled'>
        <div className='col10 pad2 dark'>
          <StatsHeader
            task={currentTask}
            statsFrom={statsFrom}
            statsTo={statsTo}
            statsSummary={statsSummary} />
          <StatsGraph
            statsFrom={statsFrom}
            statsTo={statsTo}
            statsByDate={statsByDate}
            fetchStatsByRange={this.fetchStatsByRange} />
          <StatsSummary
            statsByUser={statsByUser} />
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
  statsByUser: getStatsByUser(state),
  statsByDate: getStatsByDate(state),
  statsSummary: getTaskSummary(state),
});

Stats = withRouter(connect(
  mapStateToProps,
  { fetchStats }
)(Stats));

export default Stats;
