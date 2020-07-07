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
        }
    }
};
TWBinding.prototype._updateArrayInView = function(self, property, outputElement){
        var listItemTemplate = self["metas"][getInnerProperty(property)]["listItemTemplate"]; 

        outputElement.innerHTML = "";
        
        self["props"][property].forEach(function(listItem){
            var listItemNew =  document.createElement(listItemTemplate.nodeName);
            listItemNew.innerText = listItem;
            listItemNew.classList = listItemTemplate.classList;
            for(var i = 0; i < listItemTemplate.attributes.length; i++){
                listItemNew.setAttribute(listItemTemplate.attributes[i].name, listItemTemplate.attributes[i].value);
            }
            outputElement.appendChild(listItemNew);
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



