import React from 'react';
import GanttItemName from './GanttItemName'

function Meter(props) {
  const style = {
    width: props.width||0
  }
  let className = "meter "+props.type;
  if(props.closed) {
    className += " closed"
  }
  return <span className={className} style={style}/>;
}

function AddNewItem(props) {
  return (
    <div className="item placeholder" onClick={props.onClick}>
      <GanttItemName
        closed={props.closed}
        onChange={props.editName}
        onSubmit={props.onSubmit}
        selected={props.selected}
      >
        {props.children}
      </GanttItemName>
    </div>
  );
}

export {AddNewItem, Meter};

export default function(props) {
  const meters = [
    'start', 'spent', 'overdue', 'remaining', 'unreachable'
  ].map(
    type => <Meter closed={props.closed} key={type} type={type} width={props[type]}/>
  );

  return (
    <div className="item" onClick={props.onClick}>
      <GanttItemName
        closed={props.closed}
        onChange={props.editName}
        onSubmit={props.onSubmit}
        selected={props.selected}
      >
        {props.children}
      </GanttItemName>
      {meters}
    </div>
  );
}
