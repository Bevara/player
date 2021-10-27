#include "player.h"

#include <gpac/main.h>
#include <gpac/filters.h>
#include <gpac/thread.h>
#include <gpac/network.h>
#include <gpac/terminal.h>

#include <emscripten/fetch.h>
#include <emscripten/emscripten.h>

typedef struct
{
  emscripten_fetch_t *fetch;
  char *_p;
  char *path;
  Bool write;
  u32 nb_refs;
} MemIOCtx;

void downloadProgress(emscripten_fetch_t *fetch)
{
  Dec_Entry *entry = (Dec_Entry *)fetch->userData;

  GF_Event event;
  event.type = GF_EVENT_PROGRESS;
  event.progress.progress_type = 1;

  if (fetch->totalBytes)
  {
    event.progress.done = fetch->dataOffset;
    event.progress.total = fetch->totalBytes;
  }
  else
  {
    event.progress.done = fetch->dataOffset + fetch->numBytes;
    event.progress.total = 0;
  }

  gf_term_send_event(entry->term, &event);
}

void downloadSucceeded(emscripten_fetch_t *fetch)
{
  Dec_Entry *entry = (Dec_Entry *)fetch->userData;
  MemIOCtx *ioctx = (MemIOCtx *)entry->IOCtx;

  ioctx->_p = NULL;

  GF_Event event;
  event.type = GF_EVENT_PROGRESS;
  event.progress.progress_type = 1;
  event.progress.done = fetch->numBytes;
  event.progress.total = fetch->numBytes;
  gf_term_send_event(entry->term, &event);

  if (entry->success_callback)
  {
    entry->success_callback(entry);
  }
}

void downloadFailed(emscripten_fetch_t *fetch)
{
  Dec_Entry *entry = (Dec_Entry *)fetch->userData;
  MemIOCtx *ioctx = (MemIOCtx *)entry->IOCtx;
  printf("Downloading %s failed, HTTP failure status code: %d.\n", fetch->url, fetch->status);
  emscripten_fetch_close(fetch);

  GF_Event event;
  event.type = GF_EVENT_PROGRESS;
  event.progress.progress_type = 1;
  event.progress.done = -1;
  event.progress.total = -1;
  gf_term_send_event(entry->term, &event);
}

static GF_List *all_gfio_defined = NULL;

static s64 fio_mem_tell(GF_FileIO *fileio);

static GF_Err fio_mem_seek(GF_FileIO *fileio, u64 offset, s32 whence)
{
  MemIOCtx *ioctx = gf_fileio_get_udta(fileio);
  switch (whence)
  {
  case SEEK_SET:
    ioctx->_p = ioctx->fetch->data + offset;
    break;

  case SEEK_END:
    ioctx->_p = ioctx->fetch->data + ioctx->fetch->numBytes + offset;
    break;
  case SEEK_CUR:
    ioctx->_p += offset;
  default:
    return GF_BAD_PARAM;
  }
  return GF_OK;
}
static u32 fio_mem_read(GF_FileIO *fileio, u8 *buffer, u32 bytes)
{
  char *p;

  MemIOCtx *ioctx = gf_fileio_get_udta(fileio);
  p = buffer;
  int remaining = ioctx->fetch->numBytes - fio_mem_tell(fileio);

  if (bytes > remaining)
  {
    (void)memcpy((void *)p, (void *)ioctx->_p, remaining);
    ioctx->_p += remaining;

    return remaining;
  }

  (void)memcpy((void *)p, (void *)ioctx->_p, bytes);
  ioctx->_p += bytes;
  return bytes;
}

static u32 fio_mem_write(GF_FileIO *fileio, u8 *buffer, u32 bytes)
{
  /* char *p;

    MemIOCtx *ioctx = gf_fileio_get_udta(fileio);
    p = buffer;
    int remaining = *ioctx->length - fio_mem_tell(fileio);

    if (bytes > remaining)
    {
        int pos = fio_mem_tell(fileio);
        *ioctx->length = bytes + *ioctx->length - remaining;
        *ioctx->data = realloc (*ioctx->data, *ioctx->length);
        ioctx->_p = *ioctx->data + pos;

        if (!*ioctx->data)
            return 0;
    }

    (void)memcpy((void *)ioctx->_p, (void *)p, bytes);
    ioctx->_p += bytes;
    return bytes;*/
  return 0;
}

static s64 fio_mem_tell(GF_FileIO *fileio)
{
  s64 tell = 0;
  MemIOCtx *ioctx = gf_fileio_get_udta(fileio);
  tell = ioctx->_p - ioctx->fetch->data;
  return tell;
}

static Bool fio_mem_eof(GF_FileIO *fileio)
{
  Bool eof = GF_FALSE;
  MemIOCtx *ioctx = gf_fileio_get_udta(fileio);
  eof = ioctx->_p == (ioctx->fetch->data + ioctx->fetch->numBytes);
  return eof;
}

static int fio_mem_printf(GF_FileIO *fileio, const char *format, va_list args)
{
  int ret = 0;
  MemIOCtx *ioctx = (MemIOCtx *)gf_fileio_get_udta(fileio);
  if (!ioctx->_p)
    return -1;
  ret = vfprintf(ioctx->_p, format, args);
  return ret;
}

