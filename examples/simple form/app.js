var initProps = {
    firstName : "",
    lastName : "",
    randId : Math.round(Math.random() * 1000)
};

var TopcardVM = new TWBinding(document.getElementById("topcard"))
                        .bind(initProps);

