mainjs_names = jquery.min liquidmetal jquery.flexselect ninja_search
css    = public/stylesheets/flexselect.css

mainjs = $(addsuffix .js,$(addprefix public/,$(mainjs_names)))

all: gmscript

gmscript: ninja_search.user.js

ninja_search.user.js: public/header.js $(mainjs)
	cat public/header.js         > $@
	echo 'GM_addStyle("\\'       >> $@
	sed -e 's/$$/\\/g' $(css)    >> $@
	echo '");'                   >> $@
	cat $(mainjs)                >> $@


clean:
	rm -f ninja_search.user.js
