const inputElementAttribute = "data-twb-input",
    outputElementAttribute = "data-twb-output";

function TWBinding(bindingElement){
    this.bindingElement = bindingElement;
    this.props = {};
}
TWBinding.prototype.bind = function(props){
    this.metas = {};
    var self = this;

    for(let prop in props){    
        let value;
        Object.defineProperty(this.props, prop, {
            get: function() { 
                return value; 
            },
            set: function(newValue) { 
                value = newValue;
                self._updateValueInView(prop, value) 
            },
            enumerable: true
        });
        this._initializeMetas(prop);
        this['props'][prop] = props[prop];

        this._attachEventListener(prop); 
    }

    return this;
};

TWBinding.prototype._updateValueInView = function(property, value){
    var innerProperty = getInnerProperty(property);
    var self = this;
    var viewElements = this['metas'][innerProperty].outputElements;
    for(var i = 0 ; i < viewElements.length; i++){
        
        var format = viewElements[i].dataset.twbOutput;

        if(this["props"][property] != undefined){
            viewElements[i].innerText = format.replace(property, eval("this.props." + property));
        }
        // console.log(viewElements[i]);

        // "firstName lastName"  => prop : fistName  , innerText
        // search and replace `property` with VM.props.property 
        // set innerText to data-attr value 
        // check if any var is undefined then don't display

    }

};
TWBinding.prototype._initializeMetas = function(property){
    this['metas'][getInnerProperty(property)] = {
        inputElement : document.querySelector("#" + this.bindingElement.id +  " [" + inputElementAttribute + "='" + property + "']"),
        outputElements : document.querySelectorAll("#" + this.bindingElement.id +  " [" + outputElementAttribute + "*='" + property + "']")
    };
};
TWBinding.prototype._attachEventListener = function(property){
    var innerProperty = getInnerProperty(property);
    var self = this;
    if(this['metas'][innerProperty].inputElement !== null){
        // TODO : check type of input and add corresponding event listener
        this['metas'][innerProperty].inputElement.addEventListener("keyup", function(e){
            self["props"][property] = e.target.value;
            // console.log(property, self["props"][property]);
        })
    }
};

function getInnerProperty(property){
    return "_" + property;
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