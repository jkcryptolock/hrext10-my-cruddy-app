/*

 ### Basic Reqs
- [ ] Where to store data? (localstorage)
- [ ] How to modify data? (update action, delete action)

*/

//localStorage functions
var createItem = function(key, value) {
  return window.localStorage.setItem(key, formatter.format(value.replace(/[^0-9.-]/g, '')));
};

var addToItem = function(key, value) {
  let cValue = window.localStorage.getItem(key);
  console.log(cValue)
  cValue = cValue.replace(/[^0-9.-]/g, '');
  let addValue = value.replace(/[^0-9.-]/g, '');
  console.log(addValue)
  let newValue = +cValue + +addValue; 
  console.log(newValue);
  return window.localStorage.setItem(key, formatter.format(newValue));
};

var updateItem = function(key, value) {
  return window.localStorage.setItem(key, formatter.format(value.replace(/[^0-9.-]/g, '')));
};

var deleteItem = function(key) {
  return window.localStorage.removeItem(key);
};

var clearDatabase = function() {
  return window.localStorage.clear();
};

var showDatabaseContents = function() {
  $('tbody').html('');

  for (var i = 0; i < window.localStorage.length; i++) {
    var key = window.localStorage.key(i);
    $('tbody').append(`<tr><td>${key}</td><td>${window.localStorage.getItem(key)}</td></tr>`)
  }
};

var keyExists = function(key) {
  return window.localStorage.getItem(key) !== null
};

var getKeyInput = function() {
  return $('.key').val();
};

var getValueInput = function() {
  return $('.value').val();
};

var resetInputs = function() {
  $('.key').val('');
  $('.value').val('');
};

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
};

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
};

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
};

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
};



$(document).ready(function() {
  $(`<h1>FINANCR Report for ${month()}</h1>`).appendTo('.header');

  showDatabaseContents();
  balance();
  balanceDetails();

  $(`<li class="nav-item"><a class="nav-link" href="#">${getUserName()}</a></li>`).appendTo('.navbar-nav');

  $('.create').click(function() {
    if (getKeyInput() !== '' && getValueInput() !== '') {
      if (keyExists(getKeyInput())) {
        addToItem(getKeyInput(), getValueInput());
        showDatabaseContents();
        balance();
        balanceDetails();
        resetInputs();
      } else {
        console.log('wut')
        createItem(getKeyInput(), getValueInput());
        showDatabaseContents();
        balance();
        balanceDetails();
        resetInputs();
      }
    }
       else  {
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
        alert('This transaction description can not be found.');
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
        alert('This transaction description can not be found.');
      }
    } else {
      alert('A description is required.');
    }
  });

  $('.reset').click(function() {
    resetInputs();
  });

  $('.clear').click(function() {
    let cbalance = 0
    for (var i = 0; i < window.localStorage.length; i++) {
    var key = window.localStorage.key(i);
    var value = window.localStorage.getItem(key);
    value = value.replace(/[^0-9.-]/g, '');
    cbalance += +value;
    }
    if (confirm('WARNING: Are you sure you want to start tracking a new month? \n                THIS ACTION CANNOT BE UNDONE')) {
      clearDatabase();
      window.localStorage['Starting Balance'] = formatter.format(cbalance);
      balance();
      balanceDetails();
      showDatabaseContents();
    }
  });

  $('.dropdown-menu').on('click', '.dropdown-item', function(event) {
    let value = $(this).text();
    let input = $('#desc-input');
    input.val(value);
  });

            
  $('#exampleModal').on('shown.bs.modal', function (e) {

      let obj = {};
      let array = [];

      for (var i = 0; i < window.localStorage.length; i++) {
        var key = window.localStorage.key(i);
        var value = window.localStorage.getItem(key);
        value = value.replace(/[^0-9.-]/g, '');
        if (!obj[key]) {
          obj[key] = +value;
        } else {
          obj[key] += +value;
        }
      }

      for (var key in obj) {
        if (key !== 'Starting Balance' && key !== 'Deposits'){
                  array = array.concat([[key, obj[key]]]);
                }
      }

      var chart = c3.generate({
      bindto: "#chart",
      donut: {
        label: {
          format: function(value){
            return formatter.format(value);
          }
        },
        title: 'Spending Summary'
      },
      data: {
        // iris data from R
        columns: array,
        type : 'donut'
      }
      });
  
  }); 

});