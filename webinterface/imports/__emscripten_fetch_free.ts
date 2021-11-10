function __emscripten_fetch_free(id: number)
{
    delete this.Fetch.xhrs[id-1];
}
export {__emscripten_fetch_free}
