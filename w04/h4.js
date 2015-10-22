/*jslint indent: 4, maxerr: 50, vars: true */

// // (function () {
angular.module('todoApp', [])
	.controller('TodoCtrl', function ($scope) {
		'use strict';

		var db = {
			groups: [],
			users: [],
			tasks: []
		};

		$scope.reassign = false;

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

		Group.prototype.users = function () {
			var id = this.id;
			return db.users.filter(function (user) {
				return user.groupId === id;
			});
		};

		Group.prototype.usersMinus = function (idList) {
			return this.users().filter(function (u) {
				return idList.indexOf(u.id) === -1;
			});
		};
		
		Group.prototype.addUser = function (text) {
			return text && text.trim() ? new User(text.trim(), this.id) : null;
		};

		Group.prototype.remove = function () {
			this.users().forEach(function (user) {
				user.remove();
			});

			delete db.groups[this.id - 1];
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
			return db.tasks.filter(function (task) {
				return task.userId === id;
			});
		};

		User.prototype.hasTasks = function () {
			var id = this.id;
			return db.tasks.some(function (task) {
				return task.userId === id;
			});
		};

		User.prototype.addTask = function (text) {
			return text && text.trim() ? new Task(text.trim(), this.id) : null;
		};

		User.prototype.remove = function () {
			this.tasks().forEach(function (task) {
				task.remove();
			});

			delete db.users[this.id - 1];
		};

		function Task(text, userId, done) {
			this.done = !!done;
			this.text = text;
			this.userId = userId;
			this.id = db.tasks.push(this);
		}

		Task.prototype.belongsTo = function (userId) {
			return this.userId === +userId;
		};

		Task.prototype.reassignTo = function (userId) {
			userId = +userId;

			console.log($scope.newselection);
			if (angular.isNumber(userId)) {
				this.userId = userId;
			}
		};

		Task.prototype.remove = function () {
			delete db.tasks[this.id - 1];
		};

		var g1 = new Group('Create & Manage Groups', 'A group');
		var g2 = new Group('Tasks', 'B group');
		var g3 = new Group('C', 'C group');
		var g4 = new Group('D', 'D group');

		var u1 = new User('U1', 1);
		var u2 = new User('U2', 1);
		var u3 = new User('U3', 2);
		var u4 = new User('U4', 2);
		var u5 = new User('U5', 3);
		var u6 = new User('U6', 3);
		var u7 = new User('U7', 4);

		var t1 = new Task('A group is a collection of Students.', 1);
		var t2 = new Task('A group should have a Node Module associated with it.', 1, true);
		var t3 = new Task('A group should have a "Description" property that outlines the module that is being presented.', 1, true);
		var t4 = new Task('Your application should allow Students to be added/removed from a group', 2);
		var t5 = new Task('Your app should allow groups to be deleted', 2);
		var t6 = new Task('Your application should allow new tasks to be created.', 3, true);
		var t7 = new Task('Your application should allow tasks to be assigned to individual members of a team.', 3);
		var t8 = new Task('Your app should allow tasks to be marked as done, not-done, and also be deleted.', 3, true);
		var t9 = new Task('T9', 4);
		var t10 = new Task('T10', 4);
		var t11 = new Task('T11', 4);
		var t12 = new Task('T12', 6);
		var t13 = new Task('T13', 6);

		// console.log(db);
		// console.info(Object.keys(db.tasks));
		console.info(db.tasks);

		$scope.db = db;
	});