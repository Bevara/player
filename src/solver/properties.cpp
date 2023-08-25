#include "rapidjson/document.h"

#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>

using namespace rapidjson;

StringBuffer sb;

extern "C"
{
   struct GF_FilterSession;
   struct GF_FilterRegister;
   struct GF_Filter;

  extern GF_FilterSession *session;

  uint32_t getWidth();
   void printConnections(int);
   void printNonConnected(int);
   void printStats(int);
   uint32_t getStats();
   uint32_t getReports();
   uint32_t getVolume();
   void printReports(int);
   void sendPlay();
   void sendPause();
   void sendVolume(const char *);
   GF_Filter *gf_fs_get_filter(GF_FilterSession *session, uint32_t idx);
   uint32_t gf_fs_filters_registers_count(GF_FilterSession *fsess);
   uint32_t gf_fs_get_filters_count(GF_FilterSession *session);
   GF_FilterRegister * gf_fs_get_filter_register(GF_FilterSession *fsess, uint32_t idx);
   const char* gf_fs_filters_registers_name(GF_FilterRegister *reg);
   const char *gf_filter_get_name(GF_Filter *filter);

   const char *get_properties(const char *json)
  {
    Document document;
    document.Parse(json);
    assert(document.IsArray());

    Document out;
    out.SetObject();

    for (Value::ConstValueIterator itr = document.Begin(); itr != document.End(); ++itr)
    {
      const char *property = itr->GetString();

      if (strcmp(property, "width") == 0)
      {
        out.AddMember(Value("width"), Value(getWidth()), out.GetAllocator());
      }
      else if (strcmp(property, "height") == 0)
      {
        out.AddMember(Value("height"), Value(0), out.GetAllocator());
      }
      else if (strcmp(property, "stats") == 0)
      {
        out.AddMember(Value("stats"), Value(getStats() ? true : false), out.GetAllocator());
      }
      else if (strcmp(property, "reports") == 0)
      {
        out.AddMember(Value("reports"), Value(getReports() ? true : false), out.GetAllocator());
      }
      else if (strcmp(property, "volume") == 0)
      {
        out.AddMember(Value("volume"), Value(getVolume()), out.GetAllocator());
      }else if (strcmp(property, "registered") == 0)
      {
        uint32_t i, count;

        Document registered;
        registered.SetArray();
        Document::AllocatorType& r = out.GetAllocator();


        count=gf_fs_filters_registers_count(session);
        for (i=0; i<count; i++) {
          GF_FilterRegister* registered_filter = gf_fs_get_filter_register(session, i);
          Value reg_name(gf_fs_filters_registers_name(registered_filter), r);
          registered.PushBack(reg_name, r);
	      }

        out.AddMember(Value("registered"), registered, out.GetAllocator());
      }else if (strcmp(property, "connected") == 0)
      {
        uint32_t i, count;

        Document connected;
        connected.SetArray();
        Document::AllocatorType& r = out.GetAllocator();

        count=gf_fs_get_filters_count(session);
        for (i=0; i<count; i++) {
          GF_Filter* filter = gf_fs_get_filter(session, i);
          Value filter_name(gf_filter_get_name(filter), r);
          connected.PushBack(filter_name, r);
	      }

        out.AddMember(Value("connected"), connected, out.GetAllocator());
      }
    }

    sb.Clear();
    Writer<StringBuffer> writer(sb);
    out.Accept(writer);
    return sb.GetString();
  }

   const char *set_properties(const char *json)
  {
    Document document;
    document.Parse(json);
    assert(document.IsObject());

    Document out;
    out.SetObject();

    if (document.HasMember("connections"))
    {
      assert(document["connections"].IsBool());
      const bool connections = document["connections"].GetBool();

      if (connections)
      {
        printConnections(1);
      }
      else
      {
        printConnections(0);
      }
    }

    if (document.HasMember("nonConnected"))
    {
      assert(document["nonConnected"].IsBool());
      const bool nonConnected = document["nonConnected"].GetBool();

      if (nonConnected)
      {
        printNonConnected(1);
      }
      else
      {
        printNonConnected(0);
      }
    }

    if (document.HasMember("stats"))
    {
      assert(document["stats"].IsBool());
      const bool stats = document["stats"].GetBool();

      if (stats)
      {
        printStats(1);
      }
      else
      {
        printStats(0);
      }
    }

    if (document.HasMember("reports"))
    {
      assert(document["reports"].IsBool());
      const bool stats = document["reports"].GetBool();

      if (stats)
      {
        printReports(1);
      }
      else
      {
        printReports(0);
      }
    }

    if (document.HasMember("play"))
    {
      assert(document["play"].IsBool());
      const bool play = document["play"].GetBool();

      if (play)
      {
        sendPlay();
      }
    }

    if (document.HasMember("pause"))
    {
      assert(document["pause"].IsBool());
      const bool pause = document["pause"].GetBool();

      if (pause)
      {
        sendPause();
      }
    }

    if (document.HasMember("volume"))
    {
      assert(document["volume"].IsString());
      const char *vol = document["volume"].GetString();

      sendVolume(vol);
    }

    sb.Clear();
    Writer<StringBuffer> writer(sb);
    out.Accept(writer);
    return sb.GetString();
  }
}
