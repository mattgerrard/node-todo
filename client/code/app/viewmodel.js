function Task(data) {
    this.id = data._id
    this.title = ko.observable(data.title);
    this.isDone = ko.observable(data.isDone);
}

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {

    // Data
    var self = this;
    self.tasks = ko.observableArray([]);
    self.newTaskText = ko.observable();
    self.incompleteTasks = ko.computed(function() {
        return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.isDone() && !task._destroy });
    });

    // Operations
    self.addTask = function() {
        self.tasks.push(new Task({ id: null, title: this.newTaskText(), isDone: false }));
        self.newTaskText("");
    };
    self.removeTask = function(task) { self.tasks.destroy(task) };
    self.save = function() {
        $.ajax("/save", {
            data: ko.toJSON({ tasks: self.tasks }),
            type: "post", contentType: "application/json",
        });
        self.list();
    }; 
    self.list = function() {
        // Load state from server, convert it to Task instances, then populate self.tasks
        $.getJSON("/list", function(allData) {
            var mappedTasks = $.map(allData, function(item) { return new Task(item) });
            self.tasks(mappedTasks);
        }); 
    }

    self.list();
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());