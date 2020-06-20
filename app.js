

var initProps = {
    firstName : "s",
    lastName : "",
    randId : Math.round(Math.random() * 1000),
    firstName: "sanjay"
};

var TopcardVM = new TWBinding(document.getElementById("topcard"))
                        .bind(initProps);



