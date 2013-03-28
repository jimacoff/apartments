// Generated by CoffeeScript 1.4.0
var create;

create = {
  template: JST["apartments/create_thumb"],
  init: function() {
    this.detect_elements();
    return this.bind_events();
  },
  detect_elements: function() {
    this.gmap_input = $("#gmaps-input-address");
    this.gmap_error = $("#gmaps-error");
    this.lat_input = $("#lat");
    this.lng_input = $("#lng");
    this.geocoder = void 0;
    this.map = void 0;
    this.marker = void 0;
    this.type_switcher = $("#type_switcher");
    this.type = $("#type");
    this.form_create = $("#form_create");
    this.form_edit = $("#form_edit");
    this.fileupload = $("#fileupload");
    this.th_container = $(".thumbnails");
    this.image_counter = 0;
    return this.images = $(".t-images");
  },
  bind_events: function() {
    this.gmaps_init();
    this.autocomplete_init();
    this.init_type_switcher();
    this.prevent_enter();
    this.init_validate();
    this.init_uploader();
    return this.init_fancybox();
  },
  gmaps_init: function() {
    var latlng, me, options;
    if (this.lat_input.val() === "" && this.lng_input.val() === "") {
      latlng = new google.maps.LatLng(54.66102679999999, -107.2491508);
    } else {
      latlng = new google.maps.LatLng(this.lat_input.val(), this.lng_input.val());
    }
    options = {
      zoom: 3,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    me = this;
    this.map = new google.maps.Map(document.getElementById("gmaps-canvas"), options);
    this.geocoder = new google.maps.Geocoder();
    this.marker = new google.maps.Marker({
      map: me.map,
      draggable: true
    });
    google.maps.event.addListener(this.marker, "dragend", function() {
      return me.geocode_lookup("latLng", me.marker.getPosition());
    });
    google.maps.event.addListener(this.map, "click", function(event) {
      me.marker.setPosition(event.latLng);
      return me.geocode_lookup("latLng", event.latLng);
    });
    if (this.lat_input.val() !== "" && this.lng_input.val() !== "") {
      this.marker.setPosition(latlng);
      this.geocode_lookup("latLng", latlng);
    }
    return this.gmap_error.hide();
  },
  update_map: function(geometry) {
    this.map.fitBounds(geometry.viewport);
    return this.marker.setPosition(geometry.location);
  },
  update_ui: function(address, latLng) {
    this.gmap_input.autocomplete("close");
    this.gmap_input.val(address);
    this.lat_input.val(latLng.lat());
    return this.lng_input.val(latLng.lng());
  },
  geocode_lookup: function(type, value, update) {
    var me, request;
    me = this;
    update = (typeof update !== "undefined" ? update : false);
    request = {};
    request[type] = value;
    return this.geocoder.geocode(request, function(results, status) {
      me.gmap_error.html("");
      me.gmap_error.hide();
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          me.update_ui(results[0].formatted_address, results[0].geometry.location);
          if (update) {
            return me.update_map(results[0].geometry);
          }
        } else {
          me.gmap_error.html("Sorry, something went wrong. Try again!");
          return me.gmap_error.show();
        }
      } else {
        if (type === "address") {
          me.gmap_error.html("Sorry! We couldn't find " + value + ". Try a different search term, or click the map.");
          return me.gmap_error.show();
        } else {
          me.gmap_error.html("Woah... that's pretty remote! You're going to have to manually enter a place name.");
          me.gmap_error.show();
          return me.update_ui("", value);
        }
      }
    });
  },
  autocomplete_init: function() {
    var me,
      _this = this;
    me = this;
    this.gmap_input.autocomplete({
      source: function(request, response) {
        return me.geocoder.geocode({
          address: request.term
        }, function(results, status) {
          return response($.map(results, function(item) {
            return {
              label: item.formatted_address,
              value: item.formatted_address,
              geocode: item
            };
          }));
        });
      },
      select: function(event, ui) {
        me.update_ui(ui.item.value, ui.item.geocode.geometry.location);
        return me.update_map(ui.item.geocode.geometry);
      }
    });
    return this.gmap_input.bind("keydown", function(event) {
      if (event.keyCode === 13) {
        _this.geocode_lookup("address", _this.gmap_input.val(), true);
        return _this.gmap_input.autocomplete("disable");
      } else {
        return _this.gmap_input.autocomplete("enable");
      }
    });
  },
  init_type_switcher: function() {
    var _this = this;
    return this.type_switcher.children().click(function(e) {
      var el;
      el = $(e.currentTarget);
      return _this.type.val(el.data("id"));
    });
  },
  prevent_enter: function() {
    return $(window).keydown(function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        return false;
      }
    });
  },
  init_validate: function() {
    var form;
    form = null;
    if (this.form_edit.length) {
      form = this.form_edit;
    } else {
      form = this.form_create;
    }
    return form.validate({
      rules: {
        title: {
          minlength: 2,
          required: true
        },
        descr: {
          minlength: 2,
          required: true
        },
        cost: {
          required: true,
          number: true
        },
        address: {
          required: true
        },
        highlight: function(label) {
          return $(label).closest(".control-group").addClass("error");
        },
        success: function(label) {
          return label.text("OK!").addClass("valid").closest(".control-group").addClass("success");
        }
      }
    });
  },
  remove_click: function(object) {
    var el,
      _this = this;
    el = $(object);
    return $.ajax({
      url: SYS.baseUrl + 'uploader/remove',
      data: $.param({
        url: el.parents("div.caption").prev().val()
      }),
      type: 'POST',
      dataType: 'json',
      success: function(res) {
        if (res.text === "success") {
          return el.parents('li').remove();
        }
      }
    });
  },
  remove_direct: function(url) {
    var _this = this;
    return $.ajax({
      url: SYS.baseUrl + 'uploader/remove',
      data: $.param({
        url: url
      }),
      type: 'POST',
      dataType: 'json',
      success: function(res) {
        if (res.text === "success") {
          return console.log(res.text);
        }
      }
    });
  },
  remove_click_existed: function(object) {
    var el,
      _this = this;
    el = $(object);
    return $.ajax({
      url: SYS.baseUrl + 'uploader/remove_existed',
      data: $.param({
        id: el.data('id')
      }),
      type: 'POST',
      dataType: 'json',
      success: function(res) {
        if (res.text === "success") {
          return el.parents('li').remove();
        }
      }
    });
  },
  init_fancybox: function() {
    if (this.images.length !== 0) {
      return this.images.fancybox({
        transitionIn: "none",
        transitionOut: "none"
      });
    }
  },
  init_uploader: function() {
    var me;
    me = this;
    return this.fileupload.fileupload({
      acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
      dataType: "json",
      fail: function(e, data) {
        return alert("Only gif, jpeg and png are allowed");
      },
      dataType: "json",
      done: function(e, data) {
        var tem;
        if (data.result.text === 'success') {
          me.image_counter++;
          if (me.image_counter > 1) {
            alert("Only 10 images allowed");
            return me.remove_direct(data.result.url);
          } else {
            tem = me.template({
              item: data.result,
              url: SYS.baseUrl
            });
            return me.th_container.append(tem);
          }
        } else {
          return alert("Only gif, jpeg and png are allowed");
        }
      }
    });
  }
};

$(document).ready(function() {
  return create.init();
});
