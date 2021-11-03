#include <emscripten/emscripten.h>

typedef struct _Entry
{

} Entry;

extern void njInit(void);
extern int njDecode(const void* jpeg, const int size);
extern unsigned char* njGetImage(void);
extern int njGetImageSize(void);
extern int njGetWidth(void);
extern int njGetHeight(void);

int EMSCRIPTEN_KEEPALIVE constructor(const void* jpeg, const int size)
{
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