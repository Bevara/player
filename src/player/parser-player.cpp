#include "rapidjson/document.h"

#include <emscripten/emscripten.h>
#include <emscripten/fetch.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>

#include "player.h"

using namespace rapidjson;

StringBuffer sb;

extern "C" void parse_set_term(Entry *entry, const char *json)
{
  Document document;
  document.Parse(json);
  assert(document.IsObject());

  if (document.HasMember("filters"))
  {
    assert(document["filters"].IsArray());
    const Value &filters = document["filters"];
    for (SizeType i = 0; i < filters.Size(); i++)
      gf_fs_add_filter_register(entry->session, (const GF_FilterRegister *)filters[i].GetInt());
  }

  if (document.HasMember("io_in"))
  {
    GF_Err err;
    assert(document["io_in"].IsString());
    const char *io_in = document["io_in"].GetString();

    gf_fs_load_source(entry->session, io_in, NULL, NULL, &err);
    if (err)
    {
      fprintf(stderr, "session error %s\n", gf_error_to_string(err));
    }
  }

  if (document.HasMember("io_out"))
  {
    GF_Err err;
    assert(document["io_out"].IsString());
    const char *io_out = document["io_out"].GetString();

    gf_fs_load_destination(entry->session, io_out, NULL, NULL, &err);
    if (err)
    {
      fprintf(stderr, "session error %s\n", gf_error_to_string(err));
    }
  }
}

extern "C" const char *parse_get_term(Entry *entry, const char *json)
{
  Document document;
  document.Parse(json);
  assert(document.IsArray());

  Document out;
  out.SetObject();

  for (Value::ConstValueIterator itr = document.Begin(); itr != document.End(); ++itr)
  {
    const char *property = itr->GetString();

    if (strcmp(property, "connections") == 0)
    {
      gf_fs_print_connections(entry->session);
    }
  }

  sb.Clear();
  Writer<StringBuffer> writer(sb);
  out.Accept(writer);
  return sb.GetString();
}

GF_EXPORT
extern "C" void gf_fileio_set_stats_u32(GF_FileIO *gfio, u32 bytes_done, u32 file_size, Bool cache_complete, u32 bytes_per_sec)
{
  gf_fileio_set_stats(gfio, bytes_done, file_size, cache_complete, bytes_per_sec);
}