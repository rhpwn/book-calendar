var BookCalendar = function(options) {

  this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Semptember', 'October', 'November', 'December'];
  this.days = ['Sunday', 'Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday'];

  this.daysCount = options.daysCount ? options.daysCount : 7;
  this.el = options.el;
  this.data = options.data;

  this.moveOnExisting = options.moveOnExisting;

  this.step = options.step ? options.step : 1;

  this.startDate = options.startDate ? options.startDate : new Date();


  this.minDate = options.minDate ? options.minDate : new Date();


  this.onMoveLeft =  options.onMoveLeft ? options.onMoveLeft : function(callback) {
    callback();
  };

  this.onMoveRight = options.onMoveRight ? options.onMoveRight :  function(callback) {
    callback();
  };

  this.cellPercentsWidth =  (100 / this.daysCount).toFixed(2);

  this.getStartDate = function() {
    return new Date(this.startDate);
  };

  this.getEndDate = function() {
    var ino = new Date(this.startDate);
    ino.setDate(ino.getDate() + this.daysCount - 1);
    return new Date(ino);
  };

  this.init = function() {
    var template = '<div class="book-calendar-wrapper"><table width="100%" class="book-calendar-main-container"> <tr> <td> <table class="book-calendar-header"> <thead> <tr class="book-calendar-months"><a href="#" class="nav-arrow book-calendar-prev"></a><a href="#" class="nav-arrow book-calendar-next"></a></tr><tr class="book-calendar-days"> </tr></thead> </table> </td></tr><tr> <td> <div class="book-calendar-data-container"> <table width="100%"> <tbody class="book-calendar-data"> </tbody> </table> </div></td></tr></table></div>';
    var container = document.getElementById(this.el);
    container.innerHTML = template;
    this.draw();
  };

  this.getKeyElements = function() {
    var container = document.getElementById(this.el);
    return {
      element: this.el,
      firstTableCells: container.getElementsByClassName('book-calendar-day'),
      secondTableCells: container.getElementsByClassName('book-calendar-cell'),
      dataContainer: container.getElementsByClassName('book-calendar-data')[0],
      monthsContainer: container.getElementsByClassName('book-calendar-months')[0],
      daysContainer: container.getElementsByClassName('book-calendar-days')[0],
      nextButton: container.getElementsByClassName('book-calendar-next')[0],
      prevButton: container.getElementsByClassName('book-calendar-prev')[0],
      activeCells: container.getElementsByClassName('book-calendar-cell-active' + this.el)
    }
  };

  this.groupHoursByDay = function(dates) {
    var obj = dates.reduce(function(acc, d) {
      var pk = new Date(d);
      pk.setHours(0,0,0,0);
      var p = pk.toString();
      if (!acc[0].hasOwnProperty(p)) acc[0][p] = [];
      acc[0][p].push(d);
      return acc;
    },[{}])
    .reduce(function(acc, v){
      Object.keys(v).forEach(function(k){acc.push({day:k, times:v[k]})});
      return acc;
    },[]);
    return obj;
  };

  this.getHoursByDate =  function(date) {
    date.setHours(0,0,0,0);
    var dates = this.groupHoursByDay(this.data);
    for(var i in dates) {
      var day = new Date(dates[i].day);
      if(day.getTime() == date.getTime()) {
        return dates[i].times.sort();
      }
    }
    return [];
  };

  this.moveExistingLeft = function() {
    var sd = new Date(this.startDate);
    sd.setHours(0,0,0,0);

    var dd = this.data;;

    var collectedDates = [];
    for(var i in dd) {
      var da = new Date(dd[i]).setHours(0,0,0,0);
      if(da.getTime() < sd.getTime()) {
        collectedDates.push(da);
      }
    }
    collectedDates.sort();

    if(collectedDates.length > 0)
    this.startDate = collectedDates.pop();

    this.draw();
    this.onMoveLeft(function() {});
  },

  this.moveExistingRight = function() {
    var sd = new Date(this.startDate);
    sd.setHours(0,0,0,0);
    var dd = this.data;

    var collectedDates = [];
    for(var i in dd) {
      var da = new Date(dd[i]).setHours(0,0,0,0);
      if(da.getTime() > sd.getTime()) {
        collectedDates.push(da);
      }
    }
    collectedDates.sort();

    if(collectedDates.length > 0)
    this.startDate = collectedDates[0];

    this.draw();
    this.onMoveRight(function() {});
  },

  this.moveLeft = function(step) {
    var ms = step ? step : this.step;
    this.startDate.setDate(this.startDate.getDate() - parseInt(ms));
    this.draw();
    this.onMoveLeft(function() {
    });
  };

  this.moveRight = function(step) {
    var ms = step ? step : this.step;
    this.startDate.setDate(this.startDate.getDate() + parseInt(ms));
    this.draw();
    this.onMoveRight(function() {
    });
  };

  this.prevDisabled = function(disabled) {
    var keyElements = this.getKeyElements();
    keyElements.prevButton.disabled = disabled;
  };

  this.getDisplayDates = function() {
    var today = new Date(this.startDate);
    var displayArray = new Array();
    for(var dd = 0; dd < this.daysCount; dd ++) {
      var x = new Date(today);
      displayArray.push(x);
      today.setDate(today.getDate() + 1);
    }
    return displayArray;
  };

  this.getMonth = function(n) {
    return this.months[n];
  };

  this.getDay = function(n) {
    return this.days[n];
  };

  this.getMaxInputs = function() {
    var max = 0;
    var gData = this.groupHoursByDay(this.data);
    for(var i in gData) {
      if(gData[i].times.length > max) max = gData[i].times.length;
    }
    return max;
  };

  this.getHead = function() {
    var startMonth = this.startDate.getMonth();
    var displayDates = this.getDisplayDates();

    var colspans = {
      first: 0,
      second: 0,
    }
    colspans.firstMonth = this.getMonth(startMonth).substring(0, 3) + " " + this.startDate.getFullYear();
    var ix = 0;
    for(var i in displayDates) {
      if(displayDates[i].getMonth() == startMonth) {
        colspans.first ++ ;
        colspans.lastMonth = this.getMonth(startMonth).substring(0, 3) + " " + displayDates[i].getFullYear();
      } else {
        colspans.second ++ ;
        var sm = startMonth;
        if(sm > 11) sm = 0;
        var fm = sm + 1;
        if(fm == 12) fm = 0;
        colspans.lastMonth = this.getMonth(fm).substring(0, 3) + " " + displayDates[i].getFullYear();
      }
    }
    return colspans;
  };

  this.addListeners = function() {
    var self = this;
    var keyElements = this.getKeyElements();
    var classname = document.getElementsByClassName("book-calendar-cell-active-" + self.el);
    var listenerFunction = function() {
      for(var i=0;i<classname.length;i++) {
        classname[i].className = 'book-calendar-cell-active book-calendar-cell-active-' + self.el;
      }
      this.className = this.className + " book-calendar-cell-active-selected";
      self.selectedDate = new Date(this.dataset.date);
      self.onSelect(self.selectedDate);
    };
    for(var i = 0; i < classname.length; i++){
      classname[i].addEventListener('click', listenerFunction, false);
    }
    self = this;
    keyElements.prevButton.onclick = function() {
      if(self.moveOnExisting) {
        self.moveExistingLeft()
      } else {
        self.moveLeft();
      }
    };
    keyElements.nextButton.onclick = function() {
      if(self.moveOnExisting) {
        self.moveExistingRight()
      } else {
        self.moveRight();
      }
    };
  },

  this.onSelect =  options.onSelect ? options.onSelect : function(selectedDate) {
    return selectedDate;
  };

  this.afterDraw =  options.afterDraw ? options.afterDraw : function(callback) {
    callback();
  };

  this.draw = function() {
    var keyElements = this.getKeyElements();
    if(keyElements.dataContainer && keyElements.monthsContainer && keyElements.daysContainer && keyElements.nextButton && keyElements.prevButton) {
      var displayArray = this.getDisplayDates();
      var colspans = this.getHead();
      var dt = '';
      var lastCell = '';
      for(var i in displayArray) {
        var nextDay = new Date(displayArray[i]);
        nextDay.setDate(nextDay.getDate() + 1);
        if(displayArray[i].getMonth() != nextDay.getMonth()) {
          lastCell = "book-calendar-cell-last";
        } else {
          lastCell = '';
        }
        dt += '<td  style="width: ' + this.cellPercentsWidth + '%" class="book-calendar-day ' + lastCell + '">' + displayArray[i].getDate()  + '<br><span class="book-calendar-day-name">' + this.getDay(displayArray[i].getDay()).substring(0, 2) + '</span></td>';
      }
      var thead = '';
      if(colspans.first > 0) {
        thead += '<th style="width: ' + this.cellPercentsWidth + '%" colspan="' + colspans.first + '"> ' + colspans.firstMonth + ' </th>';
      }
      if(colspans.second > 0) {
        thead += '<th colspan="' + colspans.second + '"> ' + colspans.lastMonth + ' </th>';
      }
      keyElements.daysContainer.innerHTML = dt;
      keyElements.monthsContainer.innerHTML = thead;
      var dataText = '';
      var displayDates = this.getDisplayDates();

      var dc = this.daysCount - 1;
      for(var i = 0; i < this.getMaxInputs(); i++) {
        dataText += '<tr>';
        for(var j = 0; j <= dc ; j++) {
          var hours = this.getHoursByDate(displayDates[j]);
          var cellActive = '';
          if(hours[i]) {
            var display = new Date(hours[i]);
            var displayHours = display.getHours() + ":" + (display.getMinutes()<10 ? '0' : '') + display.getMinutes();

            cellActive = "book-calendar-cell-active book-calendar-cell-active-" + this.el;

            var nextDay = new Date(display);
            nextDay.setDate(nextDay.getDate() + 1);
            if(display.getMonth() != nextDay.getMonth()) {
              cellActive += " book-calendar-cell-last";
            }

            if(this.selectedDate) {
              var tempDate = new Date(this.selectedDate);

              //TODO: do this with getTime();
              if(display.getFullYear() == this.selectedDate.getFullYear() && display.getMonth() == this.selectedDate.getMonth() && display.getDate() == this.selectedDate.getDate() && display.getHours() == this.selectedDate.getHours() && display.getMinutes() == this.selectedDate.getMinutes()) {
                cellActive += " book-calendar-cell-active-selected";
              }
            }

          } else {
            displayHours = '&nbsp;';
            cellActive = "book-calendar-cell-disabled";
          }
          dataText += '<td style="width: ' + this.cellPercentsWidth+ '%" data-date="' + display + '" class="book-calendar-cell ' + cellActive + '"> ' + displayHours + ' </td>';
        }
        dataText += '</tr>';
      }
      keyElements.dataContainer.innerHTML = dataText;
      this.addListeners();
    } else {
      console.log('Error. Key elements not found!');
    }

    var ms = this.step;
    var cd = new Date(this.minDate);
    var csd = new Date(this.startDate);

    if(csd.getTime() > cd.getTime()) {
      this.prevDisabled(false);
    } else {
      this.prevDisabled(false);
    }

    this.afterDraw(function() {});
  };
  return this.init();
};
