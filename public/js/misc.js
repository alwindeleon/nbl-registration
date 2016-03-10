$(document).ready(function(){
  var addName = $('#addName');
  var addPrice = $('#addPrice');

  $('.save').click(function(){
    var name = $(this).parent().siblings(".name-holder").children('.name').text();
    var price = $(this).parent().siblings(".price-holder").children('.price').val();
    $.ajax({
      method: "PUT",
      url: "/miscfees",
      data: { name: name, price: price }
    })
    .done(function( msg ) {
      alert( msg );
    });

  });

  $('.delete').click(function(){
    var name = $(this).parent().siblings(".name-holder").children('.name').text();
    var price = $(this).parent().siblings(".price-holder").children('.price').val();
    $.ajax({
      method: "delete",
      url: "/miscfees",
      data: { name: name, price: price }
    })
    .done(function() {
      console.log("DELETED")
    });
    $(this).parent().parent().remove();
  });

  $('#add').click(function(){
    var name = addName.val();
    var price = addPrice.val();
    if(!name || !price) {
      alert("empty name or price");
      return;
    }
    addName.val('');
    addPrice.val('')
    $.ajax({
      method: "POST",
      url: "/miscfees",
      data: { 'name': name, 'price': price },
      dataType: "json"
    })
    .done(function( msg ) {
      alert( msg );
    });

    $('tbody').append(`<tr class="danger">
                        <td class="name-holder"><h6 class='name'>`+name+`</h6></td>
                        <td>
                          <input type="number" class ="price"value=`+price+` required>
                        </td>
                        <td>
                          <button class="btn btn-primary save">Save</button>
                        </td>
                        <td>
                          <button class="delete"><span class="glyphicon glyphicon-remove"></span></button>
                        </td>
                      </tr>`)
  });
});