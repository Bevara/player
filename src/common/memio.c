
#include "common.h"
#include "gpac/network.h"

static s64 fio_mem_tell(GF_FileIO *fileio);

static GF_Err fio_mem_seek(GF_FileIO *fileio, u64 offset, s32 whence)
{
  MemIOCtx *ioctx = gf_fileio_get_udta(fileio);
  switch (whence)
  {
  case SEEK_SET:
    ioctx->_p = *ioctx->data + offset;
    break;

  case SEEK_END:
    ioctx->_p = *ioctx->data + *ioctx->numBytes + offset;
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
  u8 *p;

  MemIOCtx *ioctx = gf_fileio_get_udta(fileio);
  p = buffer;
  int remaining = *ioctx->numBytes - fio_mem_tell(fileio);

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
   char *p;
    
    MemIOCtx *ioctx = gf_fileio_get_udta(fileio);
    p = buffer;
    int remaining = *ioctx->numBytes - fio_mem_tell(fileio);
    
    if (bytes > remaining)
    {
        int pos = fio_mem_tell(fileio);
        *ioctx->numBytes = bytes + *ioctx->numBytes - remaining;
        *ioctx->data = realloc (*ioctx->data, *ioctx->numBytes);
        ioctx->_p = *ioctx->data + pos;
        
        if (!*ioctx->data)
            return 0;
    }
    
    (void)memcpy((void *)ioctx->_p, (void *)p, bytes);
    ioctx->_p += bytes;
    return bytes;
}

static s64 fio_mem_tell(GF_FileIO *fileio)
{
  s64 tell = 0;
  MemIOCtx *ioctx = gf_fileio_get_udta(fileio);
  tell = ioctx->_p - *ioctx->data;
  return tell;
}

static Bool fio_mem_eof(GF_FileIO *fileio)
{
  Bool eof = GF_FALSE;
  MemIOCtx *ioctx = gf_fileio_get_udta(fileio);
  eof = ioctx->_p == (*ioctx->data + *ioctx->numBytes);
  return eof;
}

static int fio_mem_printf(GF_FileIO *fileio, const char *format, va_list args)
{
  int ret = 0;
  MemIOCtx *ioctx = (MemIOCtx *)gf_fileio_get_udta(fileio);
  if (!ioctx->_p)
    return -1;
  //ret = vfprintf((char*)ioctx->_p, format, args);
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
			gf_fileio_del(fileio_ref);
			if (ioctx_ref->path) gf_free(ioctx_ref->path);
			gf_free(ioctx_ref);
		}
		return NULL;
	}

	//file handle not opened, we can use the current gfio
	if (!ioctx_ref->_p && (!strnicmp(url, "gfio://", 7) || !strcmp(url, ioctx_ref->path)) ) {
		ioctx_ref->_p = *ioctx_ref->data;

		file_size = *ioctx_ref->numBytes;
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

	file_size = *ioctx_ref->numBytes;
	if (strchr(mode, 'r'))
		gf_fileio_set_stats(gfio, file_size,file_size, GF_TRUE, 0);
	return gfio;
}

const char *make_fileio(Entry *entry, const char *inargs,   char **data, size_t *numBytes, Bool is_input, GF_Err *e)
{
  MemIOCtx *ioctx;
  GF_FileIO *fio;

  GF_SAFEALLOC(ioctx, MemIOCtx);
  ioctx->path = gf_strdup(inargs);
  ioctx->data = data;
  ioctx->numBytes = numBytes;

  fio = gf_fileio_new(ioctx->path, ioctx, fio_mem_open, fio_mem_seek, fio_mem_read, fio_mem_write, fio_mem_tell, fio_mem_eof, fio_mem_printf);
  if (!fio)
  {
    *e = GF_OUT_OF_MEM;
    return NULL;
  }
  
  if (!entry->all_gfio_defined) {
		entry->all_gfio_defined = gf_list_new();
		if (!entry->all_gfio_defined) return NULL;
	}

  //keep alive until end
  ioctx->nb_refs = 1;

  return gf_fileio_url(fio);
}

void del_mem_fileio(GF_FileIO *fileio)
{
  MemIOCtx *ioctx = gf_fileio_get_udta(fileio);
  free(fileio);
}