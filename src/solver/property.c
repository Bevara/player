
#include <gpac/main.h>
#include <gpac/filters.h>

extern GF_FilterSession *session;

s32 find_filter(GF_Filter *item)
{
  u32 i, count;

  count = gf_fs_get_filters_count(session);

  for (i = 0; i < count; i++)
  {
    GF_Filter *filter = gf_fs_get_filter(session, i);
    if (filter == item)return i;
  }

  return -1;
}

static void gf_fs_print_filter_outputs(GF_Filter *f, GF_List *filters_done, u32 indent, GF_FilterPid *pid, GF_Filter *alias_for, u32 src_num_tiled_pids, Bool skip_print, s32 nb_recursion, u32 max_length)
{
  u32 i = 0;

  if (!skip_print)
  {
    while (i < indent)
    {
      GF_LOG(GF_LOG_INFO, GF_LOG_APP, ("-"));
      i++;
    }

    if (src_num_tiled_pids > 1)
    {
      GF_LOG(GF_LOG_INFO, GF_LOG_APP, ("(tilePID[%d]) ", src_num_tiled_pids));
    }
    else if (pid)
    {
      GF_LOG(GF_LOG_INFO, GF_LOG_APP, ("(PID %s)", gf_filter_pid_get_name(pid)));
    }
    if (max_length)
    {
      u32 l;
      if (src_num_tiled_pids)
      {
        char szName[50];
        sprintf(szName, "PID[%d]", src_num_tiled_pids);
        l = (u32)strlen(szName);
      }
      else
      {
        l = (u32)strlen(gf_filter_pid_get_name(pid));
      }
      while (l < max_length)
      {
        GF_LOG(GF_LOG_INFO, GF_LOG_APP, (" "));
        l++;
      }
    }
    if (nb_recursion > 0)
    {
      u32 k = 0;
      while (k < (u32)nb_recursion - 1)
      {
        k++;
        GF_LOG(GF_LOG_INFO, GF_LOG_APP, (" "));
      }
      GF_LOG(GF_LOG_INFO, GF_LOG_APP, ("\\\n"));
      return;
    }
    if (pid)
    {
      if (nb_recursion < 0)
      {
        u32 k = (u32)-nb_recursion;
        while (k > 1)
        {
          k--;
          GF_LOG(GF_LOG_INFO, GF_LOG_APP, ("-"));
        }
        GF_LOG(GF_LOG_INFO, GF_LOG_APP, (">"));
      }
      GF_LOG(GF_LOG_INFO, GF_LOG_APP, (" "));
    }

    GF_LOG(GF_LOG_INFO, GF_LOG_APP, ("%s", gf_filter_get_name(f)));

    GF_LOG(GF_LOG_INFO, GF_LOG_APP, (" (%s=%u)\n", gf_filter_is_dynamic(f) ? "dyn_idx" : "idx", 1 + find_filter(f)));
  }

  if (filters_done && (gf_list_find(filters_done, f) >= 0))
    return;

  if (filters_done)
    gf_list_add(filters_done, f);
  if (alias_for && !skip_print)
  {
    GF_LOG(GF_LOG_INFO, GF_LOG_APP, (" (<=> "));
    GF_LOG(GF_LOG_INFO, GF_LOG_APP, ("%s", gf_filter_get_name(alias_for)));
    if (gf_filter_get_id(alias_for))
    {
      GF_LOG(GF_LOG_INFO, GF_LOG_APP, (" ID=%s", gf_filter_get_id(alias_for)));
    }
    else
    {
      GF_LOG(GF_LOG_INFO, GF_LOG_APP, (" ptr=%p", alias_for));
    }
    GF_LOG(GF_LOG_INFO, GF_LOG_APP, (")\n"));
  }

  GF_List *dests = gf_list_new();
  for (i = 0; i < gf_filter_get_opid_count(f); i++)
  {
    u32 j;
    GF_FilterPid *pidout = gf_filter_get_opid(f, i);
   
    for (j = 0; gf_filter_pid_enum_destinations(pidout, j) != NULL; j++)
    {
      GF_Filter* f_dest = gf_filter_pid_enum_destinations(pidout, j);
      gf_list_add(dests, f_dest);
    }
  }

  while (gf_list_count(dests))
  {
    GF_Filter *dest = gf_list_pop_front(dests);
    GF_List *pids = gf_list_new();
    u32 max_name_len = 0;
    u32 num_tile_pids = 0;
    for (i = 0; i < gf_filter_get_opid_count(f); i++)
    {
      u32 j;
      GF_FilterPid *pidout = gf_filter_get_opid(f, i);
      for (j = 0; gf_filter_pid_enum_destinations(pidout, j) != NULL; j++)
      {
        GF_Filter *f = gf_filter_pid_enum_destinations(pidout, j);
        if (f != dest)
          continue;
        gf_list_add(pids, gf_filter_get_ipid(f,0));
      }
      u32 plen = (u32)strlen(gf_filter_pid_get_name(pidout));

      const GF_PropertyValue *p = gf_filter_pid_get_property(pidout, GF_PROP_PID_CODECID);
      if (p &&
          ((p->value.uint == GF_CODECID_HEVC_TILES) || (p->value.uint == GF_CODECID_VVC_SUBPIC)))
      {
        plen = 0;
        if (!num_tile_pids)
        {
          for (j = 0; j < gf_filter_get_opid_count(f); j++)
          {
            GF_FilterPid *apid = gf_filter_get_opid(f, j);
            p = gf_filter_pid_get_property(apid, GF_PROP_PID_CODECID);
            // if this is a tile pid, check if it is connected to our destination
            if (p &&
                ((p->value.uint == GF_CODECID_HEVC_TILES) || (p->value.uint == GF_CODECID_VVC_SUBPIC)))
            {
              u32 k;
              for (k = 0; gf_filter_pid_enum_destinations(apid, k) != NULL; k++)
              {
                GF_Filter *f = gf_filter_pid_enum_destinations(apid, k);
                if (f != dest)
                  continue;
                num_tile_pids++;
              }
            }
          }
          plen = 5;
          j = 0;
          while (j < num_tile_pids)
          {
            plen += 1;
            j += 10;
          }
        }
      }
      if (plen > max_name_len)
        max_name_len = plen;
    }
    s32 nb_pids_print = gf_list_count(pids);
    if (nb_pids_print == 1)
      nb_pids_print = 0;
    if (num_tile_pids)
      nb_pids_print -= num_tile_pids - 1;
    s32 nb_final_pids = nb_pids_print;
    if (nb_pids_print)
      nb_pids_print++;
    Bool first_tile = GF_TRUE;

    for (i = 0; i < gf_filter_get_opid_count(f); i++)
    {
      u32 j, k;
      Bool is_tiled = GF_FALSE;
      Bool skip_tiled = skip_print;

      GF_FilterPid *pidout = gf_filter_get_opid(f, i);
      if (num_tile_pids)
      {
        const GF_PropertyValue *p = gf_filter_pid_get_property(pidout, GF_PROP_PID_CODECID);
        if (p &&
            ((p->value.uint == GF_CODECID_HEVC_TILES) || (p->value.uint == GF_CODECID_VVC_SUBPIC)))
        {
          is_tiled = GF_TRUE;
        }
      }

      for (j = 0; gf_filter_pid_enum_destinations(pidout, j) != NULL; j++)
      {
        GF_Filter *alias = NULL;
        GF_Filter *f = gf_filter_pid_enum_destinations(pidout, j);
        if (f != dest)
          continue;

        gf_list_del_item(pids, gf_filter_get_ipid(f,0));
        if (nb_pids_print && !gf_list_count(pids))
          nb_pids_print = 0;
        else if (is_tiled)
        {
          if (!first_tile)
            continue;
          nb_pids_print = 0;
          first_tile = GF_FALSE;
        }

        for (k = 0; gf_filter_pid_enum_destinations(pidout, k) != NULL; k++)
        {
          alias = gf_filter_pid_enum_destinations(pidout, k);
          if (alias == f)
            break;
          alias = NULL;
        }
        if (alias)
        {
          gf_fs_print_filter_outputs(alias, filters_done, indent + 1, pidout, f, is_tiled ? num_tile_pids : src_num_tiled_pids, skip_tiled, nb_pids_print - nb_final_pids, max_name_len);
        }
        else
        {
          gf_fs_print_filter_outputs(f, filters_done, indent + 1, pidout, NULL, is_tiled ? num_tile_pids : src_num_tiled_pids, skip_tiled, nb_pids_print - nb_final_pids, max_name_len);
        }
      }
      if (nb_pids_print)
        nb_pids_print++;
    }
    gf_list_del(pids);
  }
  gf_list_del(dests);
}

