import React from 'react';
import MainView from './ui/MainView';
import SettingsView from './ui/SettingsView';
import ProjectController from './control/ProjectController';
import SettingsController from './control/SettingsController';
import './App.css';
import Project from './model/Project';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {project: this.load()};
    window.onbeforeunload = function(e) {
      this.persist();
    }.bind(this);
    setInterval(this.persist, 2000)
  }

  componentDidMount() { }

  componentWillUnmount() { }

  render() {
    return (<div>
      <ProjectController template={MainView} project={this.state.project}/>
      <SettingsController template={SettingsView} project={this.state.project}/>
    </div>);
  }

  persist = () => {
    localStorage.setItem('taskBlobProject', JSON.stringify(this.state.project.dry()));
  }

  load = () => {
    try {
      let driedProject = JSON.parse(localStorage.getItem('taskBlobProject'));
      if(driedProject){
        return Project.wet(driedProject);
      }
    } catch(ex){
      console.error(ex);
    }
    return new Project('Project', '');
  }
}

export default App;
