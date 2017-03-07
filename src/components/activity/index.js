import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import d3 from 'd3';

import { USER_PROFILE_URL } from '../../config';
import TasksSelectors from '../../stores/tasks_selectors';
import ActivitySelectors from '../../stores/activity_selectors';
import ActivityActionCreators from '../../stores/activity_action_creators';

const mapStateToProps = (state) => ({
  currentTaskId: TasksSelectors.getCurrentTaskId(state),
  currentTask: TasksSelectors.getCurrentTask(state),
  currentTaskExtent: TasksSelectors.getCurrentTaskExtent(state),
  activity: ActivitySelectors.getData(state),
});

const mapDispatchToProps = {
  fetchRecentActivity: ActivityActionCreators.fetchRecentActivity,
};

class Activity extends Component {
  state = {
    loadCount: 10,
  }

  resetLoadCount() {
    this.setState({
      loadCount: 10,
    });
  }

  loadMore() {
    this.setState({
      loadCount: this.state.loadCount + 10,
    });
  }

  fetchData() {
    const { currentTaskId, fetchRecentActivity } = this.props;

    fetchRecentActivity({ taskId: currentTaskId })
      .then(() => this.resetLoadCount());
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    // Refetch activity when a new task is selected
    if (prevProps.currentTaskId !== this.props.currentTaskId) {
      this.fetchData();
    }
  }

  renderActivityList() {
    const { activity } = this.props;
    const { loadCount } = this.state;

    if (activity.length === 0) {
      return <strong className='quiet'>No recent activity found.</strong>;
    }

    return activity.slice(0, loadCount).map((data, i) => {
      const { time, key, action, editor, user } = data;

      const permalink = `key-${key}`;
      const profile = `${USER_PROFILE_URL}/${user}`;

      const dateDisplay = d3.time.format('%B %-d');
      const timeDisplay = d3.time.format('%-I:%-M%p');

      const actionDate = dateDisplay(new Date(time * 1000));
      const actionTime = timeDisplay(new Date(time * 1000));

      const mapAction = {
        'edit': 'Edited',
        'fixed': 'Fixed',
        'skip': 'Skipped',
        'noterror': 'Not an error',
      };

      return (
        <div id={permalink} key={i} className='col12 clearfix fill-darken1 dark mobile-cols'>
          <div className='fl strong pad1 fill-darken1 editor-key'>
            <span>{mapAction[action]}</span>
          </div>
          <div className='pad1 fl space'>
            <a href={profile} target='_blank' className='icon account'>
              {user}
            </a>
            <strong className='fill-navy inline micro pad0x uppercase'>{editor}</strong>
          </div>
          <div className='pad1 space fr'>
            <span className='quiet'>{actionDate}</span>
            {actionTime}
          </div>
        </div>
      );
    });
  }

  renderLoadMoreButton() {
    const { activity } = this.props;
    const { loadCount } = this.state;

    if (activity.length === 0) return null;

    if (loadCount >= activity.length) {
      return <button className='button col12 quiet disabled round-bottom'>Loaded 100 recent activities.</button>;
    } else {
      return <button onClick={() => this.loadMore()} className='col12 button round-bottom'>Load more</button>;
    }
  }

  render() {
    const { currentTask, currentTaskExtent } = this.props;
    const { fromDate, toDate } = currentTaskExtent;

    const taskName = currentTask.value.name;
    const activityList = this.renderActivityList();
    const loadMoreButton = this.renderLoadMoreButton();

    return (
      <div className='col12 clearfix scroll-styled'>
        <div className='col10 pad2 dark'>
          <div className='space-bottom1 col12 clearfix'>
            <h2>{taskName}</h2>
            <h4 className='space col12 clearfix'>
              {`Task last updated on ${fromDate}.`}
            </h4>
          </div>
          <div className='rows'>
            {activityList}
            {loadMoreButton}
          </div>
        </div>
      </div>
    );
  }
}

Activity.propTypes = {
  currentTaskId: PropTypes.string.isRequired,
  currentTask: PropTypes.object.isRequired,
  currentTaskExtent: PropTypes.object.isRequired,
  activity: PropTypes.array.isRequired,
  fetchRecentActivity: PropTypes.func.isRequired,
};

Activity = connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity);

export default Activity;
