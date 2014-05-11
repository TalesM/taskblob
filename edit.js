/**
 * 
 */

$(function() {
	//Add new task
	$( '.viewSection .add').on('click', function() {
		var $editTask = $('.editTask');
		$editTask.find('#taskPath').val((tasks.length+1));
		$editTask.dialog('option', 'title', 'Adicionar Nova Tarefa');
		$editTask.dialog("open");
	});
	
	//Edit
	$( '.viewSection').on('click', '.taskName .edit', function() {
		var $editTask = $('.editTask');
		var sid = $(this).parent().parent().attr('id').substr(5).replace('_', '.');
		var task = getTask(id2path(sid));
		$editTask.find('#taskPath').val(sid);
		$editTask.find('#taskName').val(task.name);
		$editTask.find('#description').val(task.description);
		$editTask.find('#duration').val(task.duration);
		$editTask.find('#spent').val(task.spent);
		$editTask.find('#status').val(task.status);
		$editTask.find('#dependencies').val(task.dependencies);
		$editTask.find('#dependsMe').val(task.dependsMe);
		$editTask.dialog('option', 'title', 'Editar Tarefa');
		$editTask.dialog("open");
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
			},
			'Cancelar': function() {
				$(this).dialog("close");
			}
		},
		close : function() {
			$('.editTask form').each (function(){
				  this.reset();
			});
		}
	});
});