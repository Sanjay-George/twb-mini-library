# TWB - Two-way binding mini library in vanilla JS

TWB is a **simple**, yet **powerful** mini library for two-way data binding -- to update view (HTML) when data updates and to update data (JS) when the view updates. 

## Why use this?
TWB was built on two simple thoughts:
1. **Keep it simple** - The library should be helpful to anyone with a very basic understanding of Javascript, and shouldn't have a syntax that creates a substantial learning curve. (take [knockoutJS](https://knockoutjs.com/) for example)
2. **Power in your hands** - The library should be powerful enough to support the most common, as well as complicated components. Better yet, give the power to the devs instead of determining what's best for them. 

**NOTE**: This mini library was never meant to replace libraries like React, Vue or Angular. It's just a quick headstart in implementing two-way data binding into your application, if you don't use any of the aforementioned libs. 

***Checkout the examples in index.html to see what this lib is capable of. There's a simple welcome form, EMI Calculator, and a note-taking app with note filter***

## How to use?
Here's a simple example of a basic form, that takes `firstName` and `lastName` as input, and displays a welcome message of the form `Welcome firstName lastName!`.

**HTML**

``` HTML
<div id="welcomeForm" class="margin-bottom50">
    <h2>BASIC FORM</h2>

    <label for="fname">First name:</label>
    <input type="text" id="fname" name="fname" data-twb-input="firstName">

    <label for="fname">Last name:</label>
    <input type="text" id="sname" name="sname" data-twb-input="lastName">

    <p>Welcome <span data-twb-output="firstName"></span> <span data-twb-output="lastName"></span>!</p>
</div>
 ```
 
***NOTE: `data-twb-input` and `data-twb-output` data-attr are used for input (HTML to JS) and output (JS to HTML) data bindings.***

**JS**
1. For every component, create a simple object with all the required properties. For the above exmaple, we need `firstName` and `lastName` properties and hence they are initialized in `initProps` object. 

```javascript
var initProps = {
    firstName : "", 
    lastName : ""
};
```
2. Create an instance of `TWBinding()` and pass in the parent element in the constructor. Call the `bind()` method by passing in `initProps` as shown below.
```javascript
var TopcardVM = new TWBinding(document.getElementById("welcomeForm"))
                  .bind(initProps);
```
**AND THAT'S IT! YOUR TWO-WAY BINDING FORM WOULD'VE STARTED WORKING!!** 

*Do note, that the props inside `initProps` are set to `TopcardVM.props`. Check out TopcardVM in console to get a better understanding.*

## Powerful? How?!
The powerful part of this library is the ability to pass a callback method, that gets called with one parameter `changedProp` - which tells us which property got changed.

```javascript
var initProps = {
    firstName : "",
    lastName : ""
};
var TopcardVM = new TWBinding(document.getElementById("welcomeForm"))
                        .bind(initProps)
                        .setCallback(myCustomCallback);
function myCustomCallback(changedProp){
  // changedProp - eg : "firstName"
  // TopcardVM["props"][changedProp] - eg: "John"
}
```
