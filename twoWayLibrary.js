const inputElementAttribute = "data-twb-input",
    outputElementAttribute = "data-twb-output";

function TWBinding(bindingElement){
    this.bindingElement = bindingElement;
    console.log(this.bindingElement.id);
    this.props = {};
}
TWBinding.prototype.setProps = function(props){
    this.props = props;  // set subProps here with isBound flag 
    return this;
};
TWBinding.prototype.bind = function(){
    // for each property in VM, assign setters and getters
    for(let prop in this.props)
    {
        this._initViewParams(prop);
        // add event listener to _prop.inputElement (if not null)
    }
    return this;
};
TWBinding.prototype._initViewParams = function(property){
    this[`_${property}`] = {
        inputElement : document.querySelector("#" + this.bindingElement.id +  " [" + inputElementAttribute + "='" + property + "']"),
        outputElements : document.querySelectorAll("#" + this.bindingElement.id +  " [" + outputElementAttribute + "='" + property + "']")
    };
}


/* 
    THINGS TO CHECK : 
    2. On page load find all input bindings and set _prop.inEle = ''
    3. Also find all ouput bindigs and set array -> _prop.outEle = []
    4. When input value changed, event listener -> change prop.value 
    5. when prop.value changed , forEach _prop.outEle set value in view 


*/




/*
For each VM -> one div container (scope limited)
If you wanna use somewhere else, explicitly mention VM name 
eg : data-twb-output="topCardVM.firstName" [NOTE : INPUT can only be within scope]

USAGE
data-twb-input="firstName"  view => JS
data-twb-ouput="firstName"  JS => view

event Listener (for input) should contain div container (to limit the scope)

COMPOUND OUTPUT
eg : Sanjay George -> <span data-twb-output="firstName lastName">
eg : Sanjay.George => <span data-twb-output="firstName.lastName">
eg : 24 + 36 = 60 => <span data-twb-output-"n1 + n2 = compute(n1+n2)"
compute keyword for math operations. directly computes value inside ()
If compute not used, everything considered as string
*/