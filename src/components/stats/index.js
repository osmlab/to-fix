import React, { Component } from 'react';
import { connect } from 'react-redux';
import d3 from 'd3';

import TasksSelectors from '../../stores/tasks_selectors';
import StatsActionCreators from '../../stores/stats_action_creators';
import StatsSelectors from '../../stores/stats_selectors';

import StatsHeader from './stats_header';
import StatsGraph from './stats_graph';
import StatsSummary from './stats_summary';

const mapStateToProps = (state) => ({
  currentTaskId: TasksSelectors.getCurrentTaskId(state),
  currentTask: TasksSelectors.getCurrentTask(state),
  taskSummary: TasksSelectors.getTaskSummary(state),
  statsFrom: StatsSelectors.getFromDate(state),
  statsTo: StatsSelectors.getToDate(state),
  statsByUser: StatsSelectors.getByUser(state),
  statsByDate: StatsSelectors.getByDate(state),
});

const mapDispatchToProps = {
  fetchAllStats: StatsActionCreators.fetchAllStats,
};

class Stats extends Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { taskSummary } = this.props;
    const createdAt = taskSummary.date * 1000;

    const dateFormat = d3.time.format('%Y-%m-%d');
    const _from = dateFormat(new Date(createdAt));
    const _to = dateFormat(new Date());

    this.fetchStatsByRange(_from, _to);
  }

  fetchStatsByRange = (_from, _to) => {
    const { fetchAllStats, currentTaskId } = this.props;
    fetchAllStats({ idtask: currentTaskId, from: _from, to: _to });
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
      taskSummary,
    } = this.props;

    return (
      <div className='col12 clearfix scroll-styled'>
        <div className='col10 pad2 dark'>
          <StatsHeader
            task={currentTask}
            statsFrom={statsFrom}
            statsTo={statsTo}
            taskSummary={taskSummary} />
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

Stats = connect(
  mapStateToProps,
  mapDispatchToProps
)(Stats);

export default Stats;
