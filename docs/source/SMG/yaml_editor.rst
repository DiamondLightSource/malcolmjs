YAML Editor
===========

Higher level view of what the code is doing
-------------------------------------------

Currently it's assumed that there exists a lookup table (which is often
referred to as a "schema object" in the code) whose keys are malcolm typeids
and values are JSON data, where the JSON data are serialised MethodMeta's of
some python class' :code:`__init__()` (for example, a CompoundGenerator).

The hint menu entry generation is started with Ctrl-Space (but can be redefined
as desired in the :code:`options.extraKeys` object that is defined in
:code:`App.render()`). When this process starts, it begins by taking the
current position of the cursor, figuring out the closest parent section that
the cursor is in by looking at the indentation level, and walking up the
various parent sections until it hits the very top level. Throughout that
process it populates an array (the variable name used for this is always
:code:`sectionPath`) which holds the "path" so to speak from the top section
down to the inner section that the cursor is sitting in.  The main function
that oversees this part is :code:`getSectionPath()`.

Once the section path array has been populated accordingly, the next thing that
is done is to find the section corresponding to the one that the cursor is in
inside the lookup table, and the section path array is used to navigate the
lookup table appropriately.  The main function that takes care of this part is
:code:`traverseSchemaObject()`.

:code:`traverseSchemaObject()` will return the part of the lookup table that
corresponds to the section of the YAML file that the cursor is currently
sitting inside.
This is used to then inspect the current YAML file section and see what fields
have already been used and what fields are available but have not been used yet
(this part currently isn't nicely put into one function, the logic is just
sitting inside :code:`yaml-hint.js` unfortunately).

That will give an array of unused fields (the :code:`unusedSchemaFieldsArray`
variable). The last thing that is done is to perform some checks to see if the
cursor is actually at a position where we want completion to be available, and
this is where the indentation constraints are applied by the
:code:`checkIfAtInnerSectionEnd()` and :code:`checkIfAtTopLevelEnd()`
functions. If those checks are successful, then the list containing the hint
menu objects (the :code:`hintMenuObjectList` variable) is populated via
:code:`generateHintText()`, and if the checks fail the list is just set to be
empty.

General comments
----------------

The approach
~~~~~~~~~~~~

The approach used was to have the hint menu entries generateable based on the
indent level that the current line is at. This approach works reasonably well
due to the strict adherence of YAML code to indentation, but it's not enough to
have the desired behaviour of having the hint menu only appear when at the end
of the "section" that fields are being added to.

For example, say there's an array of dicts with two dicts inside it; it was
desired to not be able to generate the hint menu for inserting another dict
into the array **if** the cursor is inbetween those two dicts in the YAML, the
cursor needs to be at the end of that array for the hint menu to appear.

To enforce the particular places that the hint menu can appear, all that's
done is to perform various checks in :code:`checkIfAtInnerSectionEnd()` and
:code:`checkIfAtTopLevelEnd()` to see if the cursor is at the end of the
section or not, and if the cursor is not at the end of the section, the hint
menu entry list is simply not populated (despite going through pretty much
**all** the processing used in the case when the hint menu does appear).
There's quite possibly a better approach than this!

Assumption about the top level typeid being defined
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The whole approach assumes that the topmost typeid field is already given in
the file (ie, it assumes that :code:`typeid: some.path.thing` is at the top of
the file, where :code:`some.path.thing` is the object being configured).

This is because that particular typeid value not only defines what object is
being configured in the YAML file, but also what schema object is needed to be
looked at, so that information needs to be somewhere in order to start things
off with the hint menu. Meaning, if the top level typeid field were to be
removed, the hint menu functionality would break as it currently doesn't have
any other means of knowing what object is being configured.

Some possible code style and structure improvements
---------------------------------------------------

In :code:`yaml-hint.js`, the code that generates the various bits used to find
the unused field names that are in the schema object could likley be extracted
into its own function and put into :code:`yaml-hint-helper.js`.

There are some functions in :code:`yaml-hint-helper.js` which are performing
similar/related tasks and so are likely able to be merged into one function
(for example, :code:`getFirstNonEmptyLineno()` and
:code:`getLastNonEmptyLineno()`, they both check for the closest non-empty
line, just either above or below the line that the cursor is on).

Generally the structure is a bit spaghetti-like, functions call functions
which then call other functions, :code:`yaml-hint-helper.js` is not as nicely
separated as it probably could be.

Instances of codemirror (as the :code:`cm` variable) are passed around between
functions inside :code:`yamp-hint-helper.js` a **lot**, which is probably not a
good thing to do.

Currently, the lookup table is hardcoded in the :code:`src/lookup_table_data.json`
file, in the future it should be generated in some manner from the serialised
data that the GUI gets from malcolm.

Features that might be desirable to implement in the future
-----------------------------------------------------------

Cursor indentation in nested structures
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
If the cursor is at a field that can have children but has no child entries yet
(ie, an empty new field has just been inserted, such as a dict in the
:code:`generators` array param for CompoundGenerator), hitting the enter key
will not indent the cursor to the level of the children of that new dict (which
is what would probably be preferred), instead it'll only be at the indent level
of the new dict.

Cursor indentation when inserting arrays
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
When inserting an array via the hint menu, it's probably preferred to have the
cursor jump to the next line at the appropriate indentation level, as well as
maybe including the leading "-" so then the cursor is in a position to
immediately start writing the first entry.

