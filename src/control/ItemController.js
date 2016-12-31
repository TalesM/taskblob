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
      this.setState({item: {name: this.props.children||''}});
    }
  }

  componentWillUnmount() {

  }

  render() {
    const item = this.state.item;
    const itemInfo = item.name?{
      start:        item.start(),
      duration:     item.duration,
      spent:        item.spent,
      dependencies: (item.dependencies||[]).slice(0),
      spentReg:     Math.min(item.spent, item.duration),
      remaining:    Math.max(item.duration - item.spent, 0),
      overdue:      Math.max(item.spent - item.duration, 0),
      closed:       item.closed,
      id:           item.id+'.',
    } : {};
    return (
      <this.props.template
        {...this.props}
        {...itemInfo}
        onSubmit={this.submit}
        editName={this.editName}
        editDuration={this.editDuration}
        editSpent={this.editSpent}
        editClosed={this.editClosed}
        editDependencies={this.editDependencies}
        onReset={this.reset}
        scale="2"
      >
        {this.state.item.name}
      </this.props.template>
    );
  }

  editName = (ev) => {
    const item = this.state.item;
    item.name = ev.target.value;
    this.setState({item});
  }

  editDuration = (ev) => {
    const item = this.state.item;
    item.duration = ev.target.value;
    this.setState({item});
  }

  editSpent = (ev) => {
    const item = this.state.item;
    item.spent = ev.target.value;
    this.setState({item});
  }

  editClosed = (ev) => {
    const item = this.state.item;
    item.closed = ev.target.checked;
    this.setState({item});
  }

  editDependencies = (ev) => {
    const item = this.state.item;
    const items = this.props.items;
    item.dependencies = Array
      .filter(ev.target.options, op=>op.selected)
      .map(op=>items[op.value])
      .filter(obj => obj !== item && !obj.hasDependency(item));
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
