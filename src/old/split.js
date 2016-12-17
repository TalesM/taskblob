/**
 * 
 */
$(function() {
	//Context menu
	$('.popMenu').on('click', '.split', function() {
		if(confirm('Você deseja realmente transformar esta tarefa em um grupo? \n'
				+'Esta é uma funcionalidade experimental, recomendamos que você faça um backup antes. Deseja contiuar?')){
			var task = tasks.get($(this).closest('.popMenu').attr('data-itemid').split('.'));
			var parent = task.parent;
			var group = new Group(task.id, task.name, task.description);
			task.id = task.id.concat([1]);
			task.name += '.1';
			parent.swap(task, group);
			group.addKid(task);
			addTaskChrono(task);
			refreshItems([group]);
		}
	});
});