static GF_FileIO *fio_mem_open(GF_FileIO *fileio_ref, const char *url, const char *mode, GF_Err *out_err)
{
  GF_FileIO *gfio;
	MemIOCtx *ioctx;
	u64 file_size;
	MemIOCtx *ioctx_ref = gf_fileio_get_udta(fileio_ref);

  *out_err = GF_OK;

  if (!strcmp(mode, "ref"))
  {
    ioctx_ref->nb_refs++;
    return fileio_ref;
  }
  if (!strcmp(mode, "unref"))
  {
    if (!ioctx_ref->nb_refs)
      return NULL;
    ioctx_ref->nb_refs--;
    if (ioctx_ref->nb_refs)
      return fileio_ref;

    url = NULL;
  }

  if (!strcmp(mode, "url"))
  {
    if (!url)
      return NULL;
    GF_SAFEALLOC(ioctx, MemIOCtx);
    ioctx->path = gf_url_concatenate(ioctx_ref->path, url);
    gfio = gf_fileio_new(ioctx->path, ioctx, fio_mem_open, fio_mem_seek, fio_mem_read, fio_mem_write, fio_mem_tell, fio_mem_eof, fio_mem_printf);
    //remember it but no need to keep a ref on it
    gf_list_add(all_gfio_defined, gfio);
    return gfio;
  }
  if (!strcmp(mode, "probe"))
  {
    if (!gf_file_exists(url))
      *out_err = GF_URL_ERROR;
    return NULL;
  }

	if (!url) {
		//if (ioctx_ref->filep) gf_fclose(ioctx_ref->filep);
		ioctx_ref->_p = NULL;

		if (!ioctx_ref->nb_refs) {
			gf_list_del_item(all_gfio_defined, fileio_ref);
			gf_fileio_del(fileio_ref);
			if (ioctx_ref->path) gf_free(ioctx_ref->path);
			gf_free(ioctx_ref);
		}
		return NULL;
	}

	//file handle not opened, we can use the current gfio
	if (!ioctx_ref->_p && (!strnicmp(url, "gfio://", 7) || !strcmp(url, ioctx_ref->path)) ) {
		ioctx_ref->_p = ioctx_ref->fetch->data;

		file_size = ioctx_ref->fetch->numBytes;
		if (strchr(mode, 'r'))
			gf_fileio_set_stats(fileio_ref, file_size,file_size, GF_TRUE, 0);
		return fileio_ref;
	}

	//file handle already open (file is being opened twice), create a new gfio
	GF_SAFEALLOC(ioctx, MemIOCtx);

	if (strnicmp(url, "gfio://", 7)) {
		ioctx->path = gf_url_concatenate(ioctx_ref->path, url);
	} else {
		ioctx->path = gf_strdup(ioctx_ref->path);
	}
  ioctx->fetch = ioctx_ref->fetch;
	ioctx->_p = ioctx_ref->fetch->data;

	if (!ioctx->_p) {
		*out_err = GF_IO_ERR;
		if (ioctx->path) gf_free(ioctx->path);
		gf_free(ioctx);
		return NULL;
	}
	gfio = gf_fileio_new(ioctx->path, ioctx, fio_mem_open, fio_mem_seek, fio_mem_read, fio_mem_write, fio_mem_tell, fio_mem_eof, fio_mem_printf);
	if (!gfio) {
		*out_err = GF_OUT_OF_MEM;
	}

	file_size = ioctx_ref->fetch->numBytes;
	if (strchr(mode, 'r'))
		gf_fileio_set_stats(gfio, file_size,file_size, GF_TRUE, 0);
	return gfio;
}

static const char* custom_headers[3] = {"Token", "00000000-0000-0000-0000-000000000000", NULL};

const char *make_fileio(Dec_Entry *entry, const char *inargs, Bool is_input, GF_Err *e)
{
  MemIOCtx *ioctx;
  GF_FileIO *fio;

  GF_SAFEALLOC(ioctx, MemIOCtx);
  ioctx->path = gf_strdup(inargs);

  fio = gf_fileio_new(ioctx->path, ioctx, fio_mem_open, fio_mem_seek, fio_mem_read, fio_mem_write, fio_mem_tell, fio_mem_eof, fio_mem_printf);
  if (!fio)
  {
    *e = GF_OUT_OF_MEM;
    return NULL;
  }
  if (!all_gfio_defined)
  {
    all_gfio_defined = gf_list_new();
    if (!all_gfio_defined)
      return NULL;
  }
  gf_list_add(all_gfio_defined, fio);
  //keep alive until end
  ioctx->nb_refs = 1;

  entry->fio_url = gf_fileio_url(fio);
  entry->fio = fio;
  entry->IOCtx = ioctx;

  emscripten_fetch_attr_t attr;
  emscripten_fetch_attr_init(&attr);
  strcpy(attr.requestMethod, "GET");
  attr.requestHeaders = custom_headers;


  attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
  attr.onsuccess = downloadSucceeded;
  attr.onprogress = downloadProgress;
  attr.onerror = downloadFailed;
  attr.userData = entry;
  ioctx->fetch = emscripten_fetch(&attr, ioctx->path);

  return entry->fio_url;
}

void del_mem_fileio(GF_FileIO *fileio)
{
  MemIOCtx *ioctx = gf_fileio_get_udta(fileio);
  if (ioctx->fetch)
    emscripten_fetch_close(ioctx->fetch);
  free(fileio);
}
