#include "rapidjson/document.h"

#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>


using namespace rapidjson;

StringBuffer sb;

extern "C" uint32_t getWidth();
extern "C" void printConnections(int);
extern "C" uint32_t getConnections();
extern "C" void printNonConnected(int);
extern "C" uint32_t getNonConnected();
extern "C" void printStats(int);
extern "C" uint32_t getStats();
extern "C" uint32_t getConnections();
extern "C" uint32_t getReports();
extern "C" uint32_t getVolume();
extern "C" void printReports(int);
extern "C" void sendPlay();
extern "C" void sendPause();
extern "C" void sendVolume(const char*);

extern "C" const char *get_properties(const char *json)
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
    }else if (strcmp(property, "height") == 0)
    {
        out.AddMember(Value("height"), Value(0), out.GetAllocator());
    }else if (strcmp(property, "connections") == 0)
    {
        out.AddMember(Value("connections"), Value(getConnections()? true:false), out.GetAllocator());
    }
    else if (strcmp(property, "nonConnected") == 0)
    {
        out.AddMember(Value("nonConnected"), Value(getNonConnected()? true:false), out.GetAllocator());
    }
    else if (strcmp(property, "stats") == 0)
    {
        out.AddMember(Value("stats"), Value(getStats()? true:false), out.GetAllocator());
    }else if (strcmp(property, "reports") == 0)
    {
        out.AddMember(Value("reports"), Value(getReports()? true:false), out.GetAllocator());
    }else if (strcmp(property, "volume") == 0)
    {
        out.AddMember(Value("volume"), Value(getVolume()), out.GetAllocator());
    }
  }

  sb.Clear();
  Writer<StringBuffer> writer(sb);
  out.Accept(writer);
  return sb.GetString();
}


extern "C" const char * set_properties(const char *json)
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

    if (connections){
      printConnections(1);
    }else{
      printConnections(0);
    }
  }

  if (document.HasMember("nonConnected"))
  {
    assert(document["nonConnected"].IsBool());
    const bool nonConnected = document["nonConnected"].GetBool();

    if (nonConnected){
      printNonConnected(1);
    }else{
      printNonConnected(0);
    }
  }

  if (document.HasMember("stats"))
  {
    assert(document["stats"].IsBool());
    const bool stats = document["stats"].GetBool();

    if (stats){
      printStats(1);
    }else{
      printStats(0);
    }
  }


  if (document.HasMember("reports"))
  {
    assert(document["reports"].IsBool());
    const bool stats = document["reports"].GetBool();

    if (stats){
      printReports(1);
    }else{
      printReports(0);
    }
  }

  if (document.HasMember("play"))
  {
    assert(document["play"].IsBool());
    const bool play = document["play"].GetBool();

    if (play){
      sendPlay();
    }
  }

  if (document.HasMember("pause"))
  {
    assert(document["pause"].IsBool());
    const bool pause = document["pause"].GetBool();

    if (pause){
      sendPause();
    }
  }

  if (document.HasMember("volume"))
  {
    assert(document["volume"].IsString());
    const char* vol = document["volume"].GetString();

    sendVolume(vol);
  }

  sb.Clear();
  Writer<StringBuffer> writer(sb);
  out.Accept(writer);
  return sb.GetString();
}