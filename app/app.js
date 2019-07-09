/*

 ### Basic Reqs
- [ ] Where to store data? (localstorage)
- [ ] How to modify data? (update action, delete action)

*/

//localStorage functions
var createItem = function(key, value) {
  return window.localStorage.setItem(key, value);
}

var updateItem = function(key, value) {
  return window.localStorage.setItem(key, value);
}

var deleteItem = function(key) {
  return window.localStorage.removeItem(key);
}

var clearDatabase = function() {
  return window.localStorage.clear();
}

var showDatabaseContents = function() {
  $('tbody').html('');

  for (var i = 0; i < window.localStorage.length; i++) {
    var key = window.localStorage.key(i);
    $('tbody').append(`<tr><td>${key}</td><td>${window.localStorage.getItem(key)}</td></tr>`)
  }
}

var keyExists = function(key) {
  return window.localStorage.getItem(key) !== null
}

var getKeyInput = function() {
  return $('.key').val();
}

var getValueInput = function() {
  return $('.value').val();
}

var resetInputs = function() {
  $('.key').val('');
  $('.value').val('');
}

var month = function() {
  var d = new Date();
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  return month[d.getMonth()];
}

var balance = function() {
  $('h3').html('');
  let cbalance = 0
  for (var i = 0; i < window.localStorage.length; i++) {
    var key = window.localStorage.key(i);
    var value = window.localStorage.getItem(key);
    value = value.replace(/[^0-9.-]/g, '');
    cbalance += +value;
  }
  $(`<h3>Current Balance: ${formatter.format(cbalance)}</h3>`).appendTo('.header');
}

var balanceDetails = function() {
  $('h5').html('');
  let increases = 0, decreases = 0;
  for (var i = 0; i < window.localStorage.length; i++) {
    var key = window.localStorage.key(i);
    var value = window.localStorage.getItem(key);
    value = value.replace(/[^0-9.-]/g, '');
    if (key !== 'Starting Balance' && value > 0){
      increases += +value;
    } else if (key !== 'Starting Balance' && value < 0){
      decreases += +value;
    }
  }
  $(`<h5>Credits: ${formatter.format(increases)} | Debits: ${formatter.format(decreases)}</h5>`).appendTo('.header');
}

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

var getUserName = function() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars.email.replace('%40', '@');
}

$(document).ready(function() {
  $(`<h1>FINANCR Report for ${month()}</h1>`).appendTo('.header');
  
  showDatabaseContents();
  balance();
  balanceDetails();

  $(`<p class='user'>${getUserName()}</p>`).appendTo('.header');

  $('.create').click(function() {
    if (getKeyInput() !== '' && getValueInput() !== '') {
      if (keyExists(getKeyInput())) {
        if(confirm('A transaction with this description already exists. Would you like to update instead?')) {
          updateItem(getKeyInput(), getValueInput());
          showDatabaseContents();
          balance();
          balanceDetails();
        }
      } else {
        createItem(getKeyInput(), getValueInput());
        showDatabaseContents();
        balance();
        balanceDetails();
        resetInputs();
      }
    } else  {
      alert('Please include a description and amount.');
    }
  });

  $('.update').click(function() {
    if (getKeyInput() !== '' && getValueInput() !== '') {
      if (keyExists(getKeyInput())) {
        updateItem(getKeyInput(), getValueInput());
        showDatabaseContents();
        balance();
        balanceDetails();
        resetInputs();
      } else {
        alert('This transaction can not be found.');
      }
    } else {
      alert('Please include a description and amount.');
    }
  });

  $('.delete').click(function() {
     if (getKeyInput() !== '') {
      if (keyExists(getKeyInput())) {
        deleteItem(getKeyInput());
        showDatabaseContents();
        balance();
        balanceDetails();
        resetInputs();
      } else {
        alert('This transaction can not be found.');
      }
    } else {
      alert('A description is required.');
    }
  });

  $('.reset').click(function() {
    resetInputs();
  })

  $('.clear').click(function() {
    if (confirm('WARNING: Are you sure you want to start tracking a new month? \n                THIS ACTION CANNOT BE UNDONE')) {
      clearDatabase();
      balance();
      balanceDetails();
      showDatabaseContents();
    }
  })

  $('.dropdown-menu').on('click', '.dropdown-item', function(event) {
    let value = $(this).text();
    let input = $('#desc-input');
    input.val(value);
  })
})