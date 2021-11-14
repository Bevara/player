#include "rapidjson/document.h"

#include <emscripten/emscripten.h>
#include <emscripten/fetch.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>

#include "common.h"

using namespace rapidjson;

void downloadSucceeded(emscripten_fetch_t *fetch)
{
  Entry *entry = (Entry *)fetch->userData;

  entry->event_callback(entry);
  //printf("Finished downloading %llu bytes from URL %s.\n", fetch->numBytes, fetch->url);
  // The data is now available at fetch->data[0] through fetch->data[fetch->numBytes-1];
  emscripten_fetch_close(fetch); // Free data associated with the fetch.
}

void downloadFailed(emscripten_fetch_t *fetch)
{
  Entry *entry = (Entry *)fetch->userData;

  entry->event_callback(entry);

  //printf("Downloading %s failed, HTTP failure status code: %d.\n", fetch->url, fetch->status);
  emscripten_fetch_close(fetch); // Also free data on failure.
}

StringBuffer sb;

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
  
  if (document.HasMember("downloadCallback"))
  {
    assert(document["downloadCallback"].IsNumber());
    entry->event_callback = reinterpret_cast<event_callback>(document["downloadCallback"].GetInt());
  }
}

extern "C" const char *parse_get(Entry *entry, const char *json)
{
  Document document;
  document.Parse(json);
  assert(document.IsArray());

  Document out;
  out.SetObject();

  for (Value::ConstValueIterator itr = document.Begin(); itr != document.End(); ++itr)
  {
    const char *property = itr->GetString();

    if (strcmp(property, "getImage") == 0)
    {
        out.AddMember(Value("getImage"), Value((unsigned int)entry->image), document.GetAllocator());
    }else if (strcmp(property, "getSize") == 0)
    {
        out.AddMember(Value("getSize"), Value(entry->size), out.GetAllocator());
    }else if (strcmp(property, "getWidth") == 0)
    {
        out.AddMember(Value("getWidth"), Value(entry->width), out.GetAllocator());
    }else if (strcmp(property, "getHeight") == 0)
    {
        out.AddMember(Value("getHeight"), Value(entry->height), out.GetAllocator());
    }
  }

  sb.Clear();
  Writer<StringBuffer> writer(sb);
  out.Accept(writer);
  return sb.GetString();
}