Material-UI Theming
===================

A useful feature of Material-UI is the provision of theme objects; these allow various styling parameters to be defined
at a top level and passed down to components which need them.

At its core, a theme is defined as being either light or dark. It then defines colours in a palette object;
this palette contains a set of primary, secondary and error colours, each of these having a light, main, dark and
contrast text colour. It is possible to let these colour be entirely auto-generated (specifying whether
the theme is to be light or dark), entirely manually defined or partially auto-generated (any of the sub-palettes will
be auto-generated if not defined, and specifying a main colour for each will allow the other colours in the sub-palette
to be auto-generated from this).

It is also possible to specify custom parameters as part of the theme by passing them to createMuiTheme
(in the same object and at the same level as palette).

.. code-block:: javascript

    const theme = createMuiTheme({
        palette: {
            type: 'dark',
        },
        alarmState: {
            warning: '#e6c01c',
        },
    });

More information can be found `here <https://material-ui.com/customization/themes/>`_.