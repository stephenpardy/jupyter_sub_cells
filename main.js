var child_flag = 'child_cell';

var child_flag_init = IPython.CellToolbar.utils.checkbox_ui_generator(

    // Name
    child_flag,

    // Setter, called when the checkboxes state has been changed.
    // Sets the flag name and
    // value in the cell's metadata.
    function(cell, value){
        cell.metadata[child_flag] = value;
        if (value){
            var g = cell.element[0];
            $(g).css({marginLeft: '+=15px'});
        } else {
            var g = cell.element[0];
            $(g).css({marginLeft: '0px'});
        }
    },

    // Getter, called when the control is rendered.  Determines the initial
    // state of the checkbox.  If the flag doesn't in the metadata, default
    // to false.
    function(cell){
        if (cell.metadata[child_flag] === undefined || cell.metadata[child_flag]
           == false) {
            var g = cell.element[0];
            $(g).css({marginLeft: '0px'});
            return false;
        } else {
            var g = cell.element[0];
            if (parseInt($(g).css("marginLeft")) == 0){
                $(g).css({marginLeft: '+=15px'});
            }
            return true;
        }
    }
);


IPython.CellToolbar.register_callback(child_flag, child_flag_init);

// Create and register the toolbar with IPython.
IPython.CellToolbar.register_preset('Mark Child Cells', [child_flag]);

function runParent(){
    var env = IPython;
    var done = false;
    var index = env.notebook.get_selected_index();
    var cell = env.notebook.get_selected_cell();
    env.notebook.execute_cell();
    while (!done){
        env.notebook.select_next();
        index = env.notebook.get_selected_index();
        cell = env.notebook.get_selected_cell();
        if (index == (env.notebook.ncells()-1) || index == null) {
            done = true;
        } else {
            if (cell.metadata[child_flag] === undefined || cell.metadata[child_flag]
                == false) {
                done = true;
            } else {
                env.notebook.focus_cell();
                env.notebook.execute_cell();
            }
        }
    }

    return;
}

IPython.toolbar.add_buttons_group([
            {
                id : 'run_parent',
                label : 'Run Child Cells',
                icon : 'fa-child',
                callback : function () {
                    runParent();
                    }
            }
         ]);
    $("#run_parent").css({'outline' : 'none'});

var add_command_shortcuts = {
           'alt-enter' : {
                help    : 'Execute child cells',
                help_index : 'xa',
                handler : function() {
                    var mode = IPython.notebook.get_selected_cell().mode;
                    runParent();
                    var type = IPython.notebook.get_selected_cell().cell_type;
                    if (mode == "edit" && type == "code") IPython.notebook.edit_mode();
                    return false;
                }
            }
        }

IPython.keyboard_manager.command_shortcuts.add_shortcuts(add_command_shortcuts);
IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_command_shortcuts);