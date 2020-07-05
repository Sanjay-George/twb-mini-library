

var initProps = {
    firstName : "",
    lastName : "",
    randId : Math.round(Math.random() * 1000)
};

var TopcardVM = new TWBinding(document.getElementById("topcard"))
                        .bind(initProps);



/* ---------------------------------------------   */
var emiProps = {
    price : 200000,
    downPayment : 0,
    loanAmount: 0,
    interest : 15,
    tenure: 30,
};
emiProps.downPayment = 0.65 * emiProps.price;
emiProps.loanAmount = emiProps.price - emiProps.downPayment;
emiProps.emiAmount = Math.round(emiProps.loanAmount * (1 + (emiProps.interest *  emiProps.tenure / 1200)) / emiProps.tenure);

var EMICalcVM = new TWBinding(document.getElementById("emicalculator"))
                    .bind(emiProps)
                    .setCallback(updateCalculator);

// callback function to update slider values when change listener fired.
function updateCalculator(changedProp){
    if(changedProp == "downPayment"){
        EMICalcVM.props.loanAmount = parseInt(EMICalcVM.props.price) - parseInt(EMICalcVM.props.downPayment);
        document.getElementById("loanAmount").value = EMICalcVM.props.loanAmount;
    }
    else if(changedProp == "loanAmount"){
        EMICalcVM.props.downPayment =  parseInt(EMICalcVM.props.price) - parseInt(EMICalcVM.props.loanAmount);
        document.getElementById("downPayment").value = EMICalcVM.props.downPayment;
    }
    else if(changedProp == "tenure" && EMICalcVM["props"][changedProp] == ""){
        EMICalcVM["props"][changedProp] = 12;  // set to min value
    }
    EMICalcVM.props.emiAmount = Math.round(EMICalcVM.props.loanAmount * (1 + (EMICalcVM.props.interest *  EMICalcVM.props.tenure / 1200)) / EMICalcVM.props.tenure);
    // console.log("Changed : " + changedProp);
}

(function initializeCalc(){
    document.getElementById("downPayment").min = 0.4 * parseInt(EMICalcVM.props.price);
    document.getElementById("downPayment").max = 0.7 * parseInt(EMICalcVM.props.price);
    document.getElementById("downPayment").value = EMICalcVM.props.downPayment;

    document.getElementById("loanAmount").min = 0.3 * parseInt(EMICalcVM.props.price);
    document.getElementById("loanAmount").max = 0.6 * parseInt(EMICalcVM.props.price);
    document.getElementById("loanAmount").value = EMICalcVM.props.loanAmount;

    document.getElementById("tenure").value = EMICalcVM.props.tenure;
    document.getElementById("interest").value = EMICalcVM.props.interest;
})();

/*     ------------------------------------   */
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
    // console.log(NotesVM["props"][changedProp]);
    if(changedProp == "noteFilter"){
        NotesVM.props.notesDisplayList = [];
        NotesVM.props.notesDisplayList = NotesVM.props.noteList.filter(function(item){
            return item.includes(NotesVM.props.noteFilter);
        })
    }
}

