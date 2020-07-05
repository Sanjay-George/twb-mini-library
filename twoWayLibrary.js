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
        var isListItem = false;

        if(Array.isArray(props[prop]))
        {
            console.log("THIS ONE IS AN ARRAY" + props[prop]);
            isListItem = true;
        }
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
        this._initializeMetas(prop, isListItem);
        this['props'][prop] = props[prop];

        this._attachEventListener(prop); 
    }

    return this;
};
TWBinding.prototype.setCallback = function(methodName){
    this.callback = methodName;
    return this;
};

TWBinding.prototype._updateValueInView = function(property, value){
    var innerProperty = getInnerProperty(property);
    var self = this;  // todo :  CHECK IF THIS IS REQUIRED 
    var viewElements = this['metas'][innerProperty].outputElements;

    for(var i = 0 ; i < viewElements.length; i++){
        if(Array.isArray(self["props"][property])){
            this._updateArrayInView(self, property, viewElements[i]); 
            continue; 
        }

        if(this["props"][property] != undefined){
            viewElements[i].innerText = this["props"][property];
            // TODO : IF TEMPLATING TO BE IMPLEMENTED, CONSIDER BELOW
            // var format = viewElements[i].dataset.twbOutput;
            // viewElements[i].innerText = format.replace(property, eval("this.props." + property));  
        }

        // "firstName lastName"  => prop : fistName  , innerText
        // search and replace `property` with VM.props.property 
        // set innerText to data-attr value 
        // check if any var is undefined then don't display

    }

};
TWBinding.prototype._updateArrayInView = function(self, property, outputElement){
        var ul = outputElement;
        var listItemTemplate = self["metas"][getInnerProperty(property)]["listItemTemplate"]; 

        outputElement.innerHTML = "";
        
        self["props"][property].forEach(function(listItem){
            var listItemNew =  document.createElement("LI"); 
            listItemNew.classList = listItemTemplate.classList;
            listItemNew.dataset = listItemTemplate.dataset;
            listItemNew.innerText = listItem;
            ul.appendChild(listItemNew);
        })           
};
TWBinding.prototype._initializeMetas = function(property, isListItem){
    var metas = {
        inputElement : document.querySelector("#" + this.bindingElement.id +  " [" + inputElementAttribute + "='" + property + "']"),
        outputElements : Array.from(document.querySelectorAll("#" + this.bindingElement.id +  " [" + outputElementAttribute + "*='" + property + "']")),
    };

    // EXACT MATCH (to avoid multiple properties with almost same letters (eg : note, noteList))
    metas.outputElements = metas.outputElements.filter(function(item ){ return item.dataset.twbOutput == property});

    // SET LIST ITEM TEMPLATE FOR ARRAY PROPS
    if(isListItem && metas.outputElements.length > 0){
        var firstChild = metas.outputElements[0].firstElementChild;
        metas.listItemTemplate = firstChild;
        metas.outputElements[0].removeChild(firstChild);
    }

    this['metas'][getInnerProperty(property)] = metas;
    
};

TWBinding.prototype._attachEventListener = function(property){
    var innerProperty = getInnerProperty(property);
    var self = this;
    var inputElement = this['metas'][innerProperty].inputElement;
    if(inputElement !== null){
        inputElement.addEventListener(getEventListenerByInputType(inputElement.type), function(e){
            self["props"][property] = e.target.value;

            if(self.callback !== undefined){
                self.callback(property);
            }
        })
    }
};

function getEventListenerByInputType(inputType){
    switch(inputType){
        case "text":
            return "keyup";
        case "range":
            return "input";
        default:
            return "keyup";
    }
}

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