const char *gf_fs_filters_registers_name(GF_FilterRegister *reg)
{
  return reg->name;
}

const char *getRegisteredFilters()
{
  u32 i, count;

  gf_fs_print_connections(session);
  return "test1";
}

void printallconnections()
{
  u32 i, count;
  Bool has_undefined = GF_FALSE;
  Bool has_connected = GF_FALSE;
  GF_List *filters_done;
  GF_LOG(GF_LOG_INFO, GF_LOG_APP, ("\n"));
  // gf_mx_p(session->filters_mx);

  filters_done = gf_list_new();

  count = gf_fs_get_filters_count(session);
  for (i = 0; i < count; i++)
  {
    GF_Filter *f = gf_fs_get_filter(session, i);

    if (gf_filter_get_ipid_count(f) > 0)
      continue;

    if (gf_filter_get_opid_count(f) == 0)
      continue;
    if (!has_connected)
    {
      has_connected = GF_TRUE;
      GF_LOG(GF_LOG_INFO, GF_LOG_APP, ("Filters connected:\n"));
    }
    gf_fs_print_filter_outputs(f, filters_done, 0, NULL, NULL, 0, GF_FALSE, 0, 0);
  }

  // gf_mx_v(session->filters_mx);
  gf_list_del(filters_done);
}

const char *getConnections()
{
  u32 i, count;

  gf_fs_print_connections(session);
  return "test1";
}

const char *getNonConnected()
{
  gf_fs_print_non_connected(session);
  return "test2";
}

GF_EXPORT
const char *get_property(const char *property)
{

  if (strcmp(property, "connections") == 0)
  {
    return getConnections();
  }
  else if (strcmp(property, "nonConnected") == 0)
  {
    return getNonConnected();
  }
  else if (strcmp(property, "registered") == 0)
  {
    return getRegisteredFilters();
  }

  return "";
}