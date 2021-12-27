#include "rapidjson/document.h"

#include <emscripten/emscripten.h>
#include <emscripten/fetch.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>

#include "common.h"

using namespace rapidjson;

StringBuffer sb;

const char* out_src = "Freedom.png";

extern "C" void parse_set(Entry *entry, const char *json)
{
  Document document;
  document.Parse(json);
  assert(document.IsObject());

  const char* in_src = NULL;

  if (document.HasMember("src"))
  {
    assert(document["src"].IsString());
    in_src = document["src"].GetString();
  }

  if (document.HasMember("buffer"))
  {
    GF_Err err;
    assert(document["buffer"].IsObject());
    assert(document["buffer"].HasMember("pointer"));
    assert(document["buffer"].HasMember("size"));

    entry->in_data = (char*) document["buffer"]["pointer"].GetUint();
    entry->in_numBytes = document["buffer"]["size"].GetUint();

    const char* io_in = make_fileio(entry,in_src, &entry->in_data, &entry->in_numBytes, GF_TRUE, &err);

    gf_fs_load_source(entry->session, io_in, NULL, NULL, &err);
    if (err) {
		  fprintf(stderr, "session error %s\n", gf_error_to_string(err) );
    }

    const char* io_out = make_fileio(entry,out_src, &entry->out_data, &entry->out_numBytes, GF_FALSE, &err);

    gf_fs_load_destination(entry->session, io_out , NULL, NULL, &err);
   if (err) {
		fprintf(stderr, "session error %s\n", gf_error_to_string(err) );
    }


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
      out.AddMember(Value("getImage"), Value((unsigned int)entry->out_data), document.GetAllocator());
    }
    else if (strcmp(property, "getSize") == 0)
    {
      out.AddMember(Value("getSize"), Value((u32)entry->out_numBytes), out.GetAllocator());
    }
    else if (strcmp(property, "getWidth") == 0)
    {
      out.AddMember(Value("getWidth"), Value(entry->width), out.GetAllocator());
    }
    else if (strcmp(property, "getHeight") == 0)
    {
      out.AddMember(Value("getHeight"), Value(entry->height), out.GetAllocator());
    }else if (strcmp(property, "connections") == 0)
    {
      gf_fs_print_connections(entry->session);
    }
  }

  sb.Clear();
  Writer<StringBuffer> writer(sb);
  out.Accept(writer);
  return sb.GetString();
}