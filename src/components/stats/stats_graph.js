import React, { Component, PropTypes } from 'react';

import d3Graph from '../../utils/d3_graph';

class StatsGraph extends Component {
  state = {
    // type filter = 'all' | 'edit' | 'fixed' | 'skip' | 'noterror'
    filter: 'all',
  }

  filterBy = (e) => {
    const filter = e.target.getAttribute('value');
    this.setState({ filter });
  }

  fetchIfChanged = (fromDate, toDate) => {
    const { statsFrom, statsTo, fetchStatsByRange } = this.props;
    if (fromDate !== statsFrom || toDate !== statsTo) {
      fetchStatsByRange(fromDate, toDate);
    }
  }

  getGraphState = () => {
    const { filter } = this.state;
    const { statsByDate } = this.props;

    const includedFields = (filter === 'all') ? ['edit', 'fixed', 'skip', 'noterror'] : [filter];

    const data = statsByDate.map(function(d) {
      d.value = includedFields.reduce((sum, field) => sum + d[field], 0);
      return d;
    });

    return {
      data: data,
    };
  }

  componentDidMount() {
    d3Graph.create(this.brushGraph);
  }

  componentDidUpdate() {
    d3Graph.update(this.brushGraph, this.getGraphState(), null, this.fetchIfChanged);
  }

  componentWillUnmount() {
    d3Graph.destroy(this.brushGraph);
  }

  render() {
    const { filter } = this.state;

    return (
      <div className='fill-darken1 pad2 round col12 space-bottom2 contain'>

        <div className='pin-topright pad1'>
          <form onChange={this.filterBy} className='rounded-toggle short inline'>
            <input type='radio' id='all' name='filter' value='all' defaultChecked={filter === 'all'} />
            <label htmlFor='all'>All</label>
            <input type='radio' id='edited' name='filter' value='edit' defaultChecked={filter === 'edit'} />
            <label htmlFor='edited'>Edited</label>
            <input type='radio' id='fixed' name='filter' value='fixed' defaultChecked={filter === 'fixed'} />
            <label htmlFor='fixed'>Fixed</label>
            <input type='radio' id='skipped' name='filter' value='skip' defaultChecked={filter === 'skip'} />
            <label htmlFor='skipped'>Skipped</label>
            <input type='radio' id='noterror' name='filter' value='noterror' defaultChecked={filter === 'noterror'} />
            <label htmlFor='noterror'>Not error</label>
          </form>
        </div>

        <div ref={node => this.brushGraph = node}></div>
      </div>
    );
  }
}

StatsGraph.propTypes = {
  statsFrom: PropTypes.string.isRequired,
  statsTo: PropTypes.string.isRequired,
  statsByDate: PropTypes.array.isRequired,
  fetchStatsByRange: PropTypes.func.isRequired,
};

export default StatsGraph;
