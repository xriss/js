-- lua script to manage any art assets

local grd=require("grd")


function exists(n)
	local f=io.open(n)
	if f then
		io.close(f)
		return true
	end
	return false
end


do

local filename="art/die/d6.6.png"

os.execute("cd")

	if not exists(filename) then print("file missing") end
	
	print(filename)
	os.execute("ls")
	
	ga=grd.create("GRD_FMT_U8_INDEXED",filename)
	
	print(ga.width)
	print(ga.height)
	
end
