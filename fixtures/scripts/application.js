var someFunction = function() {
  $.ajax({
    url: 'someurl',
    type:"POST",
    data:data,
    contentType:"application/json; charset=utf-8",
    dataType:"json",
    success: function(){}
  })
}
