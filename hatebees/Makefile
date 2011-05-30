
#make full - for a really slow build that runs all art generation scripts as well

all: bake

full: art sfx bake

FORCE:

bake:
	../exe/lua bake.lua

art: FORCE
	../exe/lua art/art.lua

sfx: FORCE
	../exe/lua art/sfx.lua
