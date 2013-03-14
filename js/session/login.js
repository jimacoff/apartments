// Generated by CoffeeScript 1.4.0
var login;

login = {
  init: function() {
    this.detectElements();
    return this.bindEvents();
  },
  detectElements: function() {
    return this.form = $('.form-actions');
  },
  bindEvents: function() {
    return this.initValidation();
  },
  initValidation: function() {
    return this.form.validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          minlength: 6,
          required: true
        }
      },
      highlight: function(label) {
        return $(label).closest(".control-group").addClass("error");
      },
      success: function(label) {
        return $(label).text("OK!").addClass("valid").closest(".control-group").addClass("success");
      }
    });
  }
};

$(document).ready(function() {
  return login.init();
});