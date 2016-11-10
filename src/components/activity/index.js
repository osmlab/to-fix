import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import d3 from 'd3';

import { USER_PROFILE_URL } from '../../config';
import { fetchActivity } from '../../actions';
import { getCurrentTask, getActivityData, getTaskSummary } from '../../reducers';

class Activity extends Component {
  state = {
    loadCount: 5,
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { taskSummary } = this.props;
    const createdAt = taskSummary.date * 1000;

    const dateFormat = d3.time.format('%Y-%m-%d');
    const _from = dateFormat(new Date(createdAt));
    const _to = dateFormat(new Date());

    this.fetchActivityByRange(_from, _to);
    this.setState({ loadCount: 5 });
  }

  fetchActivityByRange = (_from, _to) => {
    const { currentTaskId, fetchActivity } = this.props;
    fetchActivity({ idtask: currentTaskId, from: _from, to: _to });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentTaskId !== this.props.currentTaskId) {
      this.fetchData();
    }
  }

  loadMore = () => {
    this.setState({
      loadCount: this.state.loadCount + 5,
    });
  }

  renderActivityList() {
    const { activity } = this.props;
    const { loadCount } = this.state;

    if (activity.length) {
      return activity.slice(0, loadCount).map((data, i) => {
        const { time, key, action, editor, user } = data;

        const permalink = `key-${key}`;
        const profile = `${USER_PROFILE_URL}/${user}`;

        const dateDisplay = d3.time.format('%B %-d');
        const timeDisplay = d3.time.format('%-I:%-M%p');

        const actionDay = dateDisplay(new Date(time * 1000));
        const actionTime = timeDisplay(new Date(time * 1000));

        return (
          <div id={permalink} key={i} className='col12 clearfix fill-darken1 dark mobile-cols'>
            <div className='fl strong pad1 fill-darken1 editor-key'>
              <span className='capitalize'>{action}</span>
            </div>
            <div className='pad1 fl space'>
              <a href={profile} target='_blank' className='icon account'>
                {user}
              </a>
              <strong className='fill-navy inline micro pad0x uppercase'>{editor}</strong>
            </div>
            <div className='pad1 space fr'>
              <span className='quiet'>{actionDay}</span>
              {actionTime}
            </div>
          </div>
        );
      });
    } else {
      return <strong className='quiet'>No recent activity found.</strong>;
    }
  }

  renderLoadMoreButton() {
    const { activity } = this.props;
    const { loadCount } = this.state;

    if (activity.length) {
      if (loadCount >= activity.length) {
        return <button className='button col12 quiet disabled round-bottom'>Activity loaded</button>;
      } else {
        return <button onClick={this.loadMore} className='col12 button round-bottom'>Load more</button>;
      }
    }
  }

  render() {
    const { currentTask, activity } = this.props;

    if (!activity || !currentTask) return null;

    return (
      <div className='col12 clearfix scroll-styled'>
        <div className='col10 pad2 dark'>
          <div className='space-bottom1 col12 clearfix'>
            <h4>{currentTask.value.name}</h4>
          </div>
          <div className='rows'>
            {this.renderActivityList()}
            {this.renderLoadMoreButton()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { params }) => ({
  currentTaskId: params.task,
  currentTask: getCurrentTask(state, params.task),
  taskSummary: getTaskSummary(state),
  activity: getActivityData(state),
});

Activity = withRouter(connect(
  mapStateToProps,
  { fetchActivity }
)(Activity));

export default Activity;
