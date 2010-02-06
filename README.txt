This is a subset of a ckeditor distribution, modified.
That is, we pull a tar.gz of a nightly build of CKeditor,
and we take only a subset of the files in that build,
and we 'overlay' our modifications on to it.
As to how we can 'overlay' (patch) our modifications
remains to be seen.

The fonteye customizations to ckeditor are:

 ADD: ./ckeditor-subset/_source/plugins/fonteye
 MODIFY:  ./ckeditor-subset/_source/config.js
 MODIFY:  ./ckeditor-subset/_source/lang/*
