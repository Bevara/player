
def writeFile(func):
    f = open("/Users/gorinje/project/player/webinterface/imports/"+ func + ".ts", "w")
    lines = ["function " + func + "()\n",
    "{\n",
    "console.log (\"function "+ func +" has not been implemented!\")\n",
    "}\n",
    "export {" + func + "}\n"]
    f.writelines(lines)
    f.close()

filepath = '/Users/gorinje/project/player/webinterface/imports.ts'
with open(filepath) as fp:
   line = fp.readline()
   cnt = 1
   while line:
       if "import { " in line :
            test = line.split(" ")
            writeFile(test[2])
       line = fp.readline()