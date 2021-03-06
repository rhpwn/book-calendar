book-calendar
========

book-calendar is a javascript calendar plugin. 

![alt text](https://raw.githubusercontent.com/rhpwn/book-calendar/master/calendar-screenshot.png "Calendar screenshot")


[![Build Status](https://travis-ci.org/rhpwn/book-calendar.svg?branch=master)](https://travis-ci.org/rhpwn/book-calendar)
[![Issue Stats](http://issuestats.com/github/rhpwn/book-calendar/badge/pr)](http://issuestats.com/github/rhpwn/book-calendar)

### Bower Installation

book-calendar is available for Bower installation:
`bower install book-calendar`


### [View demo](https://jsfiddle.net/ewk9f7u9/)





Options
=======
| Name | Type |	Default |	Description |
| ---- |:----:|:-------:|:----------- |
| data | array | null | input data for caledar |
| el |	string |	null |	id of calendar container element |
| locale |	string	| 'en' |	locale |
| startDate |	date |	new Date() |	Start Date for Calendar |
| step | integer |	1 |	increment step |
| daysCount | integer |	7 |	Count of days displayed in Calendar |


Sample Usage
============
```html
<html>
  <head>
    <link type="text/css" rel="stylesheet" href="dist/calendar.min.css">
    <script src="dist/calendar.min.js"></script>
     <script src="dist/locale/ro.js"></script>
  </head>
  <body>
    <div id="book-calendar" class="book-calendar">
    </div>
    <script type="text/javascript">

     var dates = [];
     var dat = new Date();

     for(var i=0; i < 200; i++) {
       dat.setHours(dat.getHours() + 1);
       dates.push(new Date(dat));
    }

    var calendar = new BookCalendar({
      el: 'book-calendar',
      data: dates,
      locale: 'ro',
    });
    </script>
  </body>
</html>
