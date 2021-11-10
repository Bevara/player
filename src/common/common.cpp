#include "rapidjson/document.h"

#include <emscripten/emscripten.h>
#include <emscripten/fetch.h>

#include "common.h"

using namespace rapidjson;


void downloadSucceeded(emscripten_fetch_t *fetch) {
  //printf("Finished downloading %llu bytes from URL %s.\n", fetch->numBytes, fetch->url);
  // The data is now available at fetch->data[0] through fetch->data[fetch->numBytes-1];
  emscripten_fetch_close(fetch); // Free data associated with the fetch.
}

void downloadFailed(emscripten_fetch_t *fetch) {
  //printf("Downloading %s failed, HTTP failure status code: %d.\n", fetch->url, fetch->status);
  emscripten_fetch_close(fetch); // Also free data on failure.
}

extern "C" void parse_set(Entry *entry, const char *json)
{
    Document document;
    document.Parse(json);
    assert(document.IsObject());

    if (document.HasMember("src"))
    {
        assert(document["src"].IsString());
        entry->src = document["src"].GetString();

        emscripten_fetch_attr_t attr;
        emscripten_fetch_attr_init(&attr);
        strcpy(attr.requestMethod, "GET");
        attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
        attr.onsuccess = downloadSucceeded;
        attr.onerror = downloadFailed;
        attr.userData = entry;
        emscripten_fetch(&attr, entry->src);
    }
}

extern "C" const char *parse_get(Entry *entry, const char *json)
{
    Document document;
    document.Parse(json);
    assert(document.IsArray());
    return "test";
}