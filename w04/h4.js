/*jslint indent: 4, maxerr: 50, vars: true */

var app = angular.module('todoApp', []);
app.controller('TodoCtrl', function ($scope, $filter) {
	'use strict';

	var db = {
		groups: [],
		users: [],
		tasks: [],
		count: function (table) {
			if (db[table]) {
				return $filter('filter')(db[table], function (e) { return e.id > 0; }).length;
			}
			return null;
		}
	};

	function Group(name, description) {
		this.name = name;
		this.description = description;
		this.id = db.groups.push(this);
	}

	Group.prototype.hasUsers = function () {
		var id = this.id;
		return db.users.some(function (user) {
			return user.groupId === id;
		});
	};

	Group.prototype.users = function (query) {
		var id = this.id;
		query = query ||  { groupId: id };
		return $filter('filter')(db.users, query);
	};

	Group.prototype.usersExcept = function (idList) {
		var id = this.id;
		return this.users(function (u) {
			return u.groupId === id && idList.indexOf(u.id) === -1;
		});
	};

	Group.prototype.addUser = function (state) {
		var text = state.userName;
		state.userName = null;
		return text && text.trim() ? new User(text.trim(), this.id) : null;
	};

	Group.prototype.remove = function () {
		this.users().forEach(function (user) {
			user.remove();
		});

		delete db.groups[this.id - 1];
	};

	Group.prototype.addTask = function (name) {
		return name && name.trim() ? new Task(name.trim(), this.id) : null;
	};

	Group.prototype.tasks = function (query) {
		var id = this.id;
		query = query || { groupId: id };
		return $filter('filter')(db.tasks, query);
	};

	Group.prototype.unassignedTasks = function () {
		var id = this.id;
		return this.tasks(function (t) { return t.groupId === id && !t.userId; });
	};

	Group.prototype.finishedTasks = function () {
		var id = this.id;
		return this.tasks(function (t) { return t.groupId === id && t.done; });
	};

	$scope.newGroup = function () {
		if (!$scope.ngroup) {
			return;
		}

		var name = $scope.ngroup.name,
			description = $scope.ngroup.description || '';

		console.log($scope.ngroup);

		delete $scope.ngroup;
		return name && name.trim() ? new Group(name.trim(), description.trim()) : null;
	};

	function User(name, groupId) {
		this.name = name;
		this.groupId = groupId;
		this.id = db.users.push(this);
	}

	User.prototype.tasks = function () {
		var id = this.id;
		return $filter('filter')(db.tasks, { userId: id });
	};

	User.prototype.hasTasks = function () {
		var id = this.id;
		return db.tasks.some(function (task) {
			return task.userId === id;
		});
	};

	User.prototype.addTask = function (name) {
		return name && name.trim() ? new Task(name.trim(), this.groupId, this.id) : null;
	};

	User.prototype.remove = function () {
		this.tasks().forEach(function (task) {
			task.remove();
		});

		delete db.users[this.id - 1];
	};

	function Task(text, groupId, userId, done) {
		this.done = !!done;
		this.text = text;
		this.groupId = groupId;
		this.userId = userId;
		this.id = db.tasks.push(this);
	}

	Task.prototype.belongsTo = function (userId) {
		return this.userId === +userId;
	};

	Task.prototype.reassignTo = function (userId) {
		userId = +userId;

		console.log(userId);
		if (userId > 0 && angular.isNumber(userId)) {
			console.log('reasigned to user: ' + userId);
			this.userId = userId;
		}
	};

	Task.prototype.remove = function () {
		delete db.tasks[this.id - 1];
	};

	var g1 = new Group('Create & Manage Groups', 'The first group');
	var g2 = new Group('Tasks', 'The second group');
	var g3 = new Group('Computer', 'The third group');
	var g4 = new Group('Documentation', 'The fourth group');

	var u1 = new User('User1', 1);
	var u2 = new User('User2', 1);
	var u3 = new User('User3', 2);
	var u4 = new User('User4', 2);
	var u5 = new User('User5', 3);
	var u6 = new User('User6', 3);
	var u7 = new User('User7', 4);

	var t1 = new Task('A group is a collection of Students.', 1, 1);
	var t2 = new Task('A group should have a Node Module associated with it.', 1, 1, true);
	var t3 = new Task('A group should have a "Description" property that outlines the module that is being presented.', 1, 1, true);
	var t4 = new Task('Your application should allow Students to be added/removed from a group', 1, 2);
	var t5 = new Task('Your app should allow groups to be deleted', 1, 2);
	var t6 = new Task('Your application should allow new tasks to be created.', 2, 3, true);
	var t7 = new Task('Your application should allow tasks to be assigned to individual members of a team.', 2, 3);
	var t8 = new Task('Your app should allow tasks to be marked as done, not-done, and also be deleted.', 2, 3, true);
	var t9 = new Task('T9', 2, 4);
	var t10 = new Task('T10', 2, 4);
	var t11 = new Task('T11', 2, 4);
	var t12 = new Task('T12', 3, 6);
	var t13 = new Task('T13', 3, 6);
	var t14 = new Task('M1', 1);
	t14 = new Task('M2', 1);
	t14 = new Task('M3', 1);

	// console.log(db);
	// console.info(Object.keys(db.tasks));
	// console.info(db.tasks);

	$scope.db = db;
});

app.directive('addTask', function () {
	'use strict';

	return {
		restrict: 'E',
		scope: {
			entity: '='
		},
		link: function (scope) {
			scope.addTask = function () {
				// console.log('entity', scope.entity, scope.taskName);
				console.log(scope.users);
				if (scope.entity) {
					scope.entity.addTask(scope.taskName);
				}
				scope.taskName = null;
			};
		},
		template: ['<form ng-submit="addTask()">',
				'<div class="form-group">',
					'<div class="input-group">',
						'<div class="input-group-addon"><span class="glyphicon glyphicon-tent"></span></div>',
						'<input type="text" class="form-control" ng-model="taskName" size="30" placeholder="Add new task">',
						'<div class="input-group-addon"><button type=submit class="addon btn btn-link btn-xs">Add</button></div>',
					'</div>',
				'</div>',
			'</form>'].join('')
	};
});

app.directive('taskItem', function () {
	'use strict';

	return {
		restrict: 'E',
		link: function (scope, element, attrs) {
			scope.updateUsers = function () {
				if (attrs.exclude === 'true') {
					scope.users = scope.group.usersExcept([scope.user.id]);
				} else {
					scope.users = scope.group.users();
				}
			};
			
			scope.users = scope.updateUsers();

			scope.click = function () {
				scope.updateUsers();
				scope.toggle = !scope.toggle;
			};

			scope.reassign = function () {
				scope.task.reassignTo(scope.userId);
				scope.userId = null;
				scope.toggle = null;
			};
		},
		template: ['		<div class="checkbox">',
								' <button class="btn btn-warning btn-xs" ng-click="task.remove()"><span class="glyphicon glyphicon-remove"></span></button>',
								' <button class="btn btn-info btn-xs" ng-click="click()" title="Reassign to a user"><span class="glyphicon glyphicon-send"></span> Reassign</button> ',
									' <button class="btn btn-success btn-xs" ng-show="task.done"><span class="glyphicon glyphicon-ok"></span> Done</button> ',
								'<label task-complete={{task.done}}>',
									' <input type="checkbox" ng-model="task.done"> ',
									' {{task.text}}',
								'</label>',
							'</div>',
							'<div class="form-group" ng-show="toggle">',
								'<form>',
									'<select class="form-control" ng-model="userId" type="number"',
									  'ng-change="reassign()" ng-click="updateUsers()"',
									  'ng-options="user.id as user.name for user in users">',
									  '<option value="">&gt; Reasign Task: Select Student</option>',
									'</select>',
								'</form>',
							'</div>'].join('')
	};
});
