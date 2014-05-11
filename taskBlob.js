/**
 * 
 */
tasks = [];
$(function(){
	$('.mainNav').buttonset();
//	$('.mainNav button').button();
	//Cool effect
	$( '.viewGroup' ).on( 'scroll', function( event ) {
		$( '.viewGroup .taskName').css('left', $(this).scrollLeft());
	});
	
	$('.editTask').dialog({
		width : 600,
		autoOpen : false,
		modal : true,
		buttons : {
			'Salvar' : function() {
				$this = $(this);
				var id = id2path($this.find('#taskPath').val());
				var name = $this.find('#taskName').val();
				var description = $this.find('#description').val();
				var duration = +$this.find('#duration').val();
				var spent = +$this.find('#spent').val();
				var status = $this.find('#status').val();
				var dependStr = $this.find('#dependencies').val();
				var dependencies = [];
				dependStr.split(',').forEach(function(value, index) {
					dependencies[index] = id2path(value);
				});
				if (id[0] > tasks.length) {							//Adding
					var task = new Task([ tasks.length + 1 ], name,
							description, duration, spent, status,
							dependencies);
					tasks.push(task);
					addTaskChrono($(".viewGroup"), task);
				} else {											//Editing
					var task = getTask(id);
					task.name 		= name;
					task.description= description;
					task.duration 	= duration;
					task.spent 		= spent;
					task.status		= status;
					//TODO task.dependecies;
					editTaskChrono($(".viewGroup"), task);
				}
				$this.dialog("close");
			}
		},
		close : function() {
			$('.editTask form').each (function(){
				  this.reset();
			});
		}
	});
	
	//Add new task
	$( '.viewSection .add').on('click', function() {
		var $editTask = $('.editTask');
		$editTask.find('#taskPath').val((tasks.length+1));
		$editTask.dialog('option', 'title', 'Adicionar Nova Tarefa');
		$editTask.dialog("open");
	});
	
	//Quick edit task.
	
	//Edit
	$( '.viewSection').on('click', '.task', function() {
		var $editTask = $('.editTask');
		var sid = $(this).attr('id').substr(5).replace('_', '.');
		var task = getTask(id2path(sid));
		$editTask.find('#taskPath').val(sid);
		$editTask.find('#taskName').val(task.name);
		$editTask.find('#description').val(task.description);
		$editTask.find('#duration').val(task.duration);
		$editTask.find('#spent').val(task.spent);
		$editTask.find('#status').val(task.status);
		$editTask.find('#dependencies').val(task.dependencies);
		$editTask.dialog('option', 'title', 'Editar Tarefa');
		$editTask.dialog("open");
	});
});

function id2path(val){
	return JSON.parse('[' + val.replace('.', ',') + ']');
}


function getTask(path) {
	var index = path[0]-1;
	if(index >= tasks.length)
		return null;
	var container = tasks[path[0]-1];
	for (var i = 1; i < path.length; i++) {
		index = path[i]-1;
		if(index >= container.subTaskslength)
			return null;
		container = container.subTasks[index];
	}
	return container;
}

function makeTaskName(path) {
	var str = 'task';
	path.forEach(function(element) {
		str += '_' + element;
	});
	return str;
}

var startPos = 0;
var scale = 2;
//
//function generateTaskView() {
//	
//}

function addTaskChrono(viewGroup, task){
	var viewItem = '<div class="task" '+ 'id="' + makeTaskName(task.id) +'" >';
	viewItem += generateTaskView(task);
	viewItem += '</div>';
	viewGroup.append(viewItem);
}

function editTaskChrono(viewGroup, task){
	var $element = viewGroup.find('#' + makeTaskName(task.id));
	var viewItem = generateTaskView(task);
	$element.html(viewItem);
}


function generateTaskView(task) {
	var path = task.id;
	var viewItem = '<span class="taskName">'+path.join('.')+ ". "+task.name + '</span>';
	viewItem += '<span class="meter start" style = "width:'+(task.start()*scale)+'em"></span>';
	viewItem += '<span class="meter spentReg" style = "width:'+(task.spentReg()*scale)+'em"></span>';
	viewItem += '<span class="meter remaining" style = "width:'+(task.remaining()*scale)+'em"></span>';
	viewItem += '<span class="meter leftover" style = "width:'+(task.leftover()*scale)+'em"></span>';
	viewItem += '<span class="meter overdue" style = "width:'+(task.overdue()*scale)+'em"></span>';
	return viewItem;
}	

function Task(id, name, description, duration, spent, status, dependencies){
	this.id = id;
	this.name = name;
	this.description = description;
	this.duration = duration;
	this.spent = spent;
	if(!status)
		this.status = 'proposed';
	else
		this.status = status;
	if(!dependencies)
		this.dependencies = [];
	else 
		this.dependencies = dependencies;
	this.dependsMe = [];
	this.dependencies.forEach(function(value, index, deps) {
		var otherTask = getTask(value);
		if(otherTask != null)
			otherTask.dependsMe.push(id);
		else
			deps.splice(index, 1);
	});
	this.subTasks = [];
}

Task.prototype.spentReg = function() {
	return Math.min(this.duration, this.spent);
};

Task.prototype.remaining = function() {
	return this.duration - this.spentReg();
};

Task.prototype.overdue = function() {
	return this.spent - this.spentReg();
};

Task.prototype.leftover = function() {
	return  0;
};

Task.prototype.start = function() {
	var start = 0;
	this.dependencies.forEach(function(path) {
		var task = getTask(path);
		start = Math.max(start, task.end());
	});
	return start;
};

Task.prototype.end = function() {
	return this.start() + Math.max(this.duration, this.spent);
};
