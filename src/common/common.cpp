#include "rapidjson/document.h"

#include <emscripten/emscripten.h>
#include <emscripten/fetch.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>

#include "common.h"

using namespace rapidjson;

StringBuffer sb;

extern "C" void parse_set(Entry *entry, const char *json)
{
  Document document;
  document.Parse(json);
  assert(document.IsObject());

  if (document.HasMember("buffer"))
  {
    GF_Err err;
    assert(document["buffer"].IsObject());
    assert(document["buffer"].HasMember("pointer"));
    assert(document["buffer"].HasMember("size"));
    entry->fio_url = make_fileio(entry,"", GF_TRUE, &err);
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
    }
    else if (strcmp(property, "getSize") == 0)
    {
      out.AddMember(Value("getSize"), Value(entry->size), out.GetAllocator());
    }
    else if (strcmp(property, "getWidth") == 0)
    {
      out.AddMember(Value("getWidth"), Value(entry->width), out.GetAllocator());
    }
    else if (strcmp(property, "getHeight") == 0)
    {
      out.AddMember(Value("getHeight"), Value(entry->height), out.GetAllocator());
    }
  }

  sb.Clear();
  Writer<StringBuffer> writer(sb);
  out.Accept(writer);
  return sb.GetString();
}