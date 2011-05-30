
#make full - for a really slow build that runs all art generation scripts as well
#make fast - for a really fast build that only bumps the base code

all: fast

full: art sfx bake

FORCE:

bake:
	../exe/lua bake.lua

fast:
	../exe/lua bake.lua noart

art: FORCE
	../exe/lua art/art.lua

sfx: FORCE
	../exe/lua art/sfx.lua
