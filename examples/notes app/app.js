var noteProps = {
    noteList: ["Go out to buy things", "Wash Clothes"],
    notesDisplayList : [],
    note: "",
    noteFilter: ""
}
noteProps.notesDisplayList = noteProps.noteList;  

var NotesVM = new TWBinding(document.getElementById("notes"))
                        .bind(noteProps)
                        .setCallback(handleNoteCallback);


function handleNoteCallback(changedProp){
    console.log(changedProp);
    if(changedProp == "noteFilter"){
        NotesVM.props.notesDisplayList = [];
        NotesVM.props.notesDisplayList = NotesVM.props.noteList.filter(function(item){
            return item.toLowerCase().includes(NotesVM.props.noteFilter.toLowerCase());
        });
    }
}

// add note
document.getElementById("noteAdd").addEventListener("click", function(e){
    NotesVM.props.noteList.push(NotesVM.props.note);
    NotesVM.props.notesDisplayList = NotesVM.props.noteList;
})


