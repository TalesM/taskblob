import React from 'react';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {item: {}};
  }

  componentDidMount() {
    if(this.props.item) {
      this.setState({item: this.props.item});
    } else {
      this.setState({item: {name: this.props.children||'New'}});
    }
  }

  componentWillUnmount() {

  }

  render() {
    const start=0;
    const item = this.state.item;
    const scale = 2;
    const itemInfo = item.name?{
      start:     start*scale+"em",
      spent:     Math.min(item.spent, item.duration)*scale+"em",
      remaining: Math.max(item.duration - item.spent, 0)*scale+"em",
      overdue:   Math.max(item.spent - item.duration, 0)*scale+"em",
      closed:    item.closed,
    } : {};
    return (
      <this.props.template {...this.props} {...itemInfo} onSubmit={this.submit} editName={this.editName} onReset={this.reset}>
        {this.state.item.name}
      </this.props.template>
    );
  }

  editName = (ev) => {
    const item = this.state.item;
    item.name = ev.target.value;
    this.setState({item});
  }

  submit = (ev) => {
    if(this.props.onSubmit){
      this.props.onSubmit(this.state.item)
    }
    this.reset();
  }

  reset = () => {
    this.componentDidMount();
  }
}
