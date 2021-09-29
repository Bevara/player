#include "player.h"

#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include <rapidjson/writer.h>

#include <cstring>

using namespace rapidjson;

extern "C" GF_List *set_dec_entry_args(Dec_Entry *ctx, const char *json)
{
    Document document;
    document.Parse(json);
    assert(document.IsObject());

    GF_List *filters = NULL;

    if (document.HasMember("in_url"))
    {
        GF_Err e;
        assert(document["in_url"].IsString());
        make_fileio(ctx, document["in_url"].GetString(), GF_TRUE, &e);
    }

    if (document.HasMember("autostart"))
    {
        assert(document["autostart"].IsBool());
        ctx->autostart = document["autostart"].GetBool() ? GF_TRUE : GF_FALSE;
    }

#if !defined(__EMSCRIPTEN__)
    filters = gf_list_new();
    add_filters(filters);
    ctx->event_callback = test_callback;
    return filters;
#endif

    if (document.HasMember("evt_callback"))
    {
        ctx->event_callback = reinterpret_cast<event_callback>(document["evt_callback"].GetInt());
    }

    if (document.HasMember("entryLibraries"))
    {
        filters = gf_list_new();

        const Value &entries = document["entryLibraries"];
        assert(entries.IsArray());
        for (SizeType i = 0; i < entries.Size(); i++)
            gf_list_add(filters, reinterpret_cast<GF_FilterRegister *>(entries[i].GetInt()));
    }

    return filters;
}