import React, { Component } from 'react';

import d3Graph from '../../utils/d3_graph';

class StatsGraph extends Component {
  state = {
    filter: 'all',
  }

  fetchIfChanged = (_from, _to) => {
    const { statsFrom, statsTo, fetchStatsByRange } = this.props;
    if (_from !== statsFrom || _to !== statsTo) {
      fetchStatsByRange(_from, _to);
    }
  }

  getGraphState() {
    const { filter } = this.state;
    const { statsByDate } = this.props;

    if (statsByDate && statsByDate.length) {
      const data = this.props.statsByDate.map(function(d) {
        d.value = 0;
        if (d.edit && (filter === 'all' || filter === 'edited')) d.value += d.edit;
        if (d.fixed && (filter === 'all' || filter === 'fixed')) d.value += d.fixed;
        if (d.skip && (filter === 'all' || filter === 'skipped')) d.value += d.skip;
        if (d.noterror && (filter === 'all' || filter === 'noterror')) d.value += d.noterror;
        return d;
      });

      return {
        data: data,
      };
    }

    return {
      data: [],
    }
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

  filterBy = (e) => {
    const filter = e.target.getAttribute('id');
    this.setState({ filter });
  }

  render() {
    return (
      <div className='fill-darken1 pad2 round col12 space-bottom2 contain'>

        <div className='pin-topright pad1'>
          <form onChange={this.filterBy} className='rounded-toggle short inline'>
            <input id='all' type='radio' name='filter' value='all' defaultChecked={this.state.filter === 'all'} />
            <label htmlFor='all'>All</label>
            <input id='edited' type='radio' name='filter' value='edited' defaultChecked={this.state.filter === 'edited'} />
            <label htmlFor='edited'>Edited</label>
            <input id='fixed' type='radio' name='filter' value='fixed' defaultChecked={this.state.filter === 'fixed'} />
            <label htmlFor='fixed'>Fixed</label>
            <input id='skipped' type='radio' name='filter' value='skipped' defaultChecked={this.state.filter === 'skipped'} />
            <label htmlFor='skipped'>Skipped</label>
            <input id='noterror' type='radio' name='filter' value='noterror' defaultChecked={this.state.filter === 'noterror'} />
            <label htmlFor='noterror'>Not error</label>
          </form>
        </div>

        <div ref={node => this.brushGraph = node}></div>
      </div>
    );
  }
}

export default StatsGraph;
