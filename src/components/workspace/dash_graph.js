import React, { Component } from 'react';
import { withRouter } from 'react-router';

// import d3Graph from '../../util/d3Graph';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class DashGraph extends Component {
  render() {
    return <p>Dash graph</p>;
  }
}

export default DashGraph;

// const DashGraph = React.createClass({
//   mixins: [
//     Reflux.listenTo(actions.sidebarToggled, 'resize'),
//     PureRenderMixin
//   ],
//
//   getInitialState: function() {
//     var params = this.props.location.query;
//     return {
//       filter: (params.filter) ? params.filter : 'all'
//     };
//   },
//
//   getGraphState: function() {
//     var filter = this.state.filter;
//     var data = this.props.data.map(function(d) {
//       d.value = 0;
//       if (d.edit && (filter === 'all' || filter === 'edited')) d.value += d.edit;
//       if (d.fix && (filter === 'all' || filter === 'fixed')) d.value += d.fix;
//       if (d.skip && (filter === 'all' || filter === 'skipped')) d.value += d.skip;
//       if (d.noterror && (filter === 'all' || filter === 'noterror')) d.value += d.noterror;
//       return d;
//     });
//
//     return {
//       data: data
//     };
//   },
//
//   componentDidMount: function() {
//     d3Graph.create(this.brushGraph);
//   },
//
//   componentDidUpdate: function() {
//     var params = this.props.location.query;
//     d3Graph.update(this.brushGraph, this.getGraphState(), params);
//   },
//
//   componentWillUnmount: function() {
//     d3Graph.destroy(this.brushGraph);
//   },
//
//   resize: function() {
//     window.setTimeout(function() {
//       d3Graph.resize(this.refs.brushgraph.getDOMNode());
//     }.bind(this), 300);
//   },
//
//   filterBy: function(e) {
//     var filter = e.target.getAttribute('id');
//     this.setState({ filter: filter });
//     actions.updatePermalink({filter: filter});
//   },
//
//   render: function() {
//     return (
//       <div className='fill-darken1 pad2 round col12 space-bottom2 contain'>
//
//         <div className='pin-topright pad1'>
//           <form onChange={this.filterBy} className='rounded-toggle short inline'>
//             <input id='all' type='radio' name='filter' value='all' defaultChecked={this.state.filter === 'all'} />
//             <label htmlFor='all'>All</label>
//             <input id='edited' type='radio' name='filter' value='edited' defaultChecked={this.state.filter === 'edited'} />
//             <label htmlFor='edited'>Edited</label>
//             <input id='fixed' type='radio' name='filter' value='fixed' defaultChecked={this.state.filter === 'fixed'} />
//             <label htmlFor='fixed'>Fixed</label>
//             <input id='skipped' type='radio' name='filter' value='skipped' defaultChecked={this.state.filter === 'skipped'} />
//             <label htmlFor='skipped'>Skipped</label>
//             <input id='noterror' type='radio' name='filter' value='noterror' defaultChecked={this.state.filter === 'noterror'} />
//             <label htmlFor='noterror'>Not error</label>
//           </form>
//         </div>
//
//         <div ref={node => this.brushGraph = node}></div>
//       </div>
//     );
//   }
// });
//
// export default withRouter(DashGraph);
