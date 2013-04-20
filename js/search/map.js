// Generated by CoffeeScript 1.4.0
var map;

map = {
  template: JST["search/apartment"],
  init: function() {
    this.detect_elements();
    return this.bind_events();
  },
  detect_elements: function() {
    this.gmap_input = $("#gmaps-input-address");
    this.gmap_error = $("#gmaps-error");
    this.search_options = {
      search: $("#search_input").val(),
      lat: $("#lat").val(),
      lng: $("#lng").val(),
      to: $("#to").val(),
      from: $("#from").val(),
      type_id: $("#type_id").val()
    };
    this.jmap = $("#gmaps-canvas");
    this.map_options = {
      zoom: 10,
      maxZoom: 18,
      minZoom: 7,
      center: new google.maps.LatLng(54.66102679999999, -107.2491508),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.geocoder = void 0;
    this.map = void 0;
    this.markers = [];
    this.image = new google.maps.MarkerImage("../img/marker-images/image.png", new google.maps.Size(18, 17), new google.maps.Point(0, 0), new google.maps.Point(9, 17));
    this.shadow = new google.maps.MarkerImage("../img/marker-images/shadow.png", new google.maps.Size(30, 17), new google.maps.Point(0, 0), new google.maps.Point(9, 17));
    this.shape = {
      coord: [10, 0, 11, 1, 12, 2, 13, 3, 14, 4, 15, 5, 16, 6, 17, 7, 14, 8, 15, 9, 15, 10, 15, 11, 15, 12, 15, 13, 15, 14, 15, 15, 14, 16, 3, 16, 2, 15, 2, 14, 2, 13, 2, 12, 2, 11, 2, 10, 2, 9, 3, 8, 0, 7, 1, 6, 2, 5, 3, 4, 4, 3, 3, 2, 3, 1, 3, 0, 10, 0],
      type: "poly"
    };
    this.search_pan = $(".my-hero-unit");
    this.map_name = "gmaps-canvas";
    $("#" + this.map_name).show();
    this.filter_btn = $(".filter-btn");
    this.alert_btn = $(".alert-btn");
    this.modal = $('#myModal');
    this.modal_alert = $('#alertModal');
    this.title_modal = $('#title-modal');
    this.search_btn = $('#fin-search');
    this.gmap_input = $("#search");
    this.type_switcher = $("#type_switcher");
    this.type = $("#type");
    this.form_search = $("#form-search");
    this.lat_input = $("#lat");
    this.lng_input = $("#lng");
    this.search_input = $("#search_input");
    this.filter_label = $("#filter_label");
    this.from = $("#from");
    this.to = $("#to");
    this.sel_types = $("#sel_types");
    this.fin_alert = $("#fin-alert");
    this.title_alert = $("#title-alert");
    return this.ap_length = 0;
  },
  bind_events: function() {
    this.initialize_map();
    this.search_clicker();
    this.autocomplete_init();
    this.form_submiter();
    this.prevent_enter();
    this.init_validate();
    this.init_search_filter();
    this.alert_clicker();
    return this.fin_alert_click();
  },
  fin_alert_click: function() {
    var me,
      _this = this;
    me = this;
    return this.fin_alert.click(function(e) {
      var el;
      el = $(e.currentTarget);
      return $.ajax({
        url: SYS.baseUrl + 'alerts/save',
        data: $.param({
          title: me.title_alert.val(),
          options: me.search_options,
          count: me.ap_length
        }),
        type: 'POST',
        dataType: 'json',
        success: function(res) {
          if (res.text = "success") {
            _this.modal_alert.modal('hide');
            return location.href = SYS.baseUrl + 'alerts';
          }
        }
      });
    });
  },
  init_search_filter: function() {
    this.search_pan.show();
    console.log(this.search_input.val());
    if (this.search_input.val() !== "") {
      this.filter_label.after(' <span class="badge">' + this.search_input.val() + '</span>');
    }
    if (this.to.val() !== "") {
      this.filter_label.after(' <span class="badge">To: $' + this.to.val() + '</span>');
    }
    if (this.from.val() !== "") {
      this.filter_label.after(' <span class="badge">From: $' + this.from.val() + '</span>');
    }
    if (this.to.val() === "" && this.from.val() === "") {
      this.filter_label.after(' <span class="badge">Any Price</span>');
    }
    if (this.sel_types.val() !== "") {
      return this.filter_label.after(' <span class="badge">Beds: ' + this.sel_types.val() + '</span>');
    } else {
      return this.filter_label.after(' <span class="badge">Any Beds</span>');
    }
  },
  form_submiter: function() {
    var me,
      _this = this;
    me = this;
    return this.form_search.submit(function() {
      if (_this.form_search.valid()) {
        return $(".btn-group .btn.active").each(function() {
          var input;
          input = document.createElement("input");
          input.setAttribute("type", "hidden");
          input.setAttribute("name", "type_id[]");
          input.setAttribute("value", this.value);
          return me.form_search.append(input);
        });
      }
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
    return this.form_search.validate({
      rules: {
        search: {
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
  search_clicker: function() {
    var _this = this;
    return this.filter_btn.click(function(e) {
      var el;
      el = $(e.currentTarget);
      return _this.modal.modal();
    });
  },
  alert_clicker: function() {
    var _this = this;
    return this.alert_btn.click(function(e) {
      var el;
      el = $(e.currentTarget);
      return _this.modal_alert.modal();
    });
  },
  update_ui: function(address, latLng) {
    this.gmap_input.autocomplete("close");
    this.gmap_input.val(address);
    this.lat_input.val(latLng.lat());
    return this.lng_input.val(latLng.lng());
  },
  autocomplete_init: function() {
    var me,
      _this = this;
    me = this;
    this.geocoder = new google.maps.Geocoder();
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
        return me.update_ui(ui.item.value, ui.item.geocode.geometry.location);
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
          return me.update_ui(results[0].formatted_address, results[0].geometry.location);
        } else {
          me.gmap_error.html("Sorry, something went wrong. Try again!");
          return me.gmap_error.show();
        }
      } else {
        if (type === "address") {
          me.gmap_error.html("Sorry! We couldn't find " + value + ". Try a different search term.");
          return me.gmap_error.show();
        } else {
          me.gmap_error.html("Woah... that's pretty remote! You're going to have to manually enter a place name.");
          me.gmap_error.show();
          return me.update_ui("", value);
        }
      }
    });
  },
  initialize_map: function() {
    var gmap;
    this.jmap.css('height', innerHeight - 160);
    if (!(this.search_options.lat === "" && this.search_options.lng === "")) {
      this.map_options.center = new google.maps.LatLng(this.search_options.lat, this.search_options.lng);
    }
    gmap = document.getElementById(this.map_name);
    this.map = new google.maps.Map(gmap, this.map_options);
    return this.get_markers();
  },
  add_to_favorite: function(id, element, user_id) {
    var _this = this;
    if (!$(element).hasClass('disabled')) {
      return $.ajax({
        url: SYS.baseUrl + 'search/set_favorite',
        data: $.param({
          id: id,
          user_id: user_id
        }),
        type: 'POST',
        dataType: 'json',
        success: function(res) {
          if (res.text = "success") {
            return $(element).addClass("disabled").html("In Favorites");
          }
        }
      });
    }
  },
  add_to_sends: function(id, element, email) {
    var _this = this;
    if (!$(element).hasClass('disabled')) {
      return $.ajax({
        url: SYS.baseUrl + 'search/set_send',
        data: $.param({
          application_id: id,
          email: email
        }),
        type: 'POST',
        dataType: 'json',
        success: function(res) {
          if (res.text = "success") {
            return $(element).addClass("disabled").html(res.data);
          }
        }
      });
    }
  },
  get_markers: function() {
    var me,
      _this = this;
    me = this;
    return $.ajax({
      url: SYS.baseUrl + 'search/get_markers',
      data: $.param({
        options: me.search_options
      }),
      type: 'POST',
      dataType: 'json',
      success: function(res) {
        var markerClusterer;
        if (res.text = "success") {
          me.ap_length = res.data.length;
          $.each(res.data, function(i, item) {
            var infowindow, marker;
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(item.lat, item.lng),
              icon: me.image,
              shadow: me.shadow,
              shape: me.shape
            });
            infowindow = new google.maps.InfoWindow({
              content: ""
            });
            google.maps.event.addListener(marker, "click", function() {
              var _this = this;
              return $.ajax({
                url: SYS.baseUrl + 'search/get_apartment',
                data: $.param({
                  id: item.id
                }),
                type: 'POST',
                dataType: 'json',
                success: function(res) {
                  if (res.text = "success") {
                    infowindow.setContent(me.template({
                      item: res.data,
                      url: SYS.baseUrl
                    }));
                    infowindow.open(me.map, marker);
                    return setTimeout((function() {
                      return $("#gallery").galleryView({
                        panel_width: 350,
                        panel_height: 285,
                        panel_scale: 'fit',
                        frame_scale: 'fit'
                      });
                    }), 70);
                  }
                }
              });
            });
            return me.markers.push(marker);
          });
          return markerClusterer = new MarkerClusterer(me.map, me.markers, {
            maxZoom: 15,
            gridSize: 50,
            styles: [
              {
                opt_textColor: "#fff",
                height: 34,
                url: SYS.baseUrl + "img/marker-images/clusterMarker2.png",
                width: 34
              }, {
                opt_textColor: "#fff",
                height: 34,
                url: SYS.baseUrl + "img/marker-images/clusterMarker2.png",
                width: 34
              }, {
                opt_textColor: "#fff",
                height: 47,
                url: SYS.baseUrl + "img/marker-images/clusterMarker3.png",
                width: 47
              }, {
                opt_textColor: "#fff",
                height: 56,
                url: SYS.baseUrl + "img/marker-images/clusterMarker4.png",
                width: 56
              }, {
                opt_textColor: "#fff",
                height: 56,
                url: SYS.baseUrl + "img/marker-images/clusterMarker4.png",
                width: 56
              }
            ]
          });
        }
      }
    });
  }
};

$(document).ready(function() {
  return map.init();
});
