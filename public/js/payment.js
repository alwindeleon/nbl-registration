$(document).ready(function(){
  var bill = $('#totalBill');
  $('input:checkbox').click(function(){
    if ($(this).is(':checked')) {
        var value = $(this).parents().siblings('.price').text();
        value = parseInt(value);
        bill.text(String(parseInt( bill.text() ) + value))
    } else {
        var value = $(this).parents().siblings('.price').text();
        value = parseInt(value);
        bill.text(String(parseInt( bill.text() ) - value))
    }
  })
});