/*
Copyright (c) 2010, Josef Richter & Mark Meves. All rights reserved.
licensed under the MIT license (same as jquery)
http://en.wikipedia.org/wiki/MIT_License
*/

(function() {

  var fonteyeAddCombo = function(args) {
    var editor = args.editor;
    var config = editor.config;
    // Gets the list of fonts names/sizes from the settings.
    var names = args.entries.split(';');
    var values = [];
    var comboName = args.comboName;
    var styleType = args.styleType;
    var lang = args.lang;
    var entries = args.entries;
    var defaultLabel = args.defaultLabel;
    var styleDefinition = args.styleDefinition;


    // Create style objects for all fonts.
    var styles = {};
    for (var i = 0; i < names.length; i++) {
      var parts = names[i];
      if (parts) {
        parts = parts.split('/');
        var vars = {}, name = names[i] = parts[0];
        vars[styleType] = values[i] = parts[1] || name;
        styles[name] = new CKEDITOR.style(styleDefinition, vars);
      } else names.splice(i--, 1);
    }

    editor.ui.addRichCombo(comboName, {
      label: lang.label,
      title: lang.panelTitle,
      voiceLabel: lang.voiceLabel,
      className: 'fonteye_' + (styleType == 'size' ? 'fooSize' : 'foo'), // was cke_
      multiSelect: false,

      panel: {
        css: editor.skin.editor.css.concat(config.contentsCss),
        voiceLabel: lang.panelVoiceLabel
      },

      init: function () {
        this.startGroup(lang.panelTitle);
        for (var i = 0; i < names.length; i++) {
          var name = names[i];
          // Add the tag entry to the panel list.
          this.add(name, '<span style="font-' + styleType + ':' + values[i] + '">' + name + '</span>', name);
        }
      },

      onClick: function (value) {
        editor.focus();
        editor.fire('saveSnapshot');
        var style = styles[value];
        if (this.getValue() == value) style.remove(editor.document);
        else style.apply(editor.document);
        editor.fire('saveSnapshot');
      },

      onRender: function () {
        editor.on('selectionChange', function (ev) {
          var currentValue = this.getValue();
          var elementPath = ev.data.path,
            elements = elementPath.elements;
          // For each element into the elements path.
          for (var i = 0, element; i < elements.length; i++) {
            element = elements[i];
            // Check if the element is removable by any of
            // the styles.
            for (var value in styles) {
              if (styles[value].checkElementRemovable(element, true)) {
                if (value != currentValue) this.setValue(value);
                return;
              }
            }
          }
          // If no styles match, just empty it.
          this.setValue('', defaultLabel);
        },
        this);
      }
    });
  };

  CKEDITOR.plugins.add( 'fonteye',
  {
    requires : [ 'richcombo', 'styles' ],

    init : function( editor )
    {
      var config = editor.config;
      fonteyeAddCombo({
        editor          : editor,
        comboName       : 'FonteyeFontFamily',
        styleType       : 'family',
        lang            : editor.lang.fonteye.fontFamily,
        entries         : config.fonteye.font_names,
        defaultLabel    : config.fonteye.font_defaultLabel,
        styleDefinition : config.fonteye.font_style
      });
      fonteyeAddCombo({
        editor          : editor,
        comboName       : 'FonteyeFontSize',
        styleType       : 'size',
        lang            : editor.lang.fonteye.fontSize,
        entries         : config.fonteye.fontSize_sizes,
        defaultLabel    : config.fonteye.fontSize_defaultLabel,
        styleDefinition : config.fonteye.fontSize_style
      });
    }
  });


  // **************** config

  CKEDITOR.config.fonteye = {
    /**
     * The list of fonts names to be displayed in the Font combo in the toolbar.
     * Entries are separated by semi-colons (;), while it's possible to have more
     * than one font for each entry, in the HTML way (separated by comma).
     *
     * A display name may be optionally defined by prefixing the entries with the
     * name and the slash character. For example, "Arial/Arial, Helvetica, sans-serif"
     * will be displayed as "Arial" in the list, but will be outputted as
     * "Arial, Helvetica, sans-serif".
     * @type String
     * @example
     * config.font_names =
     *     'Arial/Arial, Helvetica, sans-serif;' +
     *     'Times New Roman/Times New Roman, Times, serif;' +
     *     'Verdana';
     * @example
     * config.font_names = 'Arial;Times New Roman;Verdana';
     */
    font_names : 'Beavis/Beavis;Schemmerhorn/Shembuckle',
    /*
      'Arial/Arial, Helvetica, sans-serif;' +
      'Comic Sans MS/Comic Sans MS, cursive;' +
      'Courier New/Courier New, Courier, monospace;' +
      'Georgia/Georgia, serif;' +
      'Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;' +
      'Tahoma/Tahoma, Geneva, sans-serif;' +
      'Times New Roman/Times New Roman, Times, serif;' +
      'Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;' +
      'Verdana/Verdana, Geneva, sans-serif';
      */

    /**
     * The text to be displayed in the Font combo is none of the available values
     * matches the current cursor position or text selection.
     * @example
     * // If the default site font is Arial, we may making it more explicit to the end user.
     * config.font_defaultLabel = 'Arial';
     */

    font_defaultLabel : 'Fonteye Font', // was ''


    /**
     * The style definition to be used to apply the font in the text.
     * @example
     * // This is actually the default value for it.
     * config.font_style =
     *     {
     *         element    : 'span',
     *         styles    : { 'font-family' : '#(family)' },
     *         overrides  : [ { element : 'font', attributes : { 'face' : null } } ]
     *     };
     */
    font_style :
      {
        element    : 'span',
        styles    : { 'font-family' : '#(family)' },
        overrides  : [ { element : 'font', attributes : { 'face' : null } } ]
      },


    /**
     * The list of fonts size to be displayed in the Font Size combo in the
     * toolbar. Entries are separated by semi-colons (;).
     *
     * Any kind of "CSS like" size can be used, like "12px", "2.3em", "130%",
     * "larger" or "x-small".
     *
     * A display name may be optionally defined by prefixing the entries with the
     * name and the slash character. For example, "Bigger Font/14px" will be
     * displayed as "Bigger Font" in the list, but will be outputted as "14px".
     * @type String
     * @default '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px'
     * @example
     * config.fontSize_sizes = '16/16px;24/24px;48/48px;';
     * @example
     * config.fontSize_sizes = '12px;2.3em;130%;larger;x-small';
     * @example
     * config.fontSize_sizes = '12 Pixels/12px;Big/2.3em;30 Percent More/130%;Bigger/larger;Very Small/x-small';
     */

    fontSize_sizes :
    '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px',


    /**
     * The text to be displayed in the Font Size combo is none of the available
     * values matches the current cursor position or text selection.
     * @type String
     * @example
     * // If the default site font size is 12px, we may making it more explicit to the end user.
     * config.fontSize_defaultLabel = '12px';
     */
    fontSize_defaultLabel :  'Fonteye Size',


    /**
     * The style definition to be used to apply the font size in the text.
     * @type Object
     * @example
     * // This is actually the default value for it.
     * config.fontSize_style =
     *     {
     *         element    : 'span',
     *         styles    : { 'font-size' : '#(size)' },
     *         overrides  : [ { element : 'font', attributes : { 'size' : null } } ]
     *     };
     */
    fontSize_style : {
        element     : 'span',
        styles     : { 'font-size' : '#(size)' },
        overrides   : [ { element : 'font', attributes : { 'size' : null } } ]
    }
  };
})();
