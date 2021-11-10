#include <string.h>
#include <stdio.h>

#include "common.h"


#include <emscripten/emscripten.h>
#include <emscripten/fetch.h>

typedef struct _Entry
{

} Entry;

extern void njInit(void);
extern int njDecode(const void* jpeg, const int size);
extern unsigned char* njGetImage(void);
extern int njGetImageSize(void);
extern int njGetWidth(void);
extern int njGetHeight(void);


void downloadSucceeded(emscripten_fetch_t *fetch) {
  //printf("Finished downloading %llu bytes from URL %s.\n", fetch->numBytes, fetch->url);
  // The data is now available at fetch->data[0] through fetch->data[fetch->numBytes-1];
  emscripten_fetch_close(fetch); // Free data associated with the fetch.
}

void downloadFailed(emscripten_fetch_t *fetch) {
  //printf("Downloading %s failed, HTTP failure status code: %d.\n", fetch->url, fetch->status);
  emscripten_fetch_close(fetch); // Also free data on failure.
}

int EMSCRIPTEN_KEEPALIVE constructor(const char* attrs, const void* jpeg, const int size)
{

  emscripten_fetch_attr_t attr;
  emscripten_fetch_attr_init(&attr);
  strcpy(attr.requestMethod, "GET");
  attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
  attr.onsuccess = downloadSucceeded;
  attr.onerror = downloadFailed;
  emscripten_fetch(&attr, attrs);

    njInit();
    return njDecode(jpeg, size);
}

unsigned char* EMSCRIPTEN_KEEPALIVE getImage(){
    return njGetImage();
}

int EMSCRIPTEN_KEEPALIVE getSize(){
    return njGetImageSize();
}

int EMSCRIPTEN_KEEPALIVE getHeight(){
    return njGetHeight();
}

int EMSCRIPTEN_KEEPALIVE getWidth(){
    return njGetWidth();
}



EMSCRIPTEN_KEEPALIVE void destructor(Entry* entry)
{

}