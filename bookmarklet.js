(function(w){

  var location = w.location;

  function isHotelPage(url){
    return url.indexOf('www.booking.com/hotel') > -1 ||
           url.indexOf('localhost:8000') > -1;
  }

  function openTab(url){
    window.open(url, '_blank');
  }

  function addDays(date, days){
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().substring(0, 10);
  }

  function parseUrlParams(urlParams){
    return urlParams
      .slice(1)
      .split(';')
      .reduce(function(acc, cur){
        var arr = cur.split('=');
        acc[arr[0]] = arr[1];
        return acc;
      }, {});
  }

  function serializeUrlParams(urlParams){
    var WHITELISTED_PARAMS = [
      'checkin',
      'checkout',
      'dest_type',
      'dest_id'
    ];

    return Object.keys(urlParams)
      .filter(function(k){
        return WHITELISTED_PARAMS.includes(k);
      })
      .map(function(k){
        return [k,urlParams[k]].join('=')
      })
      .join(';');
  }

  function shiftDateParams(urlParams, days){
    var p = parseUrlParams(urlParams);

    p['checkin'] = addDays(p['checkin'], days);
    p['checkout'] = addDays(p['checkout'], days);

    return serializeUrlParams(p);
  }

  function getHotelUrl(url, urlParams){
    return location.protocol +
           "//" + location.host +
           ""  + location.pathname +
           '?'  + urlParams +
           '#availability';
  }

  function goToFlexDate(location, days){
    console.log(location.search);

    var params = shiftDateParams(location.search, days);
    var url = getHotelUrl(location, params);

    console.log(params);

    return openTab( url );
  }

  function init(days){
    if( !isHotelPage(location.href) ){ return; }

    goToFlexDate(location, days);
  }

  w.bFlexDates = {
    init: init
  };

})(window);
