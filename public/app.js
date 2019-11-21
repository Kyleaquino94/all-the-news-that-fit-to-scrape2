$.ajax({
    method: "GET",
    url: "/api/all/articles/"
}).then(data => {
    data.forEach(element => {
        $("#articles").prepend("<div data-id='" + element._id + "' class='article'><li class='list-group-item' data-id='" + element._id + "'>" + element.title + "</li><div class='card-body'><button class='btn btn-outline-danger delete text-right' data-id='" + element._id + "'>Delete</button> <a class='float-right link btn btn-outline-primary' target='_blank' href='" + checkUrl(element) + "'>View Source</a></div></div>");
    });
});

$(document).on("click", "#clear-button", function() {
    console.log("you deleted everything");
    $.ajax({
        method: "DELETE",
        url: "/api/all/articles"
    }).then(data => {
        location.reload();
    });
});

$(document).on("click", ".delete", function () {
    var id = $(this).attr('data-id'); 
    console.log(id);
    $.ajax({
        method: "DELETE",
        url: "/api/article/" + id
    }).then(data => {
        location.reload();
    });
});

$(document).on("click", ".article", function () {
    $(".note").empty();
    var id = $(this).data("id"); 
    console.log(id);
    $.ajax({
        method: "GET",
        url: "/api/article/" + id
    }).then(function (data) {
        // put data.title in the card-body
        // console.log(data);
        $(".note").append("<p class='card-text'>" + data.title + "</p>");
        $(".note").append("<form><div class='form-group'><label for='exampleInputText'>Title</label><input type='text' class='form-control' id='noteTitle' placeholder='Note Title'></div><div class='form-group'><label for='exampleFormControlTextarea1'>Body</label><textarea class='form-control' id='noteBody' rows='3' placeholder='Body'></textarea></div><button type='submit' class='btn btn-primary text-center' id='note-submitBtn' data-id='" + data._id + "'>Submit</button><button type='submit' class='btn btn-danger text-center' id='note-deleteBtn' data-id='" + data._id + "'>Delete</button></form>");
    }).then( () => {
        $.ajax({
            method: "GET",
            url: "/api/articleNote/" + id
        }).then(data => {
            // console.log(data);
            $("#noteTitle").val(data.note.title);
            $("#noteBody").val(data.note.body);
        });
    });
});

$(document).on("click", "#note-submitBtn", function (e) {
    e.preventDefault();
    var id = $(this).data("id");
    console.log(id);
    $.ajax({
        method: "POST", 
        url: "/api/articleNote/" + id,
        data: {
            title: $("#noteTitle").val(),
            body: $("#noteBody").val()
        }
    }).then(data => {
        // console.log(data);
        //location.reload();
    });
});

$(document).on("click", "#note-deleteBtn", function (e) {
    e.preventDefault();
    var id = $(this).data("id");
    // console.log(id);
    $.ajax({
        method: "DELETE", 
        url: "/api/note/" + id
    }).then(data => {
        // console.log(data);
        location.reload();
    });
});

function checkUrl(url) {
    var split = (url.link).split("//");
    if (split[0] === "https:") {
        return url.link
    }
    else {
        return "https://echojs.com" + (url.link).toString(); 
    }
}
