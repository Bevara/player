function free(pointer:number) :number
{
    return this.exports_using.free(pointer);
}

function malloc(memorySize:number) :number
{
    return this.exports_using.malloc(memorySize);
}

function memcpy(destination : number, source : number, size: number):number
{
    return this.exports_using.memcpy(destination, source, size);
}

function memset(pointer:number, value:number, count:number) :number
{
    return this.exports_using.memset(pointer, value, count);
}

export {memcpy,malloc,memset,free}