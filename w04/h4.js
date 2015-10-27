/*jslint indent: 4, maxerr: 50, vars: true, browser: true, devel: true */
/*global angular */

(function () {
	'use strict';

	var app = angular.module('todoApp', []);
	app.controller('TodoCtrl', function ($scope, $filter) {

		var db;

		function Db() {
			this.$tables = ['groups', 'users', 'tasks'];
			this.tables = {};
			this.create();
		}

		Db.KEY = 'cs454-hw04-fg';

		Db.prototype.create = function () {
			var db = this;
			this.$tables.forEach(function (key) {
				db.tables[key] = [];
			});
		};

		Db.prototype.count = function (table) {
			if (this.tables[table]) {
				return $filter('filter')(this.tables[table], function (e) { return e.id > 0; }).length;
			}
			return null;
		};

		Db.prototype.persist = function () {
			try {
				console.log('Attempting to store:', JSON.stringify(this.tables, null, 2));
				localStorage.setItem(Db.KEY, JSON.stringify(this.tables));
			} catch (e) {
				alert('Can\'t store localStorage');
			}
		};

		Db.prototype.drop = function () {
			try {
				localStorage.removeItem(Db.KEY);
				db.create();
			} catch (e) {
				alert('Could not remove localStorage');
			}
		};

		Db.prototype.load = function () {

			try {
				var tables = JSON.parse(localStorage.getItem(Db.KEY)), t;

				for (t in tables) {
					if (tables.hasOwnProperty(t)) {
						tables[t].forEach(function (obj) {
							if (t === 'groups') {
								obj = new Group(obj);
							} else if (t === 'users') {
								obj = new User(obj);
							} else if (t === 'tasks') {
								obj = new Task(obj);
							}
						});
					}
				}

				// console.log(this);
				$scope.db = this;
			} catch (e) {
				console.error('Could not load localStorage');
				console.info(e.message);
			}
		};

		db = new Db();

		function Group(group) {
			this.id = group.id;
			this.name = group.name;

			if (group.id) {
				this.description = group.description;
				db.tables.groups[group.id - 1] = this;
			} else {
				this.id = db.tables.groups.push(this);
			}

			// console.log($scope.db);
		}

		Group.prototype.hasUsers = function () {
			var id = this.id;
			return db.tables.users.some(function (user) {
				return user.groupId === id;
			});
		};

		Group.prototype.users = function (query) {
			var id = this.id;
			query = query ||  { groupId: id };
			return $filter('filter')(db.tables.users, query);
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
			return text && text.trim() ? new User({name: text.trim(), groupId: this.id}) : null;
		};

		Group.prototype.remove = function () {
			this.users().forEach(function (user) {
				user.remove();
			});

			delete db.tables.groups[this.id - 1];
		};

		Group.prototype.addTask = function (text) {
			text = text && text.trim();
			return text ? new Task({text: text, groupId: this.id}) : null;
		};

		Group.prototype.tasks = function (query) {
			var id = this.id;
			query = query || { groupId: id };
			return $filter('filter')(db.tables.tasks, query);
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
			console.log(name, description);
			return name && name.trim() ? new Group({name: name.trim(), description: description.trim()}) : null;
		};

		function User(user) {
			this.name = user.name;
			this.groupId = user.groupId;

			if (user.id) {
				this.id = user.id;
				db.tables.users[user.id - 1] = this;
			} else {
				this.id = db.tables.users.push(this);
			}
			$scope.db = db;
		}

		User.prototype.tasks = function () {
			var id = this.id;
			return $filter('filter')(db.tables.tasks, { userId: id });
		};

		User.prototype.hasTasks = function () {
			var id = this.id;
			return db.tables.tasks.some(function (task) {
				return task.userId === id;
			});
		};

		User.prototype.addTask = function (text) {
			text = text && text.trim();
			return text ? new Task({text: text, groupId: this.groupId, userId: this.id}) : null;
		};

		User.prototype.remove = function () {
			this.tasks().forEach(function (task) {
				task.remove();
			});

			delete db.tables.users[this.id - 1];
		};

		function Task(task) {
			this.id = task.id;
			this.done = !!task.done;
			this.text = task.text;
			this.groupId = task.groupId;
			this.userId = task.userId;

			if (task.id) {
				db.tables.tasks[task.id - 1] = this;
			} else {
				this.id = db.tables.tasks.push(this);
			}
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
			delete db.tables.tasks[this.id - 1];
		};

		function testData() {
			var g = new Group({name: 'Create & Manage Groups', description: 'The first group'});
			g = new Group({name: 'Tasks', description: 'The second group'});
			g = new Group({name: 'Computer', description: 'The third group'});
			g = new Group('Documentation', 'The fourth group');

			var u = new User({name: 'User1', groupId: 1});
			u = new User({name: 'User2', groupId: 1});
			u = new User({name: 'User3', groupId: 2});
			u = new User({name: 'User4', groupId: 2});
			u = new User({name: 'User5', groupId: 3});
			u = new User({name: 'User6', groupId: 3});
			u = new User({name: 'User7', groupId: 4});

			var t = new Task({text: 'A group is a collection of Students.', groupId: 1, userId: 1});
			t = new Task({text: 'A group should have a Node Module associated with it.', groupId: 1, userId: 1, done: true});
			t = new Task({text: 'A group should have a "Description" property that outlines the module that is being presented.', groupId: 1, userId: 1, done: true});
			t = new Task({text: 'Your application should allow Students to be added/removed from a group', groupId: 1, userId: 2});
			t = new Task({text: 'Your app should allow groups to be deleted', groupId: 1, userId: 2});
			t = new Task({text: 'Your application should allow new tasks to be created.', groupId: 2, userId: 3, done: true});
			t = new Task({text: 'Your application should allow tasks to be assigned to individual members of a team.', groupId: 2, userId: 3});
			t = new Task({text: 'Your app should allow tasks to be marked as done, not-done, and also be deleted.', groupId: 2, userId: 3, done: true});
			t = new Task({text: 'T9', groupId: 2, userId: 4});
			t = new Task({text: 'T10', groupId: 2, userId: 4});
			t = new Task({text: 'T11', groupId: 2, userId: 4});
			t = new Task({text: 'T12', groupId: 3, userId: 6});
			t = new Task({text: 'T13', groupId: 3, userId: 6});
			t = new Task({text: 'G1-t1', groupId: 1});
			t = new Task({text: 'G1-t3', groupId: 1});
			t = new Task({text: 'G1-t2', groupId: 1});
		}

		db.load();
		// testData();
		// console.info(Object.keys(db.tables.tasks));
		// console.info(db.tables.tasks);

		$scope.save = function () {
			$scope.db.persist();
		};

		$scope.clear = function () {
			$scope.db.drop();
		};

		$scope.db = db;
		console.log(db.tables);
	});

	app.directive('addTask', function () {
		return {
			restrict: 'E',
			scope: {
				entity: '='
			},
			link: function (scope) {
				scope.addTask = function () {
					// console.log('entity', scope.entity, scope.taskName);
					console.log(scope.entity);
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

}());