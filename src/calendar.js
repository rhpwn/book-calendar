var BookCalendar = function(options) {

  this.locale = options.locale ? options.locale : 'en';

  this.daysCount = options.daysCount ? options.daysCount : 7;

  this.el = options.el;

  this.data = options.data;

  this.dateGroup = null;

  this.moveOnExisting = options.moveOnExisting;

  this.step = options.step ? options.step : 1;

  this.startDate = options.startDate ? options.startDate : new Date();


  this.minDate = options.minDate ? options.minDate : new Date();


  this.onMoveLeft = options.onMoveLeft ? options.onMoveLeft : function(callback) {
    callback();
  };

  this.onMoveRight = options.onMoveRight ? options.onMoveRight : function(callback) {
    callback();
  };

  this.cellPercentsWidth = (100 / this.daysCount).toFixed(2);

  this.getLocale = function() {
    if (!this.language || this.language.locale != this.locale) {
      this.language = {
        locale: 'ro',
        months: 'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split('_'),
        monthsShort: 'ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split('_'),
        weekdays: 'duminică_luni_marți_miercuri_joi_vineri_sâmbătă'.split('_'),
        weekdaysShort: 'Du_Lu_Ma_Mi_Jo_Vi_Sa'.split('_')
      };
    }
    return this.language;
  };

  this.getStartDate = function() {
    return new Date(this.startDate);
  };

  this.getEndDate = function() {
    var ino = new Date(this.startDate);
    ino.setDate(ino.getDate() + this.daysCount); // this.daysCount - 1 (not tested)
    return new Date(ino);
  };

  this.init = function() {
    var template = '<div class="book-calendar-wrapper"><table width="100%" class="book-calendar-main-container"> <tr> <td> <table class="book-calendar-header"> <thead> <tr class="book-calendar-months"><button style="border: none;" class="nav-arrow book-calendar-prev"></button><button style="border: none;" class="nav-arrow book-calendar-next"></button></tr><tr class="book-calendar-days"> </tr></thead> </table> </td></tr><tr> <td> <div class="book-calendar-data-container"> <table width="100%"> <tbody class="book-calendar-data"> </tbody> </table> </div></td></tr></table></div>';
    var container = document.getElementById(this.el);
    container.innerHTML = template;
    this.dateGroup = this.groupHoursByDay(this.data);
    this.draw();
  };

  this.getKeyElements = function() {
    var container = document.getElementById(this.el);
    return {
      element: this.el,
      container: container,
      calendarWrapper: container.getElementsByClassName('book-calendar-wrapper')[0],
      dataContainer: container.getElementsByClassName('book-calendar-data')[0],
      monthsContainer: container.getElementsByClassName('book-calendar-months')[0],
      daysContainer: container.getElementsByClassName('book-calendar-days')[0],
      nextButton: container.getElementsByClassName('book-calendar-next')[0],
      prevButton: container.getElementsByClassName('book-calendar-prev')[0],
      activeCells: container.getElementsByClassName('book-calendar-cell-active' + this.el)
    };
  };

  this.getDate = function(timestamp) {
    var date = new Date(timestamp);
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth();
    var day = date.getUTCDate();
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    month = (month < 10) ? '0' + month : month;
    day = (day < 10) ? '0' + day : day;
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
  }

  this.groupHoursByDay = function(dates) {
    var dob = {};
    for(var i in dates) {
      var day = new Date(dates[i]);
      day.setHours(day.getHours() + (day.getTimezoneOffset() / 60));
      day.setHours(0,0,0,0);
      if (!dob.hasOwnProperty(day)) {
        dob[day] = [];
      }
      dob[day].push(new Date(dates[i]));
    }
    var obj = _.map(dob, function(group, day) {
      return {
        day: day,
        times: group
      }
    });
    return obj;
  };

  this.getHoursByDate = function(date) {
    date.setHours(0, 0, 0, 0);
    var dates = this.dateGroup;
    for (var i in dates) {
      var day = new Date(dates[i].day);
      // console.log("?????");
      // console.log(day);
      // console.log("?????");
      if (day.getTime() == date.getTime()) {
        var times = dates[i].times.sort();
        return times;
      }
    }
    return [];
  };

  this.moveExistingLeft = function() {
    var sd = new Date(this.startDate);
    sd.setHours(0, 0, 0, 0);

    var dd = this.data;

    var collectedDates = [];
    for (var i in dd) {
      var da = new Date(dd[i]).setHours(0, 0, 0, 0);
      if (da.getTime() < sd.getTime()) {
        collectedDates.push(da);
      }
    }
    collectedDates.sort();

    if (collectedDates.length > 0)
      this.startDate = collectedDates.pop();

    this.draw();
    this.onMoveLeft(function() {});
  };

  this.moveExistingRight = function() {
    var sd = new Date(this.startDate);
    sd.setHours(0, 0, 0, 0);
    var dd = this.data;

    var collectedDates = [];
    for (var i in dd) {
      var da = new Date(dd[i]).setHours(0, 0, 0, 0);
      if (da.getTime() > sd.getTime()) {
        collectedDates.push(da);
      }
    }
    collectedDates.sort();

    if (collectedDates.length > 0)
      this.startDate = collectedDates[0];

    this.draw();
    this.onMoveRight(function() {});
  };

  this.moveLeft = function(step) {
    var ms = step ? step : this.step;
    this.startDate.setDate(this.startDate.getDate() - parseInt(ms));
    this.draw();
    this.onMoveLeft(function() {});
  };

  this.moveRight = function(step) {
    var ms = step ? step : this.step;
    this.startDate.setDate(this.startDate.getDate() + parseInt(ms));
    this.draw();
    this.onMoveRight(function() {});
  };

  this.prevDisabled = function(disabled) {
    var keyElements = this.getKeyElements();
    keyElements.prevButton.disabled = disabled;
  };

  this.getDisplayDates = function() {
    var today = new Date(this.startDate);
    var displayArray = [];
    for (var dd = 0; dd < this.daysCount; dd++) {
      var x = new Date(today);
      displayArray.push(x);
      today.setDate(today.getDate() + 1);
    }
    return displayArray;
  };

  this.getMonth = function(n) {
    return {
      long: this.getLocale().months[n].charAt(0).toUpperCase() + this.getLocale().months[n].slice(1),
      short: this.getLocale().monthsShort[n].charAt(0).toUpperCase() + this.getLocale().monthsShort[n].slice(1),
    };
  };

  this.getDay = function(n) {
    return {
      long: this.getLocale().weekdays[n],
      short: this.getLocale().weekdaysShort[n],
    };
  };

  this.getMaxInputs = function() {
    var max = 0;
    var gData = this.dateGroup;
    for (var i in gData) {
      if (gData[i].times.length > max) max = gData[i].times.length;
    }
    return max;
  };

  this.getHead = function() {
    var startMonth = this.startDate.getMonth();
    var displayDates = this.getDisplayDates();

    var colspans = {
      first: 0,
      second: 0,
    };
    colspans.firstMonth = this.getMonth(startMonth).short + " " + this.startDate.getFullYear();
    var ix = 0;
    for (var i in displayDates) {
      if (displayDates[i].getMonth() == startMonth) {
        colspans.first++;
        colspans.lastMonth = this.getMonth(startMonth).short + " " + displayDates[i].getFullYear();
      } else {
        colspans.second++;
        var sm = startMonth;
        if (sm > 11) sm = 0;
        var fm = sm + 1;
        if (fm == 12) fm = 0;
        colspans.lastMonth = this.getMonth(fm).short + " " + displayDates[i].getFullYear();
      }
    }
    return colspans;
  };

  this.addListeners = function() {
    var self = this;
    var keyElements = this.getKeyElements();
    var classname = document.getElementsByClassName("book-calendar-cell-active-" + self.el);
    var listenerFunction = function() {
      for (var i = 0; i < classname.length; i++) {
        classname[i].className = 'book-calendar-cell-active book-calendar-cell-active-' + self.el;
      }
      this.className = this.className + " book-calendar-cell-active-selected";
      self.selectedDate = new Date(this.dataset.date);
      self.onSelect(self.selectedDate);
    };
    for (var i = 0; i < classname.length; i++) {
      classname[i].addEventListener('click', listenerFunction, false);
    }
    self = this;
    keyElements.prevButton.onclick = function() {
      if (self.moveOnExisting) {
        self.moveExistingLeft();
      } else {
        self.moveLeft();
      }
    };
    keyElements.nextButton.onclick = function() {
      if (self.moveOnExisting) {
        self.moveExistingRight();
      } else {
        self.moveRight();
      }
    };
  };

  this.onSelect = options.onSelect ? options.onSelect : function(selectedDate) {
    return selectedDate;
  };

  this.afterDraw = options.afterDraw ? options.afterDraw : function(callback) {
    callback();
  };

  this.draw = function() {
    var keyElements = this.getKeyElements();
    if (keyElements.dataContainer && keyElements.monthsContainer && keyElements.daysContainer && keyElements.nextButton && keyElements.prevButton) {
      var displayArray = this.getDisplayDates();
      var colspans = this.getHead();
      var dt = '';
      var lastCell = '';

      for (var i in displayArray) {
        var nextDay = new Date(displayArray[i]);
        nextDay.setDate(nextDay.getDate() + 1);
        if (displayArray[i].getMonth() != nextDay.getMonth()) {
          lastCell = "book-calendar-cell-last";
        } else {
          lastCell = '';
        }
        dt += '<td  style="width: ' + this.cellPercentsWidth + '%" class="book-calendar-day ' + lastCell + '">' + (displayArray[i].getDate() < 10 ? '0' : '') + displayArray[i].getDate() + '<br><span class="book-calendar-day-name">' + this.getDay(displayArray[i].getDay()).short + '</span></td>';
      }
      var thead = '';
      if (colspans.first > 0) {
        thead += '<th colspan="' + colspans.first + '"> ' + colspans.firstMonth + ' </th>';
      }
      if (colspans.second > 0) {
        thead += '<th colspan="' + colspans.second + '"> ' + colspans.lastMonth + ' </th>';
      }
      keyElements.daysContainer.innerHTML = dt;
      keyElements.monthsContainer.innerHTML = thead;
      var dataText = '';
      var displayDates = this.getDisplayDates();

      var dc = this.daysCount - 1;
      for (i = 0; i < this.getMaxInputs(); i++) {
        dataText += '<tr>';
        for (var j = 0; j <= dc; j++) {
          var hours = this.getHoursByDate(displayDates[j]);
          var cellActive = '';

          var display = new Date(hours[i]);

          var displayHours = display.getUTCHours() + "<sup>" + (display.getUTCMinutes() < 10 ? '0' : '') + display.getUTCMinutes() + '</sup>';
          var nd = new Date(display);
          if (hours[i]) {
            cellActive = "book-calendar-cell-active book-calendar-cell-active-" + this.el;
            nd.setDate(nd.getDate() + 1);
            if (display.getUTCMonth() != nd.getUTCMonth()) {
              cellActive += " book-calendar-cell-last";
            }

            if (this.selectedDate) {
              var tempDate = new Date(this.selectedDate);

              //TODO: do this with getTime();
              if (display.getFullYear() == this.selectedDate.getFullYear() && display.getMonth() == this.selectedDate.getMonth() && display.getDate() == this.selectedDate.getDate() && display.getUTCHours() == this.selectedDate.getUTCHours() && display.getUTCMinutes() == this.selectedDate.getUTCMinutes()) {
                cellActive += " book-calendar-cell-active-selected";
              }
            }

          } else {
            displayHours = '&nbsp;';
            cellActive = "book-calendar-cell-disabled";
          }
          dataText += '<td style="width: ' + this.cellPercentsWidth + '%" data-date="' + display.toUTCString() + '" class="book-calendar-cell ' + cellActive + '"> ' + displayHours + ' </td>';
        }
        dataText += '</tr>';
      }
      keyElements.dataContainer.innerHTML = dataText;
      this.addListeners();
    } else {
      console.log('Error. Key elements not found!');
    }

    //alert(keyElements.container.offsetWidth);

    keyElements.calendarWrapper.style.width = keyElements.container.offsetWidth - 40 + 'px';

    var ms = this.step;
    var cd = new Date(this.minDate);
    var csd = new Date(this.startDate);

    if (csd.getTime() <= cd.getTime()) {
      this.prevDisabled(true);
    } else {
      this.prevDisabled(false);
    }

    this.afterDraw(function() {});
  };
  return this.init();
};