I can't imagine it'd be too tricky to implement hopefully, the only fiddly bit
might be inserting the correct indentation level for the first entry inside the
string in :code:`generateHintText()`.

A possible approach could be to not compare the current cursor position with
the parent indent level, but instead compare the start of the token for the
text that's currently being typed to the parent indent level, so then the correct
indentation for the text currently being typed could still be enforced, but
also make the hint menu a little less dependent on the position of the cursor.


Backspacing through tab characters
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Indents inserted via the tab key are replaced by the equivalent number of
spaces to get the cursor to the next tab stop, but the tab character can't be
backspaced through, it'll instead backspace through the individual space chars
which might be a bit annoying (although Ctrl-Backspace can be used to some
extent to backspace through words, tab characters etc).

Hint menu entry filtering
~~~~~~~~~~~~~~~~~~~~~~~~~
There's no filtering of hint menu entries as text is being typed. This might be
a nice feature to have, but might also not be that useful depending on the
variety (or lack of) of the hint menu entries.

A problem that is presented by implementing this feature is related to the
constraints placed on the hint menu to be cursor-position dependent: because
the hint menu is only available at certain indentation levels, this means that
if the hint menu is open at some cursor position, once **any** text is typed at
that position the hint menu will disappear, since typing anything will move
the cursor from a position where the indentation adhered to the constraints
placed on the hint menu to a position that doesn't adhere to those indentation
constraints.

Open hint menu from partially typed text
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The hint menu can't be brought up with partially typed text on the current
line, it'll only work for empty lines where the cursor is indented to the
appropriate level (this is due to the way the hint menu has been constrained to
only appear at appropriate indentation levels), which isn't great.  The
function :code:`checkIfAtInnerSectionEnd()` is where it's enforced that the
current position of the cursor be two columns more than the parent indentation
level, so that's probably a good place to start if trying to figure out how to
do this.

Automatically insert default field values
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
It'd be nice to at least have the option to have the default value of a field
be automatically inserted along with the field name when using the hint menu.

Currently, the :code:`defaults` attribute on the serialised MethodMeta's that
are in the lookup table get ignored, because in :code:`traverseSchemaObject()`
it only grabs the :code:`takes` attribute (which contains all the params for
the MethodMeta).

In order to get this functionality, :code:`traverseSchemaObject()` would need
to be changed so it kept the whole MethodMeta (so it has the :code:`defaults`
attribute on it), and then this needs to be accounted for when
:code:`yaml-hint.js` defines :code:`schemaFieldNames`, and also in
:code:`generateHintText()`, to then actually insert the default value for any
fields.

Schema-error highlighting
~~~~~~~~~~~~~~~~~~~~~~~~~
There's no visual hinting for YAML code that does not adhere to the schema,
ideally you'd want red squiggly lines or something to highlight such errors.

Codemirror doesn't offer this functionality by default, but it seems possible
to be able to do it through a dependency of :code:`yaml-lint.js` called `js-yaml
<https://github.com/nodeca/js-yaml>`_.

In codemirror's `yaml-lint.js
<https://github.com/codemirror/CodeMirror/blob/master/addon/lint/yaml-lint.js#L26>`_
file, the line :code:`try{ jsyaml.loadAll(text); }` and the subsequent
:code:`catch(e)` is parsing the YAML code and then returning any errors that
are encountered, letting :code:`yaml-lint.js` handle the error to then pass
things like the start and end positions of the error (which will define the
start and end of the red squiggly line in the code).

Looking at the `docs
<https://github.com/nodeca/js-yaml#safeload-string---options->`_ of js-yaml and
also the following `github issue
<https://github.com/nodeca/js-yaml/issues/233>`_, it looks like it's possible
to define a custom schema against which the validation can be done, so perhaps
using the :code:`schema` parameter of :code:`loadAll()` and passing in a custom
schema (that is somehow generated from the lookup table or something), some
error highlighting for incorrect YAML code can be done based on information in
the lookup table?

Known bugs
----------

Null tokens causing errors
~~~~~~~~~~~~~~~~~~~~~~~~~~
There are instances where :code:`cm.lastLine()` is used when it'd make more
sense to use :code:`cm.lineCount()` (such as in
:code:`getFirstNonEmptyLineno()`), but doing so then causes error messages to
be thrown about tokens being null: the null tokens come from
:code:`getFirstUsefulToken()`, but I'm not really sure why exactly they're
coming out for :code:`cm.lineCount()` but not for :code:`cm.lastLine()` (it's
perhaps likely to have something to do with the last line of the file often
being an empty line so then there are no good tokens for that line).

Moving the top level typeid below its fields
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The hint menu partially breaks if the top level typeid is moved below any of
its fields. For example, in the hardcoded :code:`yamltext` variable in
:code:`app.js` there is a top level :code:`typeid:
scanpointgenerator:generator/CompoundGenerator:1.0` field, and suppose it had a
field called :code:`generators` defined on the line below; if the typeid field
is moved below the :code:`generators` field then the :code:`generators` field
effectively becomes unseeable by the hint menu generation logic, so the option
of adding in the :code:`generators` field to the file will be available,
despite it already existing and just being placed above the top level typeid
field).

This error is due to the assumption that the typeid of the object being
configured would be the topmost field in the YAML file (which would mean the
top level section would be guaranteed to occur at the very top of the file,
making the construction of the section path simpler than if the file structure
didn't reflect the structure inside the serialised MethodMeta's), but perhaps
the editor should be able to handle the fields being in an arbitrary order?
