import React, { Component } from 'react';
import { withRouter } from 'react-router';
import update from 'react-addons-update';
import d3 from 'd3';


class DashHeading extends Component {
  state = {
    extent: null,
    permalink: null,
    query: {},
  }

  graphUpdated = (dates, query) => {
    // Revise the date title
    if (dates[0] === dates[1]) {
      this.setState({ extent: [dates[1]] });
    } else {
      this.setState({ extent: [dates[0], dates[1]] });
    }

    this.updatePermalink({
      from: query[0],
      to: query[1]
    });
  }

  updatePermalink = (obj) => {
    // Add query params to the URL
    const { router, params } = this.props;
    const query = update(this.state.query, {$merge: obj});
    const permalink = router.createHref('stats', {task: params.task}, query);
    this.setState({
      query,
      permalink,
    });
  }

  render() {
    const { task } = this.props;

    if (!task) return null;

    const taskTitle = task.value.name;

    const stats = task.value.stats;
    const statsSummary = stats[stats.length - 1];
    const { items, edit, fixed, skip, noterror } = statsSummary;

    const total = items;
    const completed = edit + fixed + skip + noterror;
    const progressStyle = {
      width: (completed / total) * 100 + '%'
    };

    const totalSummary = (
      <div className='col4'>
        <h4 className='block space-bottom0'>
          <strong>{d3.format(',')(completed)}</strong> complete
          <span className='quiet'> of {d3.format(',')(total)}</span>
        </h4>
        <div className='progress-bar clip contain fill-darken1 col12'>
          <div ref='progress' style={progressStyle} className='progress fill-darkgreen pin-left block col12'></div>
        </div>
      </div>
    );

    const { extent, permalink } = this.state;

    const extentRange = (extent) ?
      (extent.length > 1) ?
        extent[0] + ' – ' + extent[1] :
        extent[0]
      : '';

    const permalinkAnchor = (
      <span className='fill-darken1 dot pad0 fl'>
        <a href={permalink} className='icon link' title='Link to these dates'></a>
      </span>
    );

    return (
      <div className='space-bottom1 col12 clearfix'>
        <div className='col8'>
          <h4>{taskTitle}</h4>
          <h2 className='space col12 clearfix'>
            {permalinkAnchor}
            {extentRange}
          </h2>
        </div>
        {totalSummary}
      </div>
    );
  }
}

DashHeading = withRouter(DashHeading);

export default DashHeading;
