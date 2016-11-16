import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

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
  taskExtent: TasksSelectors.getTaskExtent(state),
  statsFrom: StatsSelectors.getFromDate(state),
  statsTo: StatsSelectors.getToDate(state),
  statsByUser: StatsSelectors.getByUser(state),
  statsByDate: StatsSelectors.getByDate(state),
});

const mapDispatchToProps = {
  fetchAllStats: StatsActionCreators.fetchAllStats,
};

class Stats extends Component {
  fetchData() {
    const { taskExtent } = this.props;
    const { fromDate, toDate } = taskExtent;
    this.fetchStatsByRange(fromDate, toDate);
  }

  fetchStatsByRange = (fromDate, toDate) => {
    const { fetchAllStats, currentTaskId } = this.props;
    fetchAllStats({ idtask: currentTaskId, from: fromDate, to: toDate });
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    // Refetch stats when a new task is selected
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
            taskSummary={taskSummary}
            statsFrom={statsFrom}
            statsTo={statsTo} />
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

Stats.propTypes = {
  currentTaskId: PropTypes.string.isRequired,
  currentTask: PropTypes.object.isRequired,
  taskSummary: PropTypes.object.isRequired,
  taskExtent: PropTypes.object.isRequired,
  statsFrom: PropTypes.string.isRequired,
  statsTo: PropTypes.string.isRequired,
  statsByUser: PropTypes.array.isRequired,
  statsByDate: PropTypes.array.isRequired,
  fetchAllStats: PropTypes.func.isRequired,
};

Stats = connect(
  mapStateToProps,
  mapDispatchToProps
)(Stats);

export default Stats